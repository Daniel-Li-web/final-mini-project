import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy'; // Import your JWT Strategy
import { User } from './entities/user.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User]), // User model
    ConfigModule, // To access environment variables
    JwtModule.registerAsync({
      imports: [ConfigModule], // Ensure ConfigModule is imported here
      useFactory: () => ({
        secret:
          'RbH1iNkz56KiEy4m5Lfn18QYAH5wvIr9LjNKNaaZce94YMYfrSiYeDfgMMZZ5W9c', // configService.get<string>('JWT_SECRET')
        signOptions: { expiresIn: '1h' }, // Set token expiration
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Register the JwtStrategy
  exports: [AuthService],
})
export class AuthModule {}
