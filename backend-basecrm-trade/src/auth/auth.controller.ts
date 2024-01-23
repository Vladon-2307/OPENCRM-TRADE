import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger"
import { LoginDto, ResSwaggerLogin } from "./dto/login.dto"
import { ResponseData } from "../core/response"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"

@ApiTags("auth")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("sign-in")
	@ApiResponse({
		status: "2XX",
		type: ResSwaggerLogin
	})
	@ApiResponse({
		status: "default",
		type: ResponseData,
		description: "If there is an error"
	})
	login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto)
	}

	@UseGuards(JwtAuthGuard)
	@Get("refresh")
	@ApiBearerAuth()
	refresh(@Req() req) {
		return this.authService.refresh(req.user)
	}
}
