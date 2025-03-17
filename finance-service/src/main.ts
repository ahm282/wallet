import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestFastifyApplication, FastifyAdapter } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import configFunction from "./config/configuration.config";

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
        abortOnError: false,
    });

    app.setGlobalPrefix("/api/v1/finance");

    // Swagger configuration
    const swaggerConfig = new DocumentBuilder()
        .setTitle("Wallet API")
        .setDescription("API documentation for the Wallet application")
        .setVersion("1.0")
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    if (process.env.NODEJS_ENV !== "production") {
        SwaggerModule.setup("/api/v1/finance/api-docs", app, document);
    }

    const config = configFunction();
    await app.listen(config.port, "0.0.0.0");
}

bootstrap();
