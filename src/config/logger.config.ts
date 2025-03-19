import { ConfigModule, ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import { LoggerModuleAsyncParams } from "nestjs-pino";
import os from "node:os";
import path from "path";
import { TransportTargetOptions } from "pino";
import { PrettyOptions } from "pino-pretty";

export const loggerConfig: LoggerModuleAsyncParams = {
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: (config: ConfigService) => {
		const level: string = config.get<string>("LOG_LEVEL") ?? "info";
		const targets: TransportTargetOptions[] = [];

		if (config.get("LOG_TO_CONSOLE") === "true") {
			if (process.env.NODE_ENV === "development") {
				targets.push({
					target: path.resolve(__dirname, "pino", "pino-pretty-transport"),
					options: {
						colorize: true,
						singleLine: false,
					} as PrettyOptions,
				});
			} else {
				targets.push({
					target: "pino/file",
					options: {
						destination: 1,
					},
				});
			}
		}

		return {
			pinoHttp: {
				level: level,
				genReqId: (req, res) => {
					// trace logging
					const existingID = req.id ?? req.headers["X-Request-Id"];
					if (existingID) return existingID;
					const id = randomUUID();
					res.setHeader("X-Request-Id", id);
					return id;
				},
				autoLogging: true,
				transport: {
					targets: targets,
				},
				base: {
					pid: process.pid,
					hostname: os.hostname(),
					app: config.get("APP_NAME") ?? "nestjs-api",
					context: "NestApplication",
					env: process.env.NODE_ENV,
				},
			},
		};
	},
};
