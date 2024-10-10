import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from './role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return { email: user.email, role: user.role };
  }

  @Post('signup')
  async signUp(@Body() body: { email: string; password: string; role: Role }) {
    const user = await this.authService.createUser(body.email, body.password, body.role);
    return { email: user.email, role: user.role };
  }
}