import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Student } from '../student/models/student.entity';
import { Product } from '../product/models/product.entity';
import { Organization } from '../organization/models/organization.entity';

@Entity('order')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', update: true })
    createdAt: Date;

    @Column({ nullable: true })
    createdBy: string;

    @Column({ nullable: true })
    updatedAt: Date;

    @Column({ nullable: true })
    updatedBy: string;

    @Column({ nullable: true, type: 'datetime', precision: 6 })
    deletedAt: Date;

    @Column({ nullable: true })
    deletedBy: string;

    @Column({ nullable: true })
    tel: string;

    @Column({ nullable: true })
    quantity: number;

    @Column({ nullable: false })
    outTradeNo: string;

    @Column({ nullable: true })
    amount: number;

    @Column({ nullable: true })
    studentId: string;

    @Column({ nullable: true })
    productId: string;

    @Column({ nullable: true })
    status: string;

    @Column({ nullable: true })
    orgId: string;

    @ManyToOne(() => Student, (student) => student)
    student: Student;

    @ManyToOne(() => Product, (product) => product)
    product: Product;

    @ManyToOne(() => Organization, (organization) => organization)
    organization: Organization;
}