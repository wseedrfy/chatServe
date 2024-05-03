import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';


/**
 * Session entity
 */

@Entity('sessions')
export class Sessions {
  @PrimaryColumn()
  id: string;

  @Column({
    comment: '客户 id',
  })
  @IsNotEmpty()
  customerId: string;

  @Column({
    comment: '客服 id',
    nullable: true,
  })
  agentId: string;

  @Column({
    comment: '门店 Id',
  })
  @IsNotEmpty()
  organizationId: string

  @Column({
    comment: '创建时间',
    default: new Date(),
  })
  createdTime: Date;

  @Column({
    comment: '更新时间',
    default: new Date(),
  })
  updatedTime: Date;

  @Column({
    comment: '客户的socketId',
  })
  @IsNotEmpty()
  customerSocketId: string;

  @Column({
    comment: '客服的socketId',
  })
  agentSocketId: string;
}