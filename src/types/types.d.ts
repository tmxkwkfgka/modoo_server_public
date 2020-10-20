export enum verificationTarget{
  PHONE = "PHONE",
  EMAIL = "EMAIL"
}  

//여기다 안쓰는 타입 정의하면 Unable to require `.d.ts` file.

export interface RxReportSettingObj {
  info: RxReportSettingInfo,
  lastIndex: number,
  errMsg: string | null
}

export interface RxReportSettingInfo {
  MO_payload_iei: number,
  MO_payload_len: number,
  MO_payload: string,
  reports: RxReport[]
 

}

export interface RxReport {
  report_num: number, reportOn: number, utcOn: number, gpsOn: number, altOn: number, speedOn: number, courseOn: number, periodTime: number, io1On: number, io2On: number, io3On: number, io4On: number
}

export interface ioport_io_status {
  port_num: number,
  io_status: string,
  out_status: string
}