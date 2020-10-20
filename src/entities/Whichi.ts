
import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Entity,
  OneToMany,
  Column,
  ManyToMany,
 
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  ManyToOne

} from "typeorm";

import User from "./User";
import Message from "./Message";
import WhichiGroup from "./WhichiGroup";
import Place from "./Place";


@Entity()
class Whichi extends BaseEntity {

    //place, message, imei
    @PrimaryGeneratedColumn() id: number;

    @OneToMany(type => Message, message => message.whichi)
    messages: Message[];

    @Column({ type: "char", unique: true, length: 15})
    imei: string;

    @Column({ type: "char", unique: true, length: 50})
    name: string;

    @Column({ type: "text", default: null, nullable: true })
    pilot: string;

    @Column({ type: "text", default: null, nullable: true })
    type: string;

    @Column({ type: "text", default: null, nullable: true })
    usage: string;

    @Column({ type: "text", default: null, nullable: true })
    status: string;

    @Column({ type: "text", default: null, nullable: true })
    information: string;

    @Column({ type: "text", default: null, nullable: true })
    mission: string;

    @Column({ type: "text", default: null, nullable: true })
    activity: string;

    @Column({ type: "text", default: null, nullable: true })
    destination: string;

    @Column({ type: "text", default: null, nullable: true })
    profilepicture: string;

    @Column({ type: "text", default: null, nullable: true })
    icon: string;

    @OneToOne(type => Place, place=>place.whichi_having_last)
    @JoinColumn()
    last_position: Place;

    @OneToOne(type => Message, message=>message.whichi_having_last_message)
    @JoinColumn()
    last_message: Message;

    @Column({ type: "boolean", default: false })
    onMap: boolean;

    @ManyToMany(type => User, user=>user.uwpipe)
    users: User[];

    @ManyToOne(type => WhichiGroup, whichigroup=>whichigroup.whichi, {nullable: true})
    @JoinColumn()
    whichigroup: WhichiGroup | null;

    @Column({ type: "text", default: null, nullable: true })
    serialNumber: string;

    @Column({ type: "text", default: null, nullable: true })
    servicePlan: string;

      
    @Column({type: "int", default: null, nullable: true})
    tx_bytes: number;

    @Column({type: "int", default: null, nullable: true})
    rx_bytes: number;
    
    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;

    @Column({type: "datetime", default: null})
    placeUpdatedAt: string




}

export default Whichi;