import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('organization')
export class Organization {
  @PrimaryColumn({
    type: 'varchar',
    length: 36,
    comment: '主键ID',
  })
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
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: '营业执照',
  })
  businessLicense: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: '法人身份证正面',
  })
  identityCardFrontImg: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: '法人身份证反面',
  })
  identityCardBackImg: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: '标签 以，隔开',
  })
  tags: string | null;

  @Column({
    type: 'text',
    nullable: true,
    comment: '简介',
  })
  description: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    default: '',
    nullable: true,
    comment: '机构名',
  })
  name: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'logo',
  })
  logo: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '地址',
  })
  address: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '经度',
  })
  longitude: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '纬度',
  })
  latitude: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '电话',
  })
  tel: string | null;
}
