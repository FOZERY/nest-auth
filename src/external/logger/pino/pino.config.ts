import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import { LoggerModuleAsyncParams } from "nestjs-pino";
import os from "node:os";
import { DestinationStream } from "pino";
import PinoPretty from "pino-pretty";
import { LogMessage } from "./pino-pretty-transport";

export const pinoConfig: LoggerModuleAsyncParams = {
	imports: [],
	inject: [ConfigService],
	useFactory: (config: ConfigService) => {
		const level: string = config.get<string>("LOG_LEVEL") ?? "info";

		let stream: DestinationStream | undefined = undefined;
		if (config.get<boolean>("LOG_TO_CONSOLE")) {
			if (config.get("NODE_ENV") === "development") {
				stream = PinoPretty({
					colorize: true,
					singleLine: false,
					messageFormat(log: LogMessage, messageKey: string, _, { colors }) {
						const formattedContext = log.context
							? `${colors.gray(`[${log.context}]`)} `
							: "";

						let reqIdPart = "";

						if (log.req && typeof log.req === "object") {
							if ("id" in log.req && log.req.id) {
								reqIdPart = `${colors.yellow(`REQ_ID`)}:${colors.yellowBright(log.req.id)} `;
							}
						}

						const message: string = log[messageKey] as string;

						return `${formattedContext}${reqIdPart}– ${message}`;
					},
				});
			}
		}

		return {
			pinoHttp: {
				level: level,
				enabled: config.get<boolean>("LOG_TO_CONSOLE"),
				genReqId: (req, res) => {
					// trace logging
					const existingID = req.id ?? req.headers["X-Request-Id"];
					if (existingID) return existingID;
					const id = randomUUID();
					res.setHeader("X-Request-Id", id);
					return id;
				},
				autoLogging: true,
				stream: stream,
				base: {
					pid: process.pid,
					hostname: os.hostname(),
					app: config.get<string>("APP_NAME"),
					context: "NestApplication",
					env: config.get<string>("NODE_ENV"),
				},
			},
		};
	},
};
