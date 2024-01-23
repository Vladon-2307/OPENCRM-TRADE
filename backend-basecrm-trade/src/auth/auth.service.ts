import { Injectable } from "@nestjs/common"
import { LoginDto } from "./dto/login.dto"
import { UserService } from "../user/user.service"
import { JwtService } from "@nestjs/jwt"
import { responseData } from "../core/response"
import { TokenDto } from "./dto/token.dto"

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {}

	async login(loginDto: LoginDto) {
		try {
			const user = await this.userService.validate(
				loginDto.login,
				loginDto.password
			)
			if (!user) {
				return responseData(401, "Неверныйлогин или пароль")
			}

			const token = this.generatorToken(user)
			return responseData<TokenDto>(200, "Авторизация завершина успешно", token)
		} catch (e) {
			return responseData(
				500,
				"Непредвидена ошибка свяжитесь с разаработчиком",
				e
			)
		}
	}

	generatorToken(user: { id: number; login: string; role: string }): TokenDto {
		const token = this.jwtService.sign({
			id: user.id,
			login: user.login,
			role: user.role
		})
		return { token: token }
	}

	refresh(user) {
		return responseData<TokenDto>(
			200,
			"Авторизация успешно обновлена",
			this.generatorToken({
				id: user.id,
				login: user.login,
				role: user.role
			})
		)
	}
}
