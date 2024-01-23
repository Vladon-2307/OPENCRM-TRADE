import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ConfigService } from "@nestjs/config"

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true })

	app.setGlobalPrefix("api")
	const config = new DocumentBuilder()
		.setTitle("basecrm-trade")
		.setVersion("1.0")
		.addBearerAuth({
			type: "http",
			scheme: "bearer",
			bearerFormat: "JWT",
			name: "JWT",
			description: "Enter JWT token",
			in: "header"
		})
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup("api", app, document)
	const configService = app.get(ConfigService)
	const port = configService.get("API_PORT")
	await app.listen(port)
}

bootstrap()
