import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {JwtModule} from '@nestjs/jwt/dist'
import { User } from './user.entity';
import { Task } from './task.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'test_ttt',
    entities: [User, Task],
    synchronize: true,
  }),
TypeOrmModule.forFeature([User]),
TypeOrmModule.forFeature([Task]),
JwtModule.register({
  secret:'secret',
  signOptions:{expiresIn:'1d'}
})
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
