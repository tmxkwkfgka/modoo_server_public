import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne
} from "typeorm";


import Place from "./Place";
import Report_Setting from "./Report_Setting";
import IO_Port_Status from "./IO_Port_Status";
import Whichi from "./Whichi";

@Entity()
class Message extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: "text", default: null, nullable: true  })
  raw_content: string;

  @Column({type: "char", length: 2, default: null, nullable: true })
  txrx: string;

  @Column({type: "char", length: 40, default: null, nullable: true })
  kind: string;

  @Column({ type: "text", default: null, nullable: true })
  message_body: string;

  @OneToMany(type => Report_Setting, rs => rs.message, {onDelete: 'CASCADE'})
  reports: [Report_Setting];

  @OneToMany(type => IO_Port_Status, ips=>ips.message, {onDelete: 'CASCADE'})
  ips: [IO_Port_Status]

  @OneToOne(type => Place, place=>place.message, {onDelete: 'CASCADE'})
  @JoinColumn()
  place: Place;

  @ManyToOne(type=>Whichi, whichi=>whichi.messages)
  whichi: Whichi;

  @OneToOne(type=>Whichi, whichi => whichi.last_message)
  whichi_having_last_message: Whichi

  @Column({type: "boolean", default: null, nullable: true})
  success: boolean

  @Column({type: "int", default: null, nullable: true})
  payload_length: number;


  @CreateDateColumn() createdAt: string;

  @UpdateDateColumn() updatedAt: string;
}
export default Message;
