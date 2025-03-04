import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum RequestStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

@Entity({ name: 'requests' })
export class RequestEntity {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  topic: string = '';

  @Column()
  text: string = '';

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.NEW })
  status: RequestStatus = RequestStatus.NEW;

  @Column({ nullable: true })
  resolution?: string;

  @Column({ nullable: true })
  cancelReason?: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date = new Date();

  @CreateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date = new Date();
}
