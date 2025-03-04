import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestFastifyApplication, FastifyAdapter } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
        abortOnError: false,
    });

    app.setGlobalPrefix("/api/v1/finance");

    // Swagger configuration
    const config = new DocumentBuilder()
        .setTitle("Wallet API")
        .setDescription("API documentation for the Wallet application")
        .setVersion("1.0")
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);

    if (process.env.NODEJS_ENV !== "production") {
        SwaggerModule.setup("/api/v1/finance/api-docs", app, document);
    }

    await app.listen(process.env.NESTJS_PORT ?? 3000, "0.0.0.0");
}

bootstrap();
