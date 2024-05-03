import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './models/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
