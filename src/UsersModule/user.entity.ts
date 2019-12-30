import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class UserData {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string;

	@Column()
	username: string;

	@Column({ length: 10 })
	phone: string;

	@Column()
	password: string;

	@Column({ default: true })
	is_active: boolean;

	@Column({ nullable: true })
	fcm_token: string;

	@Column('timestamptz', { nullable: true })
	fcm_update_time: Date;
}