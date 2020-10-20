import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from "typeorm";
  
  
  @Entity()
  class RecentestSetting extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;

    // @Column({type: "int", default: null, nullable: true})
    // report_number: number;

    @Column({ type: "boolean", default: null, nullable: true })
    report1_enable: boolean | null;
  
    @Column({ type: "boolean", default: null, nullable: true })
    report1_utc_on: boolean | null;
  
    @Column({ type: "boolean", default: null, nullable: true })
    report1_gps_on: boolean | null;
  
    @Column({ type: "boolean", default: null, nullable: true })
    report1_alt_on: boolean | null;
  
    @Column({ type: "boolean", default: null, nullable: true })
    report1_speed_on: boolean | null;
  
    @Column({ type: "boolean", default: null, nullable: true })
    report1_course_on: boolean | null;
  
    @Column({type: "int", nullable: true})
    report1_period_time: number | null;

    @Column({ type: "boolean", default: null, nullable: true })
    report1_io1_on: boolean | null;

    @Column({ type: "boolean", default: null, nullable: true })
    report1_io2_on: boolean | null;

    @Column({ type: "boolean", default: null, nullable: true })
    report1_io3_on: boolean | null;

    @Column({ type: "boolean", default: null, nullable: true })
    report1_io4_on: boolean | null;

    @Column({ type: "boolean", default: null, nullable: true })
    report2_enable: boolean | null;
  
    @Column({ type: "boolean", default: null, nullable: true })
    report2_utc_on: boolean | null;
  
    @Column({ type: "boolean", default: null, nullable: true })
    report2_gps_on: boolean | null;
  
    @Column({ type: "boolean", default: null, nullable: true })
    report2_alt_on: boolean | null;
  
    @Column({ type: "boolean", default: null, nullable: true })
    report2_speed_on: boolean | null;
  
    @Column({ type: "boolean", default: null, nullable: true })
    report2_course_on: boolean | null;

    @Column({ type: "boolean", default: null, nullable: true })
    report2_io1_on: boolean | null;

    @Column({ type: "boolean", default: null, nullable: true })
    report2_io2_on: boolean | null;

    @Column({ type: "boolean", default: null, nullable: true })
    report2_io3_on: boolean | null;

    @Column({ type: "boolean", default: null, nullable: true })
    report2_io4_on: boolean | null;

  
    @Column({type: "int", nullable: true})
    report2_period_time: number | null;

    @Column({ type: "boolean", default: null, nullable: true })
    report3_enable: boolean | null;
  
    @Column({ type: "boolean", default: null, nullable: true })
    report3_utc_on: boolean | null;
  
    @Column({ type: "boolean", default: null, nullable: true })
    report3_gps_on: boolean | null;
  
    @Column({ type: "boolean", default: null, nullable: true })
    report3_alt_on: boolean | null;
  
    @Column({ type: "boolean", default: null, nullable: true })
    report3_speed_on: boolean | null;
  
    @Column({ type: "boolean", default: null, nullable: true })
    report3_course_on: boolean | null;
  
    @Column({type: "int", nullable: true})
    report3_period_time: number | null;

    @Column({ type: "boolean", default: null, nullable: true })
    report3_io1_on: boolean | null;

    @Column({ type: "boolean", default: null, nullable: true })
    report3_io2_on: boolean | null;

    @Column({ type: "boolean", default: null, nullable: true })
    report3_io3_on: boolean | null;

    @Column({ type: "boolean", default: null, nullable: true })
    report3_io4_on: boolean | null;

    @Column({ type: "boolean", default: null, nullable: true })
    report4_enable: boolean | null;
  
    @Column({ type: "boolean", default: null, nullable: true })
    report4_utc_on: boolean | null;
  
    @Column({ type: "boolean", default: null, nullable: true })
    report4_gps_on: boolean | null;
  
    @Column({ type: "boolean", default: null, nullable: true })
    report4_alt_on: boolean | null;
  
    @Column({ type: "boolean", default: null, nullable: true })
    report4_speed_on: boolean | null;
  
    @Column({ type: "boolean", default: null, nullable: true })
    report4_course_on: boolean | null;
  
    @Column({type: "int", nullable: true})
    report4_period_time: number | null;

    @Column({ type: "boolean", default: null, nullable: true })
    report4_io1_on: boolean | null;

    @Column({ type: "boolean", default: null, nullable: true })
    report4_io2_on: boolean | null;

    @Column({ type: "boolean", default: null, nullable: true })
    report4_io3_on: boolean | null;

    @Column({ type: "boolean", default: null, nullable: true })
    report_io4_on: boolean | null;

  
    @Column({type: "char", length:1, default: null, nullable: true})
    port1_out_status: String;
  
    @Column({type: "char", length:2, default: null, nullable: true})
    port1_io_status: String;

    @Column({type: "int",default: null, nullable: true})
    port1_ADC: Number | null;


    @Column({type: "char", length:1, default: null, nullable: true})
    port2_out_status: String;
  
    @Column({type: "char", length:2, default: null, nullable: true})
    port2_io_status: String;

    @Column({type: "int",default: null, nullable: true})
    port2_ADC:  Number | null;

    @Column({type: "char", length:1, default: null, nullable: true})
    port3_out_status: String;
  
    @Column({type: "char", length:2, default: null, nullable: true})
    port3_io_status: String;

    @Column({type: "int",default: null, nullable: true})
    port3_ADC:  Number | null;

    @Column({type: "char", length:1, default: null, nullable: true})
    port4_out_status: String;
  
    @Column({type: "char", length:2, default: null, nullable: true})
    port4_io_status: String;

    @Column({type: "int",default: null, nullable: true})
    port4_ADC:  Number | null;

    @Column({ type: "char", unique: true, length: 15})
    imei: string;


    @CreateDateColumn() createdAt: string;
  
    @UpdateDateColumn() updatedAt: string;
  }
  export default RecentestSetting;
  