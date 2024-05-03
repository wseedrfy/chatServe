import { Body, Controller, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesDto } from './dto/messages.dto';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post('all')
  getAllMessages(@Body() messagesDto: MessagesDto) {
    console.log(messagesDto, "666");
    
    return this.messagesService.getAllMessages(
      messagesDto.sessionId,
      
    );
  }
}
