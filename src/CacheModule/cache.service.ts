const redis = require('redis');

import { ConfigService } from '../ConfigModule/config.service';
import { Inject } from '@nestjs/common';
import { RenameLocation } from 'ts-morph';
import { Observable } from 'apollo-link';
import { resolve } from 'path';
import { rejects } from 'assert';
export class RedisService {
	private static redisClient: any;
	constructor (
		@Inject(ConfigService)
		private readonly configService: ConfigService,
	) {}

	// tslint:disable-next-line: member-ordering
	public register () {
		RedisService.redisClient = redis.createClient(this.configService.getRedisConfig());
		RedisService.redisClient.on('connect', function () {
			console.log('Redis client connected');
		});

		RedisService.redisClient.on('error', function (err) {
			console.log('Redis client err ' + err);
		});
	}

	public async get (key: string): Promise<any> {
		return new Promise ((resolve, reject) => {
			RedisService.redisClient.get(key, function (err, result) {
				if (err) {
					reject(err);
				} else {
					resolve(JSON.parse(result));
				}
			});
		});
	}

	public set (key: string, data: any): void {
		RedisService.redisClient.set(key, JSON.stringify(data));
	}

	public async exists (key: string): Promise<boolean> {
		return new Promise ((resolve, reject) => {
			RedisService.redisClient.exists(key, function (err, reply) {
				if (err) {
					reject(err);
				} else if (reply === 1) {
					resolve(true);
				} else {
					resolve(false);
				}
			});
		});
	}

	public async delete (key: string): Promise<void> {
		return new Promise ((resolve, reject) => {
			RedisService.redisClient.del(key, function (err, reply) {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	public async setStream (key: string, stream: any): Promise<any> {
		const data: any = await new Promise((resolve, reject) => {
			stream.subscribe(
				(data) => { resolve(data); },
				// tslint:disable-next-line: trailing-comma
				(err) => { reject(err); }
			);
		});

		this.set(key, data);
	}
}