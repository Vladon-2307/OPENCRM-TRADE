import { Module } from "@nestjs/common"
import { CounterpartyModule } from "./counterparty/counterparty.module"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserModule } from "./user/user.module"
import { AuthModule } from "./auth/auth.module"

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, envFilePath: "../.env" }),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: "mysql",
				host: configService.get("DB_HOST"),
				port: +configService.get("DB_PORT"),
				username: configService.get("DB_USERNAME"),
				password: configService.get("DB_PASSWORD"),
				database: configService.get("DB_DATABASE"),
				autoLoadEntities: true,
				synchronize: true
			}),
			inject: [ConfigService]
		}),
		CounterpartyModule,
		UserModule,
		AuthModule
	]
})
export class AppModule {}
