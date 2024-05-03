import { Injectable } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { SessionsService } from '../sessions/sessions.service';
import { Sessions } from '../sessions/models/sessions.entity';
import { OrganizationService } from '../organization/organization.service';

interface IMessage {
  messageId: string;
  sessionId: string;
  role: 'customer' | 'agent';
  userId: string;
  message: string;
  time?: string;
  data?: any;
  type: 'card' | 'message';
}

type sessionListProps = Record<string, { customer?: string; agent?: string }>;

interface AssignSession {
  sessionList: sessionListProps;
  clientSessionId: string;
}

@Injectable()
export class ChatService {
  constructor(
    private messagesService: MessagesService,
    private sessionsService: SessionsService,
    private organizationService: OrganizationService,
  ) {}

  /**
   * 初始化 Sessions，去数据库获取所有的 sessions 数据
   * @returns
   */
  public async initializeSession(): Promise<
    Record<string, { customer?: string; agent?: string }>
  > {
    const sessionsList = await this.sessionsService.findAll();
    return this.getSessionByList(sessionsList);
  }

  private getSessionByList(sessionsList: Sessions[]): sessionListProps {
    const sessions: Record<string, { customer?: string; agent?: string }> = {};
    sessionsList.forEach((session) => {
      sessions[session.id] = {
        customer: session.customerSocketId,
        agent: session.agentSocketId,
      };
    });
    return sessions;
  }

  public async assignSocketToSession(
    sessionId: string,
    isAgent: boolean,
    userId: string,
    socketId: string,
    organizationId: string,
  ): Promise<AssignSession> {
    let refreshSessionId: string | undefined;
    console.log(socketId, 'test');
    // 1. 查询session表中是否存在这个 sessionId
    const querySession = await this.sessionsService.findBySessionId(sessionId);

    // 对于每个会话要确保知道聊天的对象，这里去查询咨询商品对应的对象，也就是门店的 Id
    const organization =
      await this.organizationService.findOrganizationById(organizationId);
    const { createdBy: agentId } = organization;
    // console.log(organization, '查询到门店信息');

    // 如果是用户，需要去 session 表当中查询是否在这个门店聊天过，如果有则共用一个 sessionId 回去
    if (!isAgent) {
      console.log(1111);

      await this.sessionsService
        .findSessionIdByOrganizationId(organizationId, userId)
        .then((res) => {
          if (res) {
            console.log(res, 'customerSession');
            refreshSessionId = res.id;
          }
        });
    }
    console.log(refreshSessionId, 'refreshSessionId');

    // 2. 存在则更新，不存在则创建，只有客户才会主动建立连接，所以只需要创建客户的
    // 客户创建：refreshSessionId 和 querySession都不存在的时候
    console.log(querySession,refreshSessionId,isAgent,'12345');
    console.log(socketId, 'socket111');
    if (!querySession && !refreshSessionId && !isAgent) {
      console.log('created');

      try {
         await this.sessionsService.create(
          sessionId,
          organizationId,
          userId,
          agentId,
          socketId,
          null,
        )
      } catch (error) {
        console.log(12331131);
        
      }
    }
     console.log(socketId, 'socket111');
    // 3. 如果存在，进行更新操作
    if (querySession) {
      // 检查是否为代理
      if (isAgent) {
        await this.sessionsService.updated(
          sessionId,
          isAgent,
          querySession.customerId,
          userId,
          querySession.customerSocketId,
          socketId,
        );
      } 
      
      if (!isAgent){
        console.log(socketId, 'socket111');
        await this.sessionsService.updated(
          refreshSessionId,
          isAgent,
          querySession.customerId,
          userId,
          socketId,
          querySession.agentSocketId,
        );
      }
    }

    // 4. 返回新的 sessions
    return await this.getAssignSession(refreshSessionId);
  }

  private async getAssignSession(
    sessionId: string
  ): Promise<AssignSession> {
    const sessionsList = await this.sessionsService.findAll();

    return {
      sessionList: this.getSessionByList(sessionsList),
      clientSessionId: sessionId,
    };
  }

  public async insertMessage(body: IMessage) {
    console.log(body);

    return await this.messagesService.createNewMessage(body);
  }

  public async disconnectSession() {
    // 某一方退出的时候应该去断开连接
    // this.sessionsService.updated()
  }
}
