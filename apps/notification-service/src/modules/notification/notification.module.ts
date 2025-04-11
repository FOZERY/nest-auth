import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { NotificationConsumer } from "./notification.consumer";
import { NotificationGateway } from "./notification.gateway";

@Module({
	controllers: [NotificationConsumer],
	imports: [AuthModule],
	providers: [NotificationGateway],
})
export class NotificationModule {}
