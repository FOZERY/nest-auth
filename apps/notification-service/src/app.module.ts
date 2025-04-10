import { Module } from "@nestjs/common";
import { SharedConfigModule } from "@shared";
import { ExternalModule } from "./external/external.module";
import { ModulesModule } from "./modules/modules.module";

@Module({
	imports: [SharedConfigModule, ExternalModule, ModulesModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
