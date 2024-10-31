import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    status: 'pendiente' | 'en progreso' | 'completada';

    @Column()
    dueDate: Date;

    @ManyToOne(() => User, user => user.tasks)
    user: User; 
}