import bcrypt from "bcrypt";
import { IsEmail } from "class-validator";
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,

  ManyToOne,
  ManyToMany,
  JoinTable,
 
  
} from "typeorm";

import Whichi from "./Whichi";
import WhichiGroup from "./WhichiGroup";

const BCRYPT_ROUNDS = 10;

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: "char", length: 20, unique: true})
  userid: string;

  @Column({ type: "text", nullable: true })
  @IsEmail()
  email: string | null;

  @Column({ type: "boolean", default: false })
  verifiedEmail: boolean;

  @Column({ type: "text" })
  firstName: string;

  @Column({ type: "text" })
  lastName: string;

  @Column({ type: "char", length: 20, unique: true, nullable:true})
  nickname: string;

  @Column({type: "text"})
  role: string;

  @Column({ type: "int", nullable: true })
  age: number;

  @Column({ type: "text", nullable: true })
  password: string;

  @Column({ type: "text", nullable: true })
  phoneNumber: string;

  @Column({ type: "boolean", default: false })
  verifiedPhoneNumber: boolean;

  @Column({ type: "text", nullable:true })
  profilePhoto: string | null;

  @Column({ type: "text", nullable: true })
  fbId: string;

  @Column({ type: "text", nullable: true })
  companyCode: string;

  @Column({ type: "text", nullable: true })
  registrant: string;

  @Column({ type: "text", nullable: true })
  fax: string;

  @Column({ type: "text", nullable: true })
  address: string;

  @Column({ type: "text", nullable: true })
  postalCode: string;

  @Column({ type: "boolean", default: true })
  activate: boolean;

  @OneToMany(type => User, user => user.parentUser, {nullable: true})
  usersAsUser: User[] | null;

  @ManyToOne(type => User, user => user.usersAsUser, {nullable: true})
  parentUser: User | null;

 
  @ManyToOne(type => User, user => user.usersMade, {nullable: true})
  issuerUser: User | null;

  @OneToMany(type => User, user => user.issuerUser, {nullable: true})
  usersMade: [User] | null;



  @ManyToMany(type => Whichi, whichi => whichi.users)
  @JoinTable()
  uwpipe: Whichi[];

  @OneToMany(type => WhichiGroup, whichigroup => whichigroup.createdBy, {nullable: true})
  whichigroups: WhichiGroup[]

  

 




  @CreateDateColumn() createdAt: string;

  @UpdateDateColumn() updatedAt: string;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async savePassword(): Promise<void> {
    if (this.password) {
      const hashedPassword = await this.hashPassword(this.password);
      this.password = hashedPassword;
    }
  }

  // async changePassword(previousPassword, newPassword, confirmPassword): Promise<any> {
  //   if(this.password){
  //     const hashedPassword = await this.hashPassword(this.password);

  //   }

  // }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }
}

export default User;
