import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import cookieConfig from 'src/config/cookie.config';
import { IRequestUser } from 'src/modules/domain/users/interfaces/user.interface';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { AuthDto } from './dto/auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * User registration
   * @example {email: owolabi@nomoney.local, password: YouandMeForever.2025$}
   */
  @Public()
  @Post('signup')
  async signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  /**
   * User login
   @example {email: owolabi@nomoney.local, password: YouandMeForever.2025$}
   */
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('signin')
  signin(
    @CurrentUser() user: IRequestUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = this.authService.signin(user);
    res.cookie('token', token, cookieConfig);
  }

  /**
   * Change user password (only by owner)
   */
  @Patch('change-password')
  async changePassword(
    @CurrentUser() user: IRequestUser,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.id, dto);
  }
}
