import { Body, Controller, Get, Headers, HttpCode, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  private setRefreshToken(response: Response, token: string) { response.cookie('refreshToken', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' && process.env.COOKIE_SECURE !== 'false', path: '/auth', maxAge: 30 * 24 * 60 * 60 * 1000 }); }
  @Post('register') async register(@Body() input: RegisterDto, @Res({ passthrough: true }) response: Response) { const result = await this.auth.register(input); this.setRefreshToken(response, result.refreshToken); return { accessToken: result.accessToken, user: result.user }; }
  @HttpCode(200) @Post('login') async login(@Body() input: LoginDto, @Res({ passthrough: true }) response: Response) { const result = await this.auth.login(input); this.setRefreshToken(response, result.refreshToken); return { accessToken: result.accessToken, user: result.user }; }
  @HttpCode(200) @Post('refresh') async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) { const result = await this.auth.refresh(request.cookies?.refreshToken); this.setRefreshToken(response, result.refreshToken); return { accessToken: result.accessToken, user: result.user }; }
  @HttpCode(204) @Post('logout') async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) { await this.auth.logout(request.cookies?.refreshToken); response.clearCookie('refreshToken', { path: '/auth' }); }
  @Get('me') me(@Headers('authorization') authorization?: string) { return this.auth.me(authorization?.replace(/^Bearer\s+/i, '')); }
}
