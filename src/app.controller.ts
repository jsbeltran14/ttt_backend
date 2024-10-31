import { Param, Req, Body, Res, Controller, Delete, Put, Get, Post, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import {Response, Request} from 'express'
import { Task } from './task.entity';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService,
    private jwtService: JwtService
    ) {}

  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ){
    const hashedPassword = await bcrypt.hash(password, 12)
    
    const user = this.appService.create({
      name,
      email,
      password: hashedPassword
    })
    delete (await user).password;

      return user
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({passthrough:true}) response:Response
  ){
    const user = await this.appService.findOne({email});
    if(!user){
      throw new BadRequestException('invalid credecials');
    }
    if(!await bcrypt.compare(password, user.password)){
      throw new BadRequestException('invalid credecials');
    }

    const jwt = await this.jwtService.signAsync({id:user.id});

    response.cookie('jwt', jwt,{httpOnly:true})
    return {
      message:'success'
    };
  }

  @Get('user')
  async user(@Req() request: Request){
    try{

      const cookie = request.cookies['jwt']
      const data = await this.jwtService.verifyAsync(cookie)
      if(!data){
        throw new UnauthorizedException();
      }

      const user = await this.appService.findOne({id: data['id']})

      delete user.password;

      return user
    }catch(e){
      throw new UnauthorizedException()
    }
  }

  @Post('logout')
  async logout(@Res({passthrough:true}) response:Response){
    response.clearCookie('jwt')
    return{
      message:'success'
    }
  }

   @Post('tasks')
  async createTask(@Body() data: Partial<Task>, @Req() request: Request) {
    const cookie = request.cookies['jwt'];
    const userData = await this.jwtService.verifyAsync(cookie);

    if (!userData) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.appService.createTask(data, userData.id);
  }

 
   @Get('tasks')
   async findAllTasks() {
     return this.appService.findAllTasks();
   }
 
   @Get('tasks/:id')
   async findOneTask(@Param('id') id: number) {
     return this.appService.findOneTask({ id });
   }

   @Put('tasks/:id')
   async updateTask(
     @Param('id') id: number,
     @Body() data: Partial<Task>,
   ) {
     return this.appService.updateTask(id, data);
   }
 
   @Delete('tasks/:id')
   async removeTask(@Param('id') id: number) {
     await this.appService.removeTask(id);
     return { message: 'Task deleted successfully' };
   }
}
