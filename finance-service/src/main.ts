import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestFastifyApplication, FastifyAdapter } from "@nestjs/platform-fastify";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
        abortOnError: false,
    });

    app.setGlobalPrefix("/api/finance");
    await app.listen(process.env.NESTJS_PORT ?? 3000, "0.0.0.0");
}

bootstrap();
