import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,

  
} from "typeorm";


import Message from "./Message";
import Whichi from "./Whichi";

// class BoolBitTransformer implements ValueTransformer {
//   // To db from typeorm
//   to(value: boolean | null): Buffer | null {
//     if (value === null) {
//       return null;
//     }
//     const res = new Buffer(1);
//     res[0] = value ? 1 : 0;
//     return res;
//   }
//   // From db to typeorm
//   from(value: Buffer): boolean | null {
//     if (value === null) {
//       return null;
//     }
//     return value[0] === 1;
//   }
// }

@Entity()
class Place extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: "text", nullable: true })
  name: string;
  
  @Column({type: "int", default: null, nullable: true})
  report_number: Number;

  @Column({ type: "double", nullable: true})
  lat: number;

  @Column({ type: "double", nullable: true})
  lng: number;

  @Column({ type: "datetime", nullable:true})
  utc: Date;

  @Column({ type: "double", nullable:true})
  alt: number;

  @Column({ type: "double", nullable:true})
  speed: number;

  @Column({ type: "double", nullable:true})
  course: number;

  @Column({ type: "char", length: 15})
  imei: string;

  @Column({type: "char", length: 40})
  kind: string;

  

  @OneToOne(type=>Message, message => message.place)
  message: Message;

  @OneToOne(type=>Whichi, whichi => whichi.last_position)
  whichi_having_last: Whichi

  //@Column({ type: "tinyint(1)", default: false })
  // @Column({
  //   type: 'bit',
  //   nullable: false,
  //   default: () => "b\'0\'",
  //   name: 'isFav',
  //   transformer: new BoolBitTransformer()
  // })
  // isFav: boolean;

  @CreateDateColumn() createdAt: string;

  @UpdateDateColumn() updatedAt: string;
}
export default Place;
