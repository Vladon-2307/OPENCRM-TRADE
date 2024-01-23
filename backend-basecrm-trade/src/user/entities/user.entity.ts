import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm"

@Entity("user")
export class UserEntity {
	@PrimaryGeneratedColumn("increment")
	id: number

	@Column({ nullable: false, unique: true })
	login: string

	@Column({ nullable: false })
	password: string

	@Column({
		type: "enum",
		enum: ["ADMIN", "USER"],
		default: "USER",
		nullable: false
	})
	role: string

	@CreateDateColumn({ type: "datetime" })
	created_at: Date

	@UpdateDateColumn({ type: "datetime" })
	updated_at: Date
}
