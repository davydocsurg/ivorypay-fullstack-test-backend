import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import Model from "./model";
import { Wallet } from "./Wallet";
import { Invitation } from "./Invitation";
import { Transaction } from "./Transaction";
// import { Wallet } from './Wallet';
// import { Invitation } from './Invitation';

export enum RoleEnumType {
    USER = "user",
    ADMIN = "admin",
}

@Entity()
export class User extends Model {
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: RoleEnumType,
        default: RoleEnumType.USER,
    })
    role: RoleEnumType.USER;

    @Column({ nullable: true, unique: true })
    referralCode: string;

    // Establish a bidirectional relationship with referred users
    @OneToMany(() => User, (user) => user.referredBy)
    referredUsers: User[];

    @OneToOne(() => Wallet)
    @JoinColumn()
    wallet: Wallet[];

    @OneToMany(() => Invitation, (invitation) => invitation.invitedUser)
    invitations: Invitation[];

    // Establish a relationship with transactions
    @OneToMany(() => Transaction, (transaction) => transaction.user)
    transactions: Transaction[];

    // Bidirectional relationship for referral relationship
    @ManyToOne(() => User, (user) => user.referredUsers)
    referredBy: User; // User who referred this user (if any)
}
