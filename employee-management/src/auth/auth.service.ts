import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt'; // Import JwtService for token generation
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

interface LocalRegisterDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'manager' | 'employee';
}

interface LocalLoginDto {
  id: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService, // Inject JwtService to sign the token
  ) {}

  // Register new user
  async register(dto: LocalRegisterDto): Promise<User> {
    const existing = await this.userModel.findOne({ where: { id: dto.id } });
    if (existing) {
      throw new Error('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create the user
    const newUser = await this.userModel.create({
      id: dto.id,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      role: dto.role,
      password: hashedPassword,
    } as User);

    return newUser;
  }

  // Login user and generate JWT token
  async login(dto: LocalLoginDto): Promise<{ access_token: string }> {
    const user = await this.userModel.findOne({ where: { id: dto.id } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    // Create JWT payload
    const payload = { sub: user.id, role: user.role, name: user.name };

    // Generate JWT token
    const accessToken = this.jwtService.sign(payload); // Sign and generate token

    return { access_token: accessToken }; // Return the token in the response
  }
}
