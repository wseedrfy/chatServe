import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * 消息
 */
@Entity('messages')
export class Message {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    comment: 'sessionId',
  })
  @IsNotEmpty()
  sessionId: string;

  @Column({
    comment: '消息内容',
    default: '',
  })
  message: string;

  @Column({
    comment: '消息类型',
  })
  @IsNotEmpty()
  type: 'card' | 'message';

  @Column({
    comment: '消息携带数据',
    nullable: true
  })
  data: string;

  @Column({
    comment: '创建时间',
    default: new Date()
  })
  @IsNotEmpty()
  createdTime: Date

  @Column({
    comment: '发送者 Id'
  })
  @IsNotEmpty()
  senderId: string;

  @Column({
    comment: '角色'
  })
  @IsNotEmpty()
  role: 'agent' | 'customer'
}