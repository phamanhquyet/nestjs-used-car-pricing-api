import { Injectable } from '@nestjs/common/decorators';
import { UsersService } from './users.service';
import { BadRequestException } from '@nestjs/common';
@Injectable()
export class AuthService {
  //trong này sẽ sử dụng lại các hàm của usersService
  constructor(private usersService: UsersService) {}
  async singup(email: string, password: string) {
    //see if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    //Hash the users password

    //Create a new user and save it

    //return the user
  }
}
