import { HttpException } from "@nestjs/common"
import { responseData } from "./response"

export function isAdmin(role: string) {
	if (role != "ADMIN") {
		throw new HttpException(responseData(403, "Доступ запрещён"), 403)
	}
}
