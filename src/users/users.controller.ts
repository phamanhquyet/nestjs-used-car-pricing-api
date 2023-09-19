import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  NotFoundException,
  Session,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
@Controller('auth')
@Serialize(UserDto) // Sử dụng SerializeInterceptor để định dạng dữ liệu trả về thành UserDto
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // Đăng ký người dùng và gắn userId vào session
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    //Sau khi chạy xong, userId sẽ được gắn vào session object
    return user;
  }

  // Đăng nhập người dùng và gắn userId vào session
  @Post('/signin')
  async signIn(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    //Sau khi chạy xong, userId sẽ được gắn vào session object
    return user;
  }

  // Lấy thông tin người dùng hiện tại dựa trên userId từ session
  @Get('/whoami')
  whoAmI(@Session() session: any) {
    return this.usersService.findOne(session.userId);
    //Với hàm fineOne, khi truyền vào một tham số là null thì nó sẽ trả ra kết quả là bản ghi đầu tiên trong db
    //Vì vậy, cần phải xử lý trong hàm findOne, nếu id truyền vào là null thì dừng lại.
  }

  // Đăng xuất người dùng bằng cách xóa userId khỏi session
  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  // Tìm một người dùng theo id
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Tìm tất cả người dùng dựa trên email
  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  // Xóa người dùng theo id
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  // Cập nhật thông tin người dùng theo id
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
