import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthenticationDto } from '../dto/auth.dto';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../enums/role.enum';
import { RolesGuard } from '../guards/roles.guard';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody( {type:AuthenticationDto} )
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Body() AuthenticationDto: AuthenticationDto, @Request() req) {
    return this.authService.login(req.user);
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard )
  @Get('/auth/session')
  getHello(@Request() req): string {
    return req.user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/auth/logout')
  logout(@Request() req) {
    return this.authService.logout(req.user._id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Get('/auth/logout/:userId')
  logoutUser(@Request() req, @Query("userId") userId: string) {
    return this.authService.logout(userId);
  }
}