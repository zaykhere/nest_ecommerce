import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';

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
}
