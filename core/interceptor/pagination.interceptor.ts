import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap} from 'rxjs/operators';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const args = context.switchToHttp().getResponse()
    return next.handle().pipe(
        tap((data) => {
          data.pageInfo = {
            currentPage: args.currentPage,
            pageSize: args.pageSize,
            totalPage: Math.ceil(data.count/args.pageSize)
          }
        })
    );
  }
}