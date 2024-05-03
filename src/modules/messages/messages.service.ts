import { Injectable } from '@nestjs/common';
import { Message } from './models/messages.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

interface IMessage {
  messageId: string;
  sessionId: string;
  role: 'customer' | 'agent';
  userId: string;
  message: string;
  time?: string;
  data?: any;
  type: 'card' | 'message';
  // productId?: string;
}
@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  private lock: boolean = false;

  async createNewMessage(body: IMessage) {
    const { messageId, sessionId, message, data, type, role } = body;
    if (this.lock) {
      return;
    }

    this.lock = true;

    try {
      const existingMessage = await this.messageRepository.findOne({
        where: { id: messageId },
      });

      if (existingMessage) {
        this.lock = false;
        return;
      }
  
      await this.messageRepository.insert({
        id: messageId,
        sessionId: sessionId,
        message: message,
        type: type,
        data: JSON.stringify(data),
        senderId: body.userId,
        role: role,
      });
    
      // if (body.role === 'agent') {
      //   await this.messageRepository.insert({
      //     id: messageId,
      //     sessionId: sessionId,
      //     message: message,
      //     type: type,
      //     data: JSON.stringify(data),
      //     senderId: body.userId,
      //   });
      // }

      // if (body.role === 'customer') {
      //   await this.messageRepository.insert({
      //     id: messageId,
      //     sessionId: sessionId,
      //     message: message,
      //     type: type,
      //     data: JSON.stringify(data),
      //     senderId: body.userId,
      //   });
      // }
    } finally {
      this.lock = false;
    }
  }

  async getAllMessages(
    sessionId: string,
  ): Promise<Message[]> {

    return this.messageRepository.find({
      where: { sessionId: sessionId},
      order: { createdTime: 'asc' },
    });
  }

  // async getAgentMessages(
  //   sessionId: string,
  //   userId: string
  // ): Promise<Message[]> {
  //   return this.messageRepository.find({
  //     where: { senderId: userId, sessionId: sessionId },
  //     order: { createdTime: 'asc' },
  //   })
  // }

}
