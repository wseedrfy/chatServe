import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sessions } from './models/sessions.entity';
import { OrganizationService } from '../organization/organization.service';
import { StudentService } from '../student/student.service';

class SessionResp extends Sessions {
  name: string;
  logo: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
}

@Injectable()
export class SessionsService {

  constructor(
    @InjectRepository(Sessions)
    private sessionsRepository: Repository<Sessions>,
    private organizationService: OrganizationService,
    private studentService: StudentService,
  ) {}

  findAll(): Promise<Sessions[]> {
    return this.sessionsRepository.find();
  }

  async findBySessionId(sessionId: string): Promise<Sessions> {
    return this.sessionsRepository.findOne({
      where: { id: sessionId }
    });
  }

  async create(
    sessionId: string,
    organizationId: string,
    customerId?: string,
    agentId?: string,
    customerSocketId?: string,
    agentSocketId?: string,
  ) {
  
  return await this.sessionsRepository.save({
    id: sessionId,
    customerId: customerId,
    agentId: agentId,
    customerSocketId: customerSocketId,
    agentSocketId: agentSocketId,
    organizationId: organizationId,
  });
  
  
  }

  async updated(
    sessionId: string,
    isAgent: boolean,
    customerId?: string,
    agentId?: string,
    customerSocketId?: string,
    agentSocketId?: string,
  ) {
    console.log("errrrrrrr");
    
    if (isAgent) {
      return this.sessionsRepository.update(
        { id: sessionId },
        { agentId: agentId, agentSocketId: agentSocketId },
      );
    } else {
      return this.sessionsRepository.update(
        { id: sessionId },
        {
          customerId: customerId,
          customerSocketId: customerSocketId,
        },
      );
    }
  }

  async findSessionsByUserId(
    userId: string,
    role: 'customer' | 'agent',
  ): Promise<SessionResp[]> {
    let sessionsList: Sessions[];
    if (role === 'customer') {
      sessionsList = await this.sessionsRepository.find({
        where: { customerId: userId },
      });
    } else {
      sessionsList = await this.sessionsRepository.find({
        where: { agentId: userId },
      });
    }

    let result = [];
    for (const session of sessionsList) {
      const organizationResp = await this.organizationService
        .findOrganizationById(session.organizationId)
        .then((res) => {
          return {
            ...session,
            name: res.name,
            logo: res.logo,
          };
        });

      const studentResp = await this.studentService
        .getStudentById(organizationResp.customerId)
        .then((res) => {
          return {
            ...organizationResp,
            studentId: res.id,
            studentName: res.name,
            studentAvatar: res.avatar,
          };
        });
      result.push(studentResp);
    }

    return result;
  }

  async findSessionIdByOrganizationId(
    organizationId: string,
    customerId: string,
  ) {
    return this.sessionsRepository.findOneBy({
      organizationId: organizationId,
      customerId: customerId,
    });
  }
}
