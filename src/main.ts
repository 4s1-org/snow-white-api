import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from "@nestjs/swagger"
import { ValidationPipe, INestApplication } from "@nestjs/common"
import { AllExceptionsFilter } from "./AllExceptionsFilter"

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule)

  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()
  app.use((req: any, res: any, next: any) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTION")
    res.header("Access-Control-Allow-Headers", "Content-Type, Accept")
    next()
  })

  const options: any = new DocumentBuilder()
    .setTitle("REST API")
    .setDescription("REST API Documentation")
    .setVersion("1.1.0")
    .build()
  const document: OpenAPIObject = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup("apidoc", app, document)

  await app.listen(3000)
}
bootstrap()
