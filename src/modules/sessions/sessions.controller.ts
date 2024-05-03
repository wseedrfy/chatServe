import { Body, Controller, Get, Post } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { SessionsDto } from "./dto/sessions.dto";

@Controller('sessions')
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  /**
   * 根据 userId 去获取用户的所有聊天记录
   * @param sessionsDto 
   * @returns 
   */
  @Post('all')
  findSessionsByUserId(@Body() sessionsDto: SessionsDto) {
    return this.sessionsService.findSessionsByUserId(
      sessionsDto.userId,
      sessionsDto.role,
    );
  }
}
