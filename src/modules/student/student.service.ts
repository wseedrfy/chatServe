import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Student } from "./models/student.entity";

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  // 获取学生信息通过 id
  async getStudentById(studentId: string) {
    return await this.studentRepository.findOneBy({ id: studentId} );
  }
}