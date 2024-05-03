import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './models/messages.entity';
import { SessionsModule } from '../sessions/sessions.module';
import { MessagesController } from './messages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), SessionsModule],
  providers: [MessagesService],
  controllers: [MessagesController],
  exports: [MessagesService],
})  
export class MessagesModule {}
