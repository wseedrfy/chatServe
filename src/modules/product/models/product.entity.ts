import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('product')
export class Product{
  @PrimaryColumn()
  id: string

  @Column({
    comment: '创建时间'
  })
  createdAt: Date

  @Column({
    comment: '创建者'
  })
  createdBy: string

  @Column({
    comment: '更新时间'
  })
  updatedAt: Date

  @Column({
    comment: '更新者'
  })
  updatedBy: string

  @Column({
    comment: '删除者'
  })
  deletedBy: string

  @Column({
    comment: '商品名称'
  })
  name: string

  @Column({
    comment: '商品描述'
  })
  desc: string

  @Column({
    comment: '商品类型'
  })
  type: string

  @Column({
    comment: '状态'
  })
  status: string

  @Column({
    comment: '库存数量'
  })
  stock: number

  @Column({
    comment: '现有的库存'
  })
  curStock: number

  @Column({
    comment: '购买数量'
  })
  buyNumber: number

  @Column({
    comment: '限制购买数量'
  })
  limitBuyNumber: number

  @Column({
    comment: '商品封面'
  })
  coverUrl: string

  @Column({
    comment: 'banner 链接'
  })
  bannerUrl: string

  @Column({
    comment: '初始价格'
  })
  originalPrice: number

  @Column({
    comment: '优惠价格'
  })
  preferentialPrice: number

  @Column({
    comment: '相关'
  })
  orgId: string
}