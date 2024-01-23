import { ApiProperty } from "@nestjs/swagger"
import { ResponseData } from "../../core/response"
import { TokenDto } from "./token.dto"

export class LoginDto {
	@ApiProperty()
	login: string

	@ApiProperty()
	password: string
}

export class ResSwaggerLogin extends ResponseData<TokenDto> {
	@ApiProperty()
	data: TokenDto
}
