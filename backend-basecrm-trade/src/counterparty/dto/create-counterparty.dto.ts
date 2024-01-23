import { IsString } from "nestjs-swagger-dto"

export class CreateCounterpartyDto {
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
}
