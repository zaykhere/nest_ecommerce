import { Controller, Post, Body, BadRequestException, Get, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const existingUser = await this.userService.findByEmail(registerUserDto.email);

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    return this.userService.createUser(registerUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.userService.validateUser(loginUserDto.email, loginUserDto.password);

    if(!user) throw new BadRequestException('Invalid Credentials');

    const token = this.userService.generateToken(user);

    return token;
  }

  @Get('test')
  @UseGuards(JwtAuthGuard)
  async test(@Req() req: Request) {
    return req.user;
  }
}
