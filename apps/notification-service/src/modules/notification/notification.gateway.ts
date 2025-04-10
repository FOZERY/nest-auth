import { Logger, UseGuards } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	type OnGatewayInit,
} from "@nestjs/websockets";
import type { Server, Socket } from "socket.io";
import { SocketAuthGuard } from "../auth/guards/socket-auth.guard";
import { SocketAuthMiddleware } from "../auth/middlewares/socket-auth.middleware";
import { NotificationPayload } from "./types/notification.types";

@WebSocketGateway({
	namespace: "notification",
})
@UseGuards(SocketAuthGuard)
export class NotificationGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	private readonly logger = new Logger(NotificationGateway.name);

	@WebSocketServer()
	server: Server;

	constructor(private readonly socketAuthMiddleware: SocketAuthMiddleware) {}

	public afterInit(server: Server) {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		server.use(async (socket, next) => {
			await this.socketAuthMiddleware.use(socket, next);
		});
	}

	public handleConnection(client: Socket) {
		this.logger.log(`Client connected: ${client.id}`);
		client.emit("notification", { message: "Connected to notification service" });
	}

	public handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	public sendNotification(notification: NotificationPayload) {
		this.logger.log("Sending notification to user %s", notification.userId);
		this.server.to(notification.userId).emit("notification", notification.message);
	}
}
