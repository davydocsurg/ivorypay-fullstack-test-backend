import { Entity, Column, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Transaction } from "./Transaction";
import Model from "./Model";

@Entity("wallets")
export class Wallet extends Model {
    @OneToOne(() => User, (user) => user.wallet, { onDelete: "CASCADE" })
    @JoinColumn()
    user: User;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    balance: number;

    @Column({ unique: true })
    address: string;

    @OneToMany(() => Transaction, (transaction) => transaction.senderWallet)
    outgoingTransactions: Transaction[];

    @OneToMany(() => Transaction, (transaction) => transaction.receiverWallet)
    incomingTransactions: Transaction[];
}
