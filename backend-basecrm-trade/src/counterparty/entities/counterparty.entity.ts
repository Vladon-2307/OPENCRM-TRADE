import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm"

@Entity("counterparty")
export class CounterpartyEntity {
	@PrimaryGeneratedColumn("increment")
	id: number

	@Column({ nullable: false })
	name: string

	@Column({ nullable: true })
	account_number: string

	@Column({ nullable: true })
	bank_name: string

	@Column({ nullable: true })
	code_bank: string

	@Column({ nullable: true })
	legal_address: string

	@Column({ nullable: true })
	mailing_address: string

	@Column({ nullable: true })
	phone: string

	@Column({ nullable: true })
	unn: string

	@Column({ nullable: true })
	okpo: string

	@CreateDateColumn({ type: "datetime" })
	created_at: Date

	@UpdateDateColumn({ type: "datetime" })
	updated_at: Date
}
