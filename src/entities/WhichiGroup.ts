
import {
    BaseEntity,
    PrimaryGeneratedColumn,
    Entity,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
  
  } from "typeorm";
  
 
  import Whichi from "./Whichi";
  import User from "./User"
  
  
  @Entity()
  class WhichiGroup extends BaseEntity {
  
      //place, message, imei
      @PrimaryGeneratedColumn() id: number;
  
      @Column({ type: "char", unique: true, length: 50})
      name: string;
  
      @Column({ type: "text", default: null, nullable: true })
      icon: string;

      @Column({ type: "text", default: null, nullable: true })
      manager: string;

      @Column({ type: "text", default: null, nullable: true })
      pilots: string;

      @Column({ type: "text", default: null, nullable: true })
      profilePhoto: string;
  
      @Column({ type: "char", default:null, nullable:true, length: 50})
      color: string;

      @OneToMany(type => Whichi, whichi=>whichi.whichigroup)
      whichi: [Whichi];

      @ManyToOne(type => User, user => user.whichigroups, {nullable: true})
      @JoinColumn()
      createdBy: User;
  
      
      @CreateDateColumn() createdAt: string;
  
      @UpdateDateColumn() updatedAt: string;
  
  
  }
  
  export default WhichiGroup;