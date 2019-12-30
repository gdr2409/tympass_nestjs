import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from './user.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserData } from './user.entity';
import { UserResolver } from "./user.resolver";

@Module({
	providers: [UserService, UserResolver],
	imports: [TypeOrmModule.forFeature([UserData])],
	exports: [UserService, TypeOrmModule]
})

export class UserModule {}