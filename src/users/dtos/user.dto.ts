//đặt tên như thế này để biểu thị rằng đây là cách một user được in ra khi được nhận một request
import { Expose } from 'class-transformer';
//Expose là đưa thông tin này ra
//trái ngược với Exclude là loại trừ
//Nếu chúng ta không muốn trả về dữ liệu nào đó ví dụ như password, thì không cần phải khai báo ở đây
//chỉ cần sử dụng decorator @Expose() và để cho excludeExtraneousValues trong custom Interceptor làm việc còn lại là được
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;
}
