import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
} from "typeorm";
import Model from "./Model";
import { Wallet } from "./Wallet";
import { Invitation } from "./Invitation";
import { Transaction } from "./Transaction";
import { Otp } from "./Otp";

export enum RoleEnumType {
    USER = "user",
    ADMIN = "admin",
}

@Entity("users")
export class User extends Model {
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Index("email_index")
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: RoleEnumType,
        default: RoleEnumType.USER,
    })
    role: RoleEnumType;

    @Column({ nullable: true, unique: true })
    referralCode: string;

    @Column({ type: "timestamp", nullable: true })
    passwordChangedAt: Date | null;

    @Column({ nullable: true, default: "unverified" })
    verificationStatus: string;

    @Column({ nullable: true, type: "timestamp" })
    verifiedAt: Date | null;

    @Column({ nullable: true })
    verificationToken: string;

    @Column({ nullable: true })
    resetPasswordToken: string;

    @Column({ nullable: true, type: "timestamp" })
    resetPasswordExpires: Date | null;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => Otp, (otp) => otp.email)
    otp: Otp[];

    // Establish a bidirectional relationship with referred users
    @OneToMany(() => User, (user) => user.referredBy)
    referredUsers: User[];

    @OneToOne(() => Wallet)
    @JoinColumn()
    wallet: Wallet;

    @OneToMany(() => Invitation, (invitation) => invitation.invitee)
    referrals: Invitation[];

    // Establish a relationship with transactions
    @OneToMany(() => Transaction, (transaction) => transaction.user)
    transactions: Transaction[];

    // Bidirectional relationship for referral relationship
    @ManyToOne(() => User, (user) => user.referredUsers)
    referredBy: User; // User who referred this user (if any)

    @OneToOne(() => Invitation, (invitation) => invitation.inviter)
    invitedBy: User; // User who sent the invitation
}
