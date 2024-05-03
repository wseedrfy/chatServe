import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SessionsService } from '../sessions/sessions.service';

interface IMessage {
  messageId: string;
  sessionId: string;
  organizationId: string; 
  role: 'customer' | 'agent';
  userId: string;
  message: string;
  time?: string;
  data?: any;
  type: 'card' | 'message';
}

interface StartSession {
  sessionId: string;
  isAgent: boolean;
  userId: string;
  organizationId: string;
}

@WebSocketGateway({ cors: { origin: '*' } })
export class EventGateway {
  constructor(
    private chatService: ChatService,
    private sessionsService: SessionsService,
  ) {
    this.chatService.initializeSession().then((res) => {
      this.sessions = res;
    });
  }
  @WebSocketServer()
  server: Server;

  private sessions: Record<string, { customer?: string; agent?: string }>;
  private messageLock: string[] = [];


  private async assignSocketToSession(
    sessionId: string,
    client: Socket,
    isAgent: boolean,
    userId: string,
    organizationId: string,
  ): Promise<string> {
    console.log(organizationId, '22222');
    console.log(isAgent,client.id);
    console.log(sessionId)
    const res = await this.chatService.assignSocketToSession(
      sessionId,
      isAgent,
      userId,
      client.id,
      organizationId,
    );
    this.sessions = res.sessionList;
    console.log(this.sessions);
    console.log(res.clientSessionId);
    
    return res.clientSessionId;
  }

  // 启动一个 session
  @SubscribeMessage('startSession')
  async startSession(
    @MessageBody() body: StartSession,
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId, isAgent, userId, organizationId } = body;
    console.log(body, 'body');

    try {
      const res = await this.assignSocketToSession(
        sessionId,
        client,
        isAgent,
        userId,
        organizationId,
      );
      console.log(res);

      return {
        status: 'success',
        message: 'StartSession',
        data: { sessionId: res },
      };
    } catch (error) {
      return { status: 'error', message: error.message, data: {} };
    }
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(@ConnectedSocket() client: Socket) {
    // 遍历所有会话，找到包含当前断开连接的socket ID的会话
    for (const sessionId in this.sessions) {
      const session = this.sessions[sessionId];
      if (session.customer === client.id || session.agent === client.id) {
        // 清理会话中的角色
        const key = session.customer === client.id ? 'customer' : 'agent';
        delete session[key];
        break; // 如果找到了，就可以跳出循环
      }
    }
    console.log('断开连接');
  }

  @SubscribeMessage('customerMessage')
  async handleCustomerMessage(
    @MessageBody() body: IMessage,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(body);
    const { sessionId, role } = body;
    console.log(role);

    const session = this.sessions[sessionId];
    console.log(session);
    // agent 无法获取
    const agentId = session.agent;
    console.log(agentId);

    await this.chatService.insertMessage(body);
    console.log(agentId);
    await this.sendMessage(body);
  }

  @SubscribeMessage('agentMessage')
  async handleAgentMessage(
    @MessageBody() body: IMessage,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(body);
    const { sessionId } = body;
    const session = this.sessions[sessionId];
    const customerId = session.customer;
    await this.chatService.insertMessage(body);
    console.log(customerId);
    await this.sendMessage(body);
  }

  private async sendMessage(body: IMessage) {
    // 检查消息ID是否已经在锁中
    if (this.messageLock.includes(body.messageId)) {
      console.log(
        `Message ${body.messageId} is already being processed. Skipping.`,
      );
      return;
    }

    // 获取会话信息
    const sessions = await this.sessionsService.findBySessionId(body.sessionId);
    const customerSocketId = sessions.customerSocketId;
    const agentSocketId = sessions.agentSocketId;

    try {
      if (body.role === 'agent') {
        this.server.to(customerSocketId).emit('customerMessage', body);
        this.messageLock.push(body.messageId); // 发送消息后添加到锁中
      } else if (body.role === 'customer') {
        this.server.to(agentSocketId).emit('agentMessage', body);
        this.messageLock.push(body.messageId); // 发送消息后添加到锁中
      }
    } catch (error) {
      // 处理发送消息时可能出现的错误
      console.error(`Error sending message ${body.messageId}:`, error);
    }
  }
}
