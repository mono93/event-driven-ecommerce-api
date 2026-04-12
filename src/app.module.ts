import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import * as Joi from "joi";
import { OrderModule, ProductModule } from "./modules";
import { AppRoutingModule } from "./routes/routes";
import { ResponseModule } from "./services/response/response.module";
import { UserModule } from './modules/user/user.module';
import { PaymentModule } from './modules/payment/payment.module';

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
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        maxPoolSize: 10,
        bufferTimeoutMS: 30000
      }),
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
