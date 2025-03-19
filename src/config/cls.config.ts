import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { ClsModuleOptions } from "nestjs-cls";
import { PrismaModule } from "../external/persistence/prisma/prisma.module";
import { PrismaService } from "../external/persistence/prisma/prisma.service";

export const clsConfig: ClsModuleOptions = {
	plugins: [
		new ClsPluginTransactional({
			imports: [PrismaModule],
			adapter: new TransactionalAdapterPrisma({
				prismaInjectionToken: PrismaService,
			}),
		}),
	],
};
