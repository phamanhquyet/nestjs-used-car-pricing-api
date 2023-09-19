import { Injectable } from '@nestjs/common/decorators';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
//chuyển scrypt từ mặc định nhận vào 1 callback thành 1 hàm sử dụng promise
@Injectable()
export class AuthService {
  //trong này sẽ sử dụng lại các hàm của usersService
  constructor(private usersService: UsersService) {}
  async signup(email: string, password: string) {
    //see if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    //Hash the users password
    //Genetate a salt
    const salt = randomBytes(8).toString('hex');
    //sali ở đây sẽ tiêu tốn 8 bytes, sau đó chuyển qua dạng hexadecimal

    //Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //32 là độ dài của chuỗi kí tự sau khi hash (32bytes)
    //do lúc này, hash đang ở dạng unknown, chính vì vậy cần thêm bước gắn cho nó một kiểu dữ liệu
    //ở đây là Buffer

    //Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');
    //salt.mật khẩu sau khi hash
    //ví dụ: 010066d.a1d01

    //Create a new user and save it
    const user = await this.usersService.create(email, result);
    //return the user
    return user;
  }

  async signin(email: string, password: string) {
    // Tìm kiếm người dùng trong cơ sở dữ liệu dựa trên địa chỉ email
    const [user] = await this.usersService.find(email);
    // Nếu không tìm thấy người dùng, ném ra một ngoại lệ NotFoundException
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Phân tách chuỗi password lấy ra salt và storedHash từ người dùng
    const [salt, storedHash] = user.password.split('.');
    // Sử dụng salt để hash password đầu vào
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // So sánh storedHash và hash đã tạo, nếu không khớp, ném ra ngoại lệ BadRequestException
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }
    // Trả về thông tin người dùng nếu mọi thứ hợp lệ
    return user;
  }
}
