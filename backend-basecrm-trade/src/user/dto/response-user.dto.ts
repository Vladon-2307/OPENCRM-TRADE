import { IsDate, IsEnum, IsNumber, IsString } from "nestjs-swagger-dto"

export class ResponseUserDto {
	@IsNumber()
	id: number

	@IsString()
	login: string

	@IsEnum({ enum: { roles: ["ADMIN", "USER"] } })
	role: string

	@IsDate({ format: "date-time", optional: true })
	created_at: Date

	@IsDate({ format: "date-time", optional: true })
	updated_at: Date
}
