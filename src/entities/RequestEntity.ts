import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum RequestStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

@Entity('requests')
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

  @CreateDateColumn()
  createdAt: Date = new Date();

  @CreateDateColumn()
  updatedAt: Date = new Date();
}
