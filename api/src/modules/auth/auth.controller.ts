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
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';

import cookieConfig from 'src/config/cookie.config';
import { IRequestUser } from 'src/modules/domain/users/interfaces/user.interface';
import { jwtCookieHeader } from 'src/swagger/jwt-cookie-header';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { AuthDto } from './dto/auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up user' })
  @ApiOkResponse({ description: 'User registered successfully' })
  @ApiConflictResponse({ description: 'Account already exists' })
  @Public()
  @Post('signup')
  async signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @ApiOperation({ summary: 'Sign in user' })
  @ApiOkResponse({
    description: 'User signed in successfully',
    headers: jwtCookieHeader,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('signin')
  signin(
    @Body() dto: AuthDto,
    @CurrentUser() user: IRequestUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = this.authService.signin(user);
    res.cookie('jwt', token, cookieConfig);
    return { message: 'Signed in successfully', user };
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiOkResponse({ description: 'Password changed successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid current password' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Patch('change-password')
  async changePassword(
    @CurrentUser() user: IRequestUser,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.id, dto);
  }
}
