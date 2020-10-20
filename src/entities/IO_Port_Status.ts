import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,   
  } from "typeorm";
import Message from "./Message";
  

  
  @Entity()
  class IO_Port_Status extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;

    @Column({type: "int", default: null, nullable: true})
    port_num: number;

    @Column({type: "char", length:1, default: null, nullable: true})
    out_status: string;
  
    @Column({type: "char", length:2, default: null, nullable: true})
    io_status: string;

    @Column({type: "int",default: null, nullable: true})
    ADC: number;

    @ManyToOne(type=>Message, msg=>msg.ips)
    message: Message;


    @CreateDateColumn() createdAt: string;
  
    @UpdateDateColumn() updatedAt: string;
  }
  export default IO_Port_Status;
  