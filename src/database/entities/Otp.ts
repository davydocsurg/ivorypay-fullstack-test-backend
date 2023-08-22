import { Column, Entity, ManyToOne } from "typeorm";
import Model from "./Model";
import { User } from "./User";

@Entity("otps")
export class Otp extends Model {
    @Column()
    otp: string;

    @Column()
    email: string;

    @ManyToOne(() => User, (user) => user.otp)
    user: User;
}
