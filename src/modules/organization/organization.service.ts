import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './models/organization.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  async findOrganizationById(
    organizationId: string,
  ): Promise<Organization | undefined> {
    return await this.organizationRepository.findOneBy({ id: organizationId });
  }
}
