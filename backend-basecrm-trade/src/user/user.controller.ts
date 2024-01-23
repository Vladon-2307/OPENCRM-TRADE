import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Req,
	UseGuards
} from "@nestjs/common"
import { UserService } from "./user.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { isAdmin } from "../core/admin"

@ApiTags("user")
@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UseGuards(JwtAuthGuard)
	@Post()
	@ApiBearerAuth()
	create(@Body() createUserDto: CreateUserDto, @Req() req) {
		isAdmin(req.user.role)
		return this.userService.create(createUserDto)
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	@ApiBearerAuth()
	findAll(@Req() req) {
		isAdmin(req.user.role)
		return this.userService.findAll()
	}

	@UseGuards(JwtAuthGuard)
	@Get(":id")
	@ApiBearerAuth()
	findOne(@Param("id") id: string, @Req() req) {
		isAdmin(req.user.role)
		return this.userService.findOne(+id)
	}

	@UseGuards(JwtAuthGuard)
	@Patch(":id")
	@ApiBearerAuth()
	update(
		@Param("id") id: string,
		@Body() updateUserDto: UpdateUserDto,
		@Req() req
	) {
		isAdmin(req.user.role)
		return this.userService.update(+id, updateUserDto)
	}

	@UseGuards(JwtAuthGuard)
	@Delete(":id")
	@ApiBearerAuth()
	remove(@Param("id") id: string, @Req() req) {
		isAdmin(req.user.role)
		return this.userService.remove(+id)
	}
}
