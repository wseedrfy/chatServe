import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sessions } from './models/sessions.entity';
import { SessionsController } from './sessions.controller';
import { OrganizationModule } from '../organization/organization.module';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sessions]),
    OrganizationModule,
    StudentModule,
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
