import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany} from "typeorm"
import { Task } from "./task.entity";
@Entity('users')
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string;

    @Column({unique:true})
    email:string;

    @Column()
    password:string;

    @OneToMany(() => Task, task => task.user)
    tasks: Task[];
}