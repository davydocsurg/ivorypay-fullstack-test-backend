import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Transaction } from "./Transaction";
import Model from "./Model";

@Entity("wallets")
export class Wallet extends Model {
    @ManyToOne(() => User, (user) => user.wallet)
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
