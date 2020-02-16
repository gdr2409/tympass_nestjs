import { Module, OnModuleInit, Inject } from '@nestjs/common';
import { RedisService } from './cache.service';
import { ConfigModule } from '../ConfigModule/config.module';

@Module({
	providers: [RedisService],
	exports: [RedisService],
	imports: [ConfigModule],
})
export class CacheModule implements OnModuleInit {
	constructor (
		@Inject(RedisService)
		private readonly redisService: RedisService,
	) {
		console.log('Cache module constructor');
	}

	// tslint:disable-next-line: member-access
	onModuleInit() {
		this.redisService.register();
		console.log('Module init success');
	}
}
