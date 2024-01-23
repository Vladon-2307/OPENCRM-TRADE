import { ApiProperty } from "@nestjs/swagger"

export function responseData<T>(
	code: number,
	message: string,
	data?: T
): ResponseData<T> {
	return {
		status: code,
		message: message,
		data: data
	}
}

export class ResponseData<T> {
	@ApiProperty()
	status: number
	@ApiProperty()
	message: string
	data?: T
}
