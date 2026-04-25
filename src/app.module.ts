import { Logger, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import * as Joi from "joi";
import { OrderModule, ProductModule } from "./modules";
import { AppRoutingModule } from "./routes/routes";
import { ResponseModule } from "./services/response/response.module";
import { UserModule } from "./modules/user/user.module";
import { PaymentModule } from "./modules/payment/payment.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().default(8080),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger("MongoDB");

        return {
          uri: configService.get<string>("MONGODB_URI"),

          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          retryWrites: true,
          maxPoolSize: 10,

          bufferCommands: false,

          connectionFactory: (connection) => {
            connection.on("connected", () => {
              logger.log("MongoDB connected");
            });

            connection.on("error", (error) => {
              logger.error("MongoDB connection error", error);
            });

            connection.on("disconnected", () => {
              logger.warn("MongoDB disconnected");
            });

            return connection;
          },
        };
      },
    }),
    ProductModule,
    OrderModule,
    AppRoutingModule,
    ResponseModule,
    UserModule,
    PaymentModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
