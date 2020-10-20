import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne
  } from "typeorm";
  
  
import Message from "./Message";
  
  @Entity()
  class Report_Setting extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;

    @Column({type: "int", default: null, nullable: true})
    report_number: number;

    @Column({ type: "boolean", default: null, nullable: true })
    enable: boolean;
  
  
    @Column({ type: "boolean", default: null, nullable: true })
    utc_on: boolean;
  
    @Column({ type: "boolean", default: null, nullable: true })
    gps_on: boolean;
  
    @Column({ type: "boolean", default: null, nullable: true })
    alt_on: boolean;
  
    @Column({ type: "boolean", default: null, nullable: true })
    speed_on: boolean;
  
    @Column({ type: "boolean", default: null, nullable: true })
    course_on: boolean;

    @Column({ type: "boolean", default: null, nullable: true })
    io1_on: boolean;

    @Column({ type: "boolean", default: null, nullable: true })
    io2_on: boolean;

    @Column({ type: "boolean", default: null, nullable: true })
    io3_on: boolean;

    @Column({ type: "boolean", default: null, nullable: true })
    io4_on: boolean;
  
    @Column({type: "int", nullable: true})
    period_time: number;
  
    @ManyToOne(type => Message, msg=>msg.reports)
    message: Message;
    

    @CreateDateColumn() createdAt: string;
  
    @UpdateDateColumn() updatedAt: string;
  }
  export default Report_Setting;
  