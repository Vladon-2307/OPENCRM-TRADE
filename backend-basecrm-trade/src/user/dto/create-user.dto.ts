import { IsEnum, IsString } from "nestjs-swagger-dto"

export class CreateUserDto {
	@IsString()
	login: string

	@IsString()
	password: string

	@IsEnum({ enum: { roles: ["ADMIN", "USER"] } })
	role: string
}
