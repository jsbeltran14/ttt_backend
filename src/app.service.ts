import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>
  ){
  }

  async create(data: any): Promise<User>{
    return this.userRepository.save(data);
  }

  async findOne(condition: any): Promise<User>{
    return this.userRepository.findOne({where:condition, relations: ['tasks']})
  }

  async createTask(data: Partial<Task>, userId: number): Promise<Task> {
    const task = this.taskRepository.create({ ...data, user: { id: userId } });
    return this.taskRepository.save(task);
}

  async findOneTask(condition: any): Promise<Task> {
    return this.taskRepository.findOne({ where: condition });
  }

  async findAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async updateTask(id: number, data: Partial<Task>): Promise<Task> {
    await this.taskRepository.update({id}, data)
    return this.taskRepository.findOne({ where: { id } });
  }

  async removeTask(id: number): Promise<void> {
    await this.taskRepository.delete({id});
  }
}
