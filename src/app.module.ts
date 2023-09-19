import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';

@Module({
  imports: [
    // Định cấu hình TypeORM để sử dụng SQLite database.
    // TypeORM sẽ tự động tạo ra bảng dựa trên các entity đã được xác định.
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite', // Tên của tệp SQLite database
      entities: [User, Report], // Danh sách các entity được sử dụng trong ứng dụng
      synchronize: true, // Tự động đồng bộ hóa cơ sở dữ liệu và entity (chỉ nên sử dụng trong môi trường phát triển)
    }),
    UsersModule, // Sử dụng UsersModule để quản lý người dùng
    ReportsModule, // Sử dụng ReportsModule để quản lý báo cáo
  ],
  controllers: [AppController], // Các controllers chính của ứng dụng
  providers: [AppService], // Các providers chính của ứng dụng
})
export class AppModule {}
