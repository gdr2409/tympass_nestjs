import { Injectable } from "@nestjs/common";

@Injectable()
export class ConfigService {

	pgConfig = {
		host: 'localhost',
		port: 5434,
		username: 'superadmin',
		password: 'tympass',
		database: 'template1'
	};

	getPostgresConfig(): any {
		return this.pgConfig;
	}

	getHost(): string {
		return this.pgConfig.host || 'localhost';
	}

	getPort(): number {
		return this.pgConfig.port || 5434;
	}

	getUsername(): string {
		return this.pgConfig.username || 'superadmin';
	}

	getPassword(): string {
		return this.pgConfig.password || 'tympass';
	}

	getDatabase(): string {
		return this.pgConfig.database || 'tympass';
	}
}