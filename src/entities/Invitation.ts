import { Entity, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import Model from "./Model";

@Entity("invitations")
export class Invitation extends Model {
    @Column()
    email: string;

    @Column()
    token: string;

    @Column({ default: false })
    accepted: boolean;

    @ManyToOne(() => User, (user) => user.invitations)
    invitedUser: User;
}
