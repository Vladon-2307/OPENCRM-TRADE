import { HttpException, Injectable } from "@nestjs/common"
import { CreateCounterpartyDto } from "./dto/create-counterparty.dto"
import { UpdateCounterpartyDto } from "./dto/update-counterparty.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { CounterpartyEntity } from "./entities/counterparty.entity"
import { Like, Repository } from "typeorm"
import { ResponseData, responseData } from "../core/response"
import {
	ResponseCounterpartyDto,
	ResponseCounterpartyFindAllDto
} from "./dto/response-counterparty.dto"

@Injectable()
export class CounterpartyService {
	constructor(
		@InjectRepository(CounterpartyEntity)
		private counterpartyRepository: Repository<CounterpartyEntity>
	) {}

	async create(
		createCounterpartyDto: CreateCounterpartyDto
	): Promise<ResponseData<any>> {
		try {
			const counterparty = await this.counterpartyRepository.findOne({
				where: {
					name: createCounterpartyDto.name,
					unn: createCounterpartyDto.unn
				}
			})
			if (!!counterparty) {
				throw new Error("exists")
			}
			await this.counterpartyRepository.save(
				this.counterpartyRepository.create(createCounterpartyDto)
			)
			return responseData(201, "Контрагент успешно сосдан")
		} catch (e) {
			if (e.message == "exists") {
				throw new HttpException(
					responseData(
						400,
						"Такой конрагент c таким названием и УНН уже существует"
					),
					400
				)
			}
			throw new HttpException(
				responseData(500, "Непредвидена ошибка свяжитесь с разаработчиком", e),
				500
			)
		}
	}

	async findAll(page: number, search: string) {
		try {
			let counterparties: any
			if (search != "") {
				counterparties = await this.counterpartyRepository.findAndCount({
					where: [
						{ name: Like(`%${search}%`) },
						{ account_number: Like(`%${search}%`) },
						{ bank_name: Like(`%${search}%`) },
						{ code_bank: Like(`%${search}%`) },
						{ legal_address: Like(`%${search}%`) },
						{ mailing_address: Like(`%${search}%`) },
						{ phone: Like(`%${search}%`) },
						{ unn: Like(`%${search}%`) },
						{ okpo: Like(`%${search}%`) }
					],
					order: {
						name: "ASC"
					},
					skip: (page - 1) * 10,
					take: 10
				})
			} else {
				counterparties = await this.counterpartyRepository.findAndCount({
					order: {
						name: "ASC"
					},
					skip: (page - 1) * 10,
					take: 10
				})
			}
			const res: ResponseCounterpartyFindAllDto = {
				count: counterparties[1],
				data: counterparties[0]
			}
			return responseData(200, "Контрагенты найдены", res)
		} catch (e) {
			if (e.message == "null") {
				throw new HttpException(
					responseData(400, "Контрагенты не найдены"),
					400
				)
			}
			console.log(e)
			throw new HttpException(
				responseData(500, "Непредвидена ошибка свяжитесь с разаработчиком", e),
				500
			)
		}
	}

	async findOne(id: number): Promise<ResponseData<ResponseCounterpartyDto>> {
		try {
			const counterparty = await this.counterpartyRepository.findOne({
				where: { id }
			})
			if (!counterparty) {
				throw new Error("null")
			}
			return responseData(200, "Контрагент найден", counterparty)
		} catch (e) {
			if (e.message == "null") {
				throw new HttpException(responseData(400, "Контрагент не найден"), 400)
			}
			throw new HttpException(
				responseData(500, "Непредвидена ошибка свяжитесь с разаработчиком", e),
				500
			)
		}
	}

	async update(
		id: number,
		updateCounterpartyDto: UpdateCounterpartyDto
	): Promise<ResponseData<any>> {
		try {
			const counterparty = await this.counterpartyRepository.findOne({
				where: { id }
			})
			if (!counterparty) {
				throw new Error("null")
			}
			const updateCounterparty = {
				...counterparty,
				...updateCounterpartyDto
			}
			await this.counterpartyRepository.save(updateCounterparty)
			return responseData(200, "Контрагент успешно обновлён")
		} catch (e) {
			if (e.message == "null") {
				throw new HttpException(responseData(400, "Контрагент не найден"), 400)
			}
			throw new HttpException(
				responseData(500, "Непредвидена ошибка свяжитесь с разаработчиком", e),
				500
			)
		}
	}

	async remove(id: number) {
		try {
			const counterparty = (await this.findOne(id)).data
			if (!counterparty) {
				throw new Error("null")
			}
			await this.counterpartyRepository.delete(id)
			return responseData(200, "Контрагент успешно удалён")
		} catch (e) {
			if (e.message == "null") {
				throw new HttpException(responseData(400, "Контрагент не найден"), 400)
			}
			throw new HttpException(
				responseData(500, "Непредвидена ошибка свяжитесь с разаработчиком", e),
				500
			)
		}
	}

	async init(file) {
		const XLSX = require("xlsx")
		// const woorkbook = XLSX.readFile("C:/Users/vladon/Downloads/test.xlsx")

		const woorkbook = XLSX.read(file)
		let woorksheet = woorkbook.Sheets[woorkbook.SheetNames[0]]

		const res: {
			addCount: number
			skipCount: number
			skip: CounterpartyEntity[]
			add: CounterpartyEntity[]
		} = {
			addCount: 0,
			skipCount: 0,
			skip: [],
			add: []
		}

		let i = 2
		while (true) {
			try {
				const obj = {
					// id: Number(woorksheet[`A${i}`].v),
					name: woorksheet[`B${i}`].v,
					account_number: woorksheet[`C${i}`].v,
					bank_name: woorksheet[`D${i}`].v,
					code_bank: woorksheet[`E${i}`].v,
					legal_address: woorksheet[`F${i}`].v,
					mailing_address: woorksheet[`G${i}`].v,
					phone: woorksheet[`H${i}`].v,
					unn: woorksheet[`I${i}`].v,
					okpo: woorksheet[`J${i}`].v
				}
				const agent = await this.counterpartyRepository.create(obj)
				const counterparty = await this.counterpartyRepository.findOne({
					where: {
						name: agent.name,
						unn: agent.unn
					}
				})
				if (!counterparty) {
					await this.counterpartyRepository.save(agent)
					res.addCount += 1
					res.add.push(agent)
				} else {
					res.skipCount += 1
					res.skip.push(agent)
				}
			} catch (err) {
				// console.log(err)
				break
			}
			i++
		}
		return res
	}
}
