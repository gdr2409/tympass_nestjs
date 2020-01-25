import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {

	public pgConfig = {
		host: 'localhost',
		port: 5434,
		username: 'superadmin',
		password: 'tympass',
		database: 'template1',
	};

	public getPostgresConfig(): any {
		return this.pgConfig;
	}

	public getHost(): string {
		return this.pgConfig.host || 'localhost';
	}

	public getPort(): number {
		return this.pgConfig.port || 5434;
	}

	public getUsername(): string {
		return this.pgConfig.username || 'superadmin';
	}

	public getPassword(): string {
		return this.pgConfig.password || 'tympass';
	}

	public getDatabase(): string {
		return this.pgConfig.database || 'tympass';
	}
}
