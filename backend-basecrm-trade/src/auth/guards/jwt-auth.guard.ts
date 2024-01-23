import { ExecutionContext, HttpException, Injectable } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { responseData } from "../../core/response"

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
	canActivate(context: ExecutionContext) {
		return super.canActivate(context)
	}

	handleRequest(err, user, info) {
		if (err || !user) {
			throw new HttpException(responseData(401, "Ошибка авторизации"), 401)
		}
		return user
	}
}
