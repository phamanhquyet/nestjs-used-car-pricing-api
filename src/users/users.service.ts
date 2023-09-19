import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  // Phương thức này tạo một bản ghi người dùng mới trong cơ sở dữ liệu.
  // Nó nhận vào một địa chỉ email và mật khẩu, sau đó tạo và lưu một người dùng mới.
  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  // Phương thức này tìm một người dùng dựa trên ID.
  // Nếu không tìm thấy ID, nó trả về null.
  findOne(id: number) {
    if (!id) return null;
    return this.repo.findOneBy({ id });
  }

  // Phương thức này tìm kiếm người dùng bằng địa chỉ email.
  // Nó trả về một danh sách các người dùng có cùng địa chỉ email.
  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  // Phương thức này cập nhật thông tin của một người dùng dựa trên ID và các thuộc tính (attributes) mới.
  // Nếu không tìm thấy người dùng với ID cung cấp, nó ném một ngoại lệ "NotFoundException".
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

  // Phương thức này xóa một người dùng dựa trên ID.
  // Nếu không tìm thấy người dùng với ID cung cấp, nó ném một ngoại lệ "NotFoundException".
  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.repo.remove(user);
  }

  // Phương thức này lấy tất cả người dùng từ cơ sở dữ liệu và trả về danh sách chúng.
  getAll() {
    return this.repo.find();
  }
}
