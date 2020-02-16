import { Injectable } from '@nestjs/common';

import { configDB } from './config.provider';

// const config = require('../config.json');

@Injectable()
export class ConfigService {
	private static pgConfig: any;

	public getPostgresConfig(): any {
		return ConfigService.pgConfig;
	}

	public async getHost(): Promise<string> {
		if (!ConfigService.pgConfig) {
			await this.pgConfigInitializer();
		}
		return ConfigService.pgConfig.host;
	}

	public async getPort(): Promise<number> {
		if (!ConfigService.pgConfig) {
			await this.pgConfigInitializer();
		}
		return ConfigService.pgConfig.port;
	}

	public async getUsername(): Promise<string> {
		if (!ConfigService.pgConfig) {
			await this.pgConfigInitializer();
		}
		return ConfigService.pgConfig.username;
	}

	public async getPassword(): Promise<string> {
		if (!ConfigService.pgConfig) {
			await this.pgConfigInitializer();
		}
		return ConfigService.pgConfig.password;
	}

	public async getDatabase(): Promise<string> {
		if (!ConfigService.pgConfig) {
			await this.pgConfigInitializer();
		}
		return ConfigService.pgConfig.database;
	}

	public getRedisConfig (): object {
		return {
			redis: {
				port: 6379,
				host: '127.0.0.1',
			},
		};
	}

	private async pgConfigInitializer () {
		await new Promise ((resolve, reject) => {
			configDB.collection('config').doc('postgresConfig').get()
			.then((doc) => {
				if (!doc) {
					reject('No postgres config found');
				} else {
					ConfigService.pgConfig = doc.data();
					console.log(JSON.stringify(ConfigService.pgConfig));
					this.pgConfigObserver();
					resolve();
				}
			});
		});
	}

	private pgConfigObserver () {
		configDB.collection('config').doc('postgresConfig').onSnapshot((doc) => {
			ConfigService.pgConfig = doc.data();
			console.log('Observer: ' + JSON.stringify(ConfigService.pgConfig));
		}, (err) => {
			console.log(`Error while observing ${err}`);
		});
	}
}
