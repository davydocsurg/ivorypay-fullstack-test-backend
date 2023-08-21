import { Entity, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import Model from "./Model";

@Entity("invitations")
export class Invitation extends Model {
    @Column()
    email: string;

    @Column({ default: false })
    accepted: boolean;

    @ManyToOne(() => User, (user) => user.referrals)
    invitedUser: User;

    @ManyToOne(() => User, (user) => user.invitedUsers) // New field for inviter
    inviter: User; // User who sent the invitation
}
