import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Nhúng TypeORM và liên kết cơ sở dữ liệu với thực thể User
  controllers: [UsersController], // Đăng ký UsersController là một controller của module này
  providers: [UsersService, AuthService], // Đăng ký UsersService và AuthService là các dịch vụ của module này
})
export class UsersModule {} // UsersModule là module chứa các thành phần liên quan đến người dùng
