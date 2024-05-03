import { EventGateway } from './chat.gateway';
import { Module } from '@nestjs/common';
import { SessionsModule } from '../sessions/sessions.module';
import { MessagesModule } from '../messages/messages.module';
import { ChatService } from './chat.service';
import { ProductModule } from '../product/product.module';
import { OrganizationModule } from '../organization/organization.module';

@Module({
  imports: [SessionsModule, MessagesModule, ProductModule, OrganizationModule],
  providers: [EventGateway, ChatService],
  exports: [ChatService]
})
export class ChatModule {}
