import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }
  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  find(email: string) {
    return this.repo.find({ where: { email }, select: ['id', 'email'] });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    //Thực hiện cơ chế Hook
    Object.assign(user, attrs); //Tạo 1 instance gộp cả 2 thứ là user và attrs vào. attrs sẽ ghi đè vào user nếu có 2 properties giống nhau
    return this.repo.save(user);
  } //attrs: attributes
  /*
  e.g:
  const target = { a: 1, b: 2 };
  const source = { b: 4, c: 5 };
  const returnedTarget = Object.assign(target, source);
  console.log(returnedTarget); //Object { a: 1, b: 4, c: 5 }
  */
  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.repo.remove(user);
  }

  getAll() {
    return this.repo.find();
  }
}
