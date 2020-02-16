import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RedisService } from '../cache.service';

@Injectable()
export class GroupDetailsCachingInterceptor implements NestInterceptor {
	constructor (
		@Inject(RedisService)
		private readonly redisService: RedisService,
	) {}
	public async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
		console.log('Before...');
		const ctx = GqlExecutionContext.create(context);
		const groupId = ctx.getArgs().groupId;
		const fieldName = ctx.getInfo().fieldName;
		const req = ctx.getContext().req;

		const cacheKey = `${fieldName}_${groupId}`;
		const existsInCache = await this.redisService.exists(cacheKey);
		if (existsInCache) {
			const response = await this.redisService.get(cacheKey);
			return of(response);
		}
		const now = Date.now();
		const responseStream = next.handle();
		try {
			this.redisService.setStream(cacheKey, responseStream);
		} catch (err) {
			console.log(err.message);
		}
		return responseStream;
	}
}