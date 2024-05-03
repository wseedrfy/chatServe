import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventGateway } from './modules/chat/chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { MessagesModule } from './modules/messages/messages.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { ChatModule } from './modules/chat/chat.module';
import { MessagesController } from './modules/messages/messages.controller';
import { ProductModule } from './modules/product/product.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { RecommendationModule } from './modules/recommendation/recommendation.module';

config({
  path: '.env',
});

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [`${__dirname}/../modules/**/*.entity{.ts,.js}`],
      logging: true,
      synchronize: false,
      autoLoadEntities: true,
      connectorPackage: 'mysql2',
    }),
    ChatModule,
    MessagesModule,
    SessionsModule,
    ProductModule,
    OrganizationModule,
    RecommendationModule,
  ],
  controllers: [AppController, MessagesController],
  providers: [AppService, EventGateway],
})
export class AppModule {}
