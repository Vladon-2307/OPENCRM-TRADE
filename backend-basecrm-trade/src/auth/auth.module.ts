import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { UserModule } from "../user/user.module"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtStrategy } from "./strategy/jwt.strategy"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get("JWT_SECRET", "secret"),
				signOptions: {
					expiresIn: configService.get("JWT_EXP", "12h")
				}
			}),
			inject: [ConfigService]
		}),
		UserModule
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, JwtAuthGuard]
})
export class AuthModule {}
