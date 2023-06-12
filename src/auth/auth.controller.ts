import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto } from './dto/signInDto';
import { AuthGuard } from './auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiTags('authentication')
  @Post('login')
  @HttpCode(HttpStatus.OK)
  postSignIn(@Body() signInDto: signInDto) {
    const { email, password } = signInDto;
    return this.authService.signIn(email, password);
  }
}
