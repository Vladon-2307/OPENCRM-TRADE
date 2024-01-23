import { ApiProperty } from "@nestjs/swagger"
import { ResponseData } from "../../core/response"
import { TokenDto } from "./token.dto"

export class LoginDto {
	@ApiProperty({ example: "admin" })
	login: string

	@ApiProperty({ example: "admin" })
	password: string
}

export class ResSwaggerLogin extends ResponseData<TokenDto> {
	@ApiProperty()
	data: TokenDto
}
