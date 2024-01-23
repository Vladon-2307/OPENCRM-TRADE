import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from "@nestjs/common"
import { CounterpartyService } from "./counterparty.service"
import { CreateCounterpartyDto } from "./dto/create-counterparty.dto"
import { UpdateCounterpartyDto } from "./dto/update-counterparty.dto"
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiQuery,
	ApiResponse,
	ApiTags
} from "@nestjs/swagger"
import { responseData, ResponseData } from "../core/response"
import { ResponseCounterpartyDto } from "./dto/response-counterparty.dto"
import { FileInterceptor } from "@nestjs/platform-express"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { isAdmin } from "../core/admin"

@ApiTags("counterparty")
@Controller("counterparty")
export class CounterpartyController {
	constructor(private readonly counterpartyService: CounterpartyService) {}

	@UseGuards(JwtAuthGuard)
	@Post()
	@ApiBearerAuth()
	@ApiResponse({
		isArray: false,
		status: "default",
		type: ResponseData
	})
	create(
		@Body() createCounterpartyDto: CreateCounterpartyDto
	): Promise<ResponseData<ResponseCounterpartyDto>> {
		return this.counterpartyService.create(createCounterpartyDto)
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	@ApiBearerAuth()
	@ApiQuery({ name: "search", required: false, type: String })
	findAll(
		@Query("page") page: number = 1,
		@Query("search") search: string = ""
	) {
		return this.counterpartyService.findAll(page, search)
	}

	@UseGuards(JwtAuthGuard)
	@Post("init")
	@ApiBearerAuth()
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				file: {
					type: "string",
					format: "binary"
				}
			}
		}
	})
	// @UseInterceptors(FileExtender)
	@UseInterceptors(FileInterceptor("file"))
	init(@UploadedFile() file, @Req() req) {
		isAdmin(req.user.role)
		const fileName = file.originalname.split(".")
		if (
			fileName[fileName.length - 1] != "xlsx" &&
			fileName[fileName.length - 1] != "xls"
		) {
			throw new HttpException(
				responseData(400, "Неверный формат, нужен формат .xlsx или .xls"),
				400
			)
		}
		return this.counterpartyService.init(file.buffer)
	}

	@UseGuards(JwtAuthGuard)
	@Get(":id")
	@ApiBearerAuth()
	findOne(@Param("id") id: string) {
		return this.counterpartyService.findOne(+id)
	}

	@Patch(":id")
	@ApiBearerAuth()
	update(
		@Param("id") id: string,
		@Body() updateCounterpartyDto: UpdateCounterpartyDto
	) {
		return this.counterpartyService.update(+id, updateCounterpartyDto)
	}

	@UseGuards(JwtAuthGuard)
	@Delete(":id")
	@ApiBearerAuth()
	remove(@Param("id") id: string) {
		return this.counterpartyService.remove(+id)
	}
}
