// /* eslint-disable @typescript-eslint/no-unused-vars */
// // src/auth/auth.controller.ts
// import { Body, Controller, Param, Post, Req } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { RegisterDto } from './dto/register.dto';
// import { LoginDto } from './dto/login.dto';
// import { UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { ApproveLeaveRequestDto } from '../employee/leave-requests/dto/approve-leave-request.dto';
// import { Request } from 'express';
// interface CustomRequest extends Request {
//   // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
//   user?: { sub: string } & Partial<Request['user']>; // Extend Request to include user with sub property
// }

// @Controller('auth')
// // Removed duplicate declaration of AuthController
// export class AuthController {
//   leaveRequestsService: any;
//   constructor(private readonly authService: AuthService) {}

//   @Post('register')
//   register(@Body() dto: RegisterDto) {
//     return this.authService.register(dto);
//   }

//   @Post('login')
//   login(@Body() dto: LoginDto) {
//     return this.authService.login(dto);
//   }
//   @Post(':id/approve')
//   approveLeaveRequest(
//     @Param('id') id: string,
//     @Body() dto: ApproveLeaveRequestDto,
//     @Req() req: CustomRequest,
//   ) {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//     const approverId = req.user?.sub ?? ''; // JWT 中的 user ID
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
//     return this.leaveRequestsService.approve(+id, dto, approverId);
//   }
// }
// function CustomAuthGuard(
//   _arg0: string,
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
// ): Function | import('@nestjs/common').CanActivate {
//   throw new Error('Function not implemented.');
//   @UseGuards(AuthGuard('jwt'))
//   @Get('profile')
//   getProfile(@Request() req) {
//     return req.user; // 包含 id, role, name
//   }

// }
// function getProfile(arg0: any, Req: () => ParameterDecorator) {
//   throw new Error('Function not implemented.');
// }
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @Post('login')
  @Public()
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    console.log('result');
    console.log(result);
    return result;
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Get('profile')
  // getProfile(@Request() req) {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  //   return req.user;
  // }
}
