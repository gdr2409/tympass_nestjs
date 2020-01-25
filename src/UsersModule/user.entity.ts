import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserData {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public name: string;

	@Column()
	public username: string;

	@Column({ length: 10 })
	public phone: string;

	@Column()
	public password: string;

	@Column({ default: true })
	public is_active: boolean;

	@Column({ nullable: true })
	public fcm_token: string;

	@Column('timestamptz', { nullable: true })
	public fcm_update_time: Date;
}
