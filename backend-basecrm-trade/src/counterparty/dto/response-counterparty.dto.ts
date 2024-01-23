import { IsDate, IsNumber, IsString } from "nestjs-swagger-dto"
import { ResponseData } from "../../core/response"
import { ApiProperty } from "@nestjs/swagger"

export class ResponseCounterpartyDto {
	@IsNumber({ optional: true })
	id: number

	@IsString()
	name: string

	@IsString()
	account_number: string

	@IsString()
	bank_name: string

	@IsString()
	code_bank: string

	@IsString()
	legal_address: string

	@IsString()
	mailing_address: string

	@IsString()
	phone: string

	@IsString()
	unn: string

	@IsString()
	okpo: string

	@IsDate({ format: "date-time", optional: true })
	created_at: Date

	@IsDate({ format: "date-time", optional: true })
	updated_at: Date
}

export class ResSwaggerCounterparty extends ResponseData<ResponseCounterpartyDto> {
	@ApiProperty()
	data: ResponseCounterpartyDto
}

export class ResponseCounterpartyFindAllDto {
	@ApiProperty()
	count: number
	@ApiProperty()
	data: ResponseCounterpartyDto[]
}

export class ResSwaggerCounterpartyMany extends ResponseData<ResponseCounterpartyFindAllDto> {
	@ApiProperty()
	data: ResponseCounterpartyFindAllDto
}
