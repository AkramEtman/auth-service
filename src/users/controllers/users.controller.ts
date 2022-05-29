import { Controller, Get, Post, Body, Patch, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersService } from '../services/users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("/register")
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create( createUserDto );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Request() req,@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user._id, updateUserDto);
  }
}