import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

/**
 * 组件
 */
@Entity('student')
export class Student {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createdAt: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '创建者',
  })
  createdBy: string | null;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
    comment: '修改时间',
  })
  updatedAt: Date | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '修改者',
  })
  updatedBy: string | null;

  @DeleteDateColumn({
    type: 'datetime',
    precision: 6,
    nullable: true,
  })
  deletedAt: Date | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '删除者',
  })
  deletedBy: string | null;

  @Column({
    comment: '昵称',
    default: '',
  })
  name: string;

  @Column({
    comment: '手机号',
    nullable: true,
  })
  tel: string;

  @Column({
    comment: '头像',
    nullable: true,
  })
  avatar: string;

  @Column({
    comment: '密码',
  })
  password: string;

  @Column({
    comment: '账户',
  })
  account: string;

  @Column({
    comment: 'openid',
    nullable: true,
  })
  openid?: string;
}
