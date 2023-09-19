import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

// Định nghĩa một interface để biểu diễn constructor của một class
interface ClassConstructor {
  new (...args: any[]): {};
}
// Decorator Serialize nhận một DTO (Data Transfer Object) và áp dụng SerializeInterceptor
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
// SerializeInterceptor là một NestJS interceptor để chuyển đổi dữ liệu
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  // Phương thức intercept để thực hiện việc chuyển đổi dữ liệu
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        // Sử dụng class-transformer để chuyển đổi dữ liệu theo DTO đã được chỉ định
        return plainToClass(this.dto, data, {
          //loại trừ các trường được khai báo là exclude trong DTO
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
