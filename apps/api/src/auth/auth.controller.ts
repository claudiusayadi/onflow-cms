import { Controller, Get, Request, Response, UseGuards } from '@nestjs/common';
import { GoogleAuthGard } from './guards/google-auth.guard';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response as Res } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleAuthGard)
  @Get('google/login')
  googleLogin() {}

  @UseGuards(GoogleAuthGard)
  @Get('google/callback')
  async googleCallback(@Request() req: { user: User }, @Response() res: Res) {
    const userData = await this.authService.login(req.user);
    res.redirect(
      `http://localhost:3000/api/auth/google/callback?userId=${userData.id}&name=${userData.name}&email=${userData.email}&avatar=${userData.avatar}&accessToken=${userData.accessToken}`,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify-token')
  verifyToken() {
    return 'ok';
  }
}
