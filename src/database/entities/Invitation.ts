import { Entity, Column, ManyToOne, OneToOne } from "typeorm";
import { User } from "./User";
import Model from "./Model";

@Entity("invitations")
export class Invitation extends Model {
    @Column()
    email: string; // Email of the invitee

    @Column({ default: false })
    accepted: boolean;

    @ManyToOne(() => User, (user) => user.referrals)
    invitee: User;

    @OneToOne(() => User, (user) => user.invitedBy) // New field for inviter
    inviter: User; // User who sent the invitation
}
