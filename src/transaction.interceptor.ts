import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  createParamDecorator,
} from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const queryRunner: QueryRunner = await this.initDb();

    req.dbManager = queryRunner.manager;

    return next.handle().pipe(
      catchError(async (error) => {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        if (error instanceof HttpException) {
          throw new HttpException(error.message, error.getStatus());
        } else {
          throw new InternalServerErrorException(error.message);
        }
      }),
      tap(async () => {
        await queryRunner.commitTransaction();
        await queryRunner.release();
      }),
    );
  }

  private async initDb(): Promise<QueryRunner> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    return queryRunner;
  }
}

export const TransactionManger = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.dbManger;
  },
);
