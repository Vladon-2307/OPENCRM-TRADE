import { HttpException, Injectable } from "@nestjs/common"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Not, Repository } from "typeorm"
import { UserEntity } from "./entities/user.entity"
import * as bcrypt from "bcrypt"
import { ResponseData, responseData } from "../core/response"
import { ResponseUserDto } from "./dto/response-user.dto"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		private readonly configService: ConfigService
	) {}

	async create(createUserDto: CreateUserDto): Promise<ResponseData<any>> {
		try {
			createUserDto.password = await bcrypt.hash(
				createUserDto.password,
				await bcrypt.genSalt()
			)
			await this.userRepository.save(createUserDto)
			return responseData(201, "Пользователь успешно сосдан")
		} catch (e) {
			if (e.code == "ER_DUP_ENTRY") {
				throw new HttpException(
					responseData(400, "Такой пользователь уже сущесвует"),
					400
				)
			}
			throw new HttpException(
				responseData(500, "Непредвидена ошибка свяжитесь с разаработчиком", e),
				500
			)
		}
	}

	async findAll(): Promise<ResponseData<ResponseUserDto[]>> {
		try {
			const users: ResponseUserDto[] = (await this.userRepository.find()).map(
				value => {
					const { password, ...user } = value
					return user
				}
			)
			if (users.length == 0) {
				throw new Error("null")
			}

			return responseData(200, "Пользователи найдены", users)
		} catch (e) {
			if (e.message == "null") {
				throw new HttpException(
					responseData(400, "Пользователи не найдены"),
					400
				)
			}
			throw new HttpException(
				responseData(500, "Непредвидена ошибка свяжитесь с разаработчиком", e),
				500
			)
		}
	}

	async findOne(id: number): Promise<ResponseData<ResponseUserDto>> {
		try {
			const user = await this.userRepository.findOne({
				where: { id }
			})
			if (!user) {
				throw new Error("null")
			}
			const { password, ...resuser } = user
			return responseData(200, "Пользователь найден", resuser)
		} catch (e) {
			if (e.message == "null") {
				throw new HttpException(
					responseData(400, "Пользователь не найден"),
					400
				)
			}
			throw new HttpException(
				responseData(500, "Непредвидена ошибка свяжитесь с разаработчиком", e),
				500
			)
		}
	}

	async update(
		id: number,
		updateUserDto: UpdateUserDto
	): Promise<ResponseData<any>> {
		const user = (await this.findOne(id)).data
		try {
			if ("password" in updateUserDto) {
				updateUserDto.password = await bcrypt.hash(
					updateUserDto.password,
					await bcrypt.genSalt()
				)
			}
			if (!user) {
				throw new Error("null")
			}
			const updateUser = {
				...user,
				...updateUserDto
			}

			await this.userRepository.save(updateUser)
			return responseData(200, "Пользователь обновлён")
		} catch (e) {
			if (e.message == "null") {
				throw new HttpException(
					responseData(400, "Пользователь не найден"),
					400
				)
			}
			if (e.code == "ER_DUP_ENTRY") {
				throw new HttpException(
					responseData(400, "Такой пользователь уже сущесвует"),
					400
				)
			}
			throw new HttpException(
				responseData(500, "Непредвидена ошибка свяжитесь с разаработчиком", e),
				500
			)
		}
	}

	async remove(id: number) {
		try {
			const user = await this.userRepository.findOne({ where: { id } })
			if (user.role != "ADMIN") {
				await this.userRepository.delete(id)
				return responseData(200, "Пользователь успешно удалён")
			}
			if (!user) {
				throw new Error("null")
			}
			const admins = await this.userRepository.find({
				where: {
					role: "ADMIN",
					id: Not(id)
				}
			})
			if (admins.length == 0) {
				throw new Error("last admin")
			}
			await this.userRepository.delete(id)
			return responseData(200, "Администратор успешно удалён")
		} catch (e) {
			if (e.message == "null") {
				throw new HttpException(
					responseData(400, "Пользователь не найден"),
					400
				)
			}
			if (e.message == "last admin") {
				throw new HttpException(
					responseData(400, "Невозможно удалить единственого администратора"),
					400
				)
			}
			throw new HttpException(
				responseData(500, "Непредвидена ошибка свяжитесь с разаработчиком", e),
				500
			)
		}
	}

	async initAdmin() {
		const admins = await this.userRepository.find({
			where: {
				role: "ADMIN"
			}
		})
		if (admins.length != 0) return
		const adminPassword = await bcrypt.hash(
			this.configService.get("ADMIN_PASSWORD", "admin"),
			await bcrypt.genSalt()
		)
		await this.userRepository.save({
			login: "admin",
			password: adminPassword,
			role: "ADMIN"
		})
	}

	async validate(login: string, password: string): Promise<UserEntity> {
		const user = await this.userRepository.findOne({ where: { login } })
		if (user) {
			if (await bcrypt.compare(password, user.password)) {
				return user
			}
		}
		return null
	}
}
