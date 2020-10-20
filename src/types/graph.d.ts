export const typeDefs = ["type AddRxResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype Mutation {\n  AddRx(raw_content: String!): AddRxResponse!\n  AddRxMessage(raw_content: String!, message_body: String!): AddRxMessageResponse\n  AddRxReport(raw_content: String!, start: Int!): AddRxReportResponse!\n  AddTxDistress(imei: String!, on: String!): AddTxDistressResponse\n  AddTxIoPort(imei: String!, IOPort1_IO_status: String, IOPort1_out_status: String, IOPort2_IO_status: String, IOPort2_out_status: String, IOPort3_IO_status: String, IOPort3_out_status: String, IOPort4_IO_status: String, IOPort4_out_status: String): AddTxIoPortResponse\n  AddTxMessage(imei: String!, message_body: String!): AddTxMessageResponse\n  AddTxPoll(imei: String!, reportNum: String!): AddTxPollResponse!\n  AddTxReport(imei: String!): AddTxReportResponse\n  AddTxReportSet(imei: String!, report_masking_bit: String!, io_masking_bit: String!, period_time: String!): AddTxReportSetResponse\n  AddTxReportsIoPortSet(imei: String!, report_masking_bit_1: String!, period_time_1: String!, io_masking_bit_1: String!, report_masking_bit_2: String!, period_time_2: String!, io_masking_bit_2: String!, report_masking_bit_3: String!, period_time_3: String!, io_masking_bit_3: String!, report_masking_bit_4: String!, period_time_4: String!, io_masking_bit_4: String!, IOPort1_IO_status: String, IOPort1_out_status: String, IOPort2_IO_status: String, IOPort2_out_status: String, IOPort3_IO_status: String, IOPort3_out_status: String, IOPort4_IO_status: String, IOPort4_out_status: String): AddTxReportsIoPortSetResponse\n  AddPlace(raw: String, lat: Float!, lng: Float!, imei: String, speed: Float, course: Float, utc: String, poll: Boolean): AddPlaceResponse!\n  DeletePlace(placeId: Int!): DeletePlaceResponse!\n  EditPlace(placeId: Int!, name: String, isFav: Boolean): EditPlaceResponse!\n  ChangeMyPassword(userid: Int!, previousPassword: String!, newPassword: String!, confirmPassword: String!): ChangeMyPasswordResponse!\n  ChangePasswordByAdmin(userid: Int!, newPassword: String!, confirmPassword: String!): ChangePasswordByAdminResponse!\n  DeleteUser(userid: Int!): DeleteUserResponse!\n  SignIn(userid: String!, password: String!): SignInResponse!\n  SignUp(userid: String!, role: String!, firstName: String!, lastName: String!, email: String!, password: String!, phoneNumber: String!, uwpipeid: [Int], assetParentId: Int, customerParentId: Int, companyCode: String, registrant: String, fax: String, address: String, postalCode: String, nickname: String): SignUpResponse!\n  UpdateMyProfile(firstName: String, lastName: String, phoneNumber: String, email: String, profilePhoto: String, age: Int, companyCode: String, registrant: String, fax: String, address: String, postalCode: String, activate: Boolean, nickname: String): UpdateMyProfileResponse!\n  UpdateProfileByAdmin(userId: Int!, firstName: String, lastName: String, phoneNumber: String, email: String, profilePhoto: String, age: Int, companyCode: String, registrant: String, fax: String, address: String, postalCode: String, activate: Boolean, nickname: String): UpdateProfileByAdminResponse!\n  SingleFileUpload(file: Upload!, userId: Int, whichiId: Int, whichigroupId: Int): SingleFileUploadResponse!\n  AddWhichi(name: String!, imei: String!, pilot: String, type: String, usage: String, status: String, information: String, mission: String, activity: String, destination: String, profilepicture: String, icon: String, serialNumber: String, servicePlan: String): AddWhichiResponse!\n  AddWhichiGroup(name: String, icon: String, color: String, manager: String, pilots: String): AddWhichiGroupResponse!\n  AddWhichiToUser(id: Int!, imei: String!): AddWhichiToUserResponse!\n  DelWhichiGroup(whichiGroupId: Int!): DelWhichiGroupResponse!\n  DelWhichiToUser(userid: String!, imei: String!): DelWhichiToUserResponse!\n  EditWhichi(imei: String!, name: String, pilot: String, type: String, usage: String, status: String, information: String, mission: String, activity: String, icon: String, destination: String, onMap: Boolean, whichigroup: Int, serialNumber: String, servicePlan: String): EditWhichiResponse!\n  EditWhichiGroup(id: Int!, name: String, icon: String, color: String, manager: String, pilots: String): EditWhichiGroupResponse!\n  UpdateRecentestSetting(imei: String!, name: String, pilot: String, type: String, usage: String, status: String, information: String, mission: String, activity: String, icon: String, destination: String, onMap: Boolean, whichigroup: Int): UpdateRecentestSettingResponse!\n}\n\ntype AddRxMessageResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype AddRxReportResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype AddTxDistressResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype AddTxIoPortResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype AddTxMessageResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype AddTxPollResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype AddTxReportResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype AddTxReportSetResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype AddTxReportsIoPortSetResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype GetMessagesResponse {\n  ok: Boolean!\n  error: String\n  messages: [Message]\n}\n\ntype Query {\n  GetMessages(txrx: String, kind: [String], whichiIds: [Int], imeis: [String], place: Boolean, report_setting: Boolean, io_port_status: Boolean, from: Date, to: Date): GetMessagesResponse!\n  GetMessageUseBytes(whichiId: Int!): GetMessageUseBytesResponse!\n  GetDailyDistance(whichiId: Int!, from: Date, to: Date): GetDailyDistanceResponse!\n  GetManyPlaces(imeis: [String], from: String, to: String): GetManyPlacesResponse!\n  GetMyPlaces(whichiId: Int!, from: Date, to: Date): GetMyPlacesResponse!\n  CheckUserSameField(nickname: String, userid: String, imei: String): CheckUserSameFieldResponse!\n  GetChildUsers(userid: Int!): GetChildUsersResponse!\n  GetMyProfile: GetMyProfileResponse!\n  GetUsers(wholeTree: Boolean): GetUsersResponse!\n  GetMyWhichiGroups: GetMyWhichiGroupsResponse!\n  GetRecentestSetting(imei: String!): GetRecentestSettingResponse!\n  GetUsersWhichis: GetUsersWhichisResponse!\n  GetWhichis(imei: String): GetWhichisResponse!\n}\n\ntype GetMessageUseBytesResponse {\n  ok: Boolean!\n  error: String\n  tx: Int\n  rx: Int\n}\n\ntype IO_Port_Status {\n  id: Int!\n  port_num: Int\n  out_status: String\n  io_status: String\n  ADC: Int\n  createdAt: String\n  updatedAt: String\n}\n\ntype Message {\n  id: Int!\n  raw_content: String\n  txrx: String\n  kind: String\n  message_body: String\n  reports: [Report_Setting]\n  ips: [IO_Port_Status]\n  place: Place\n  whichi: Whichi\n  whichi_having_last_message: Whichi\n  success: Boolean\n  payload_length: Int\n  createdAt: String!\n  updatedAt: String\n}\n\ntype Report_Setting {\n  id: Int!\n  report_number: Int\n  utc_on: Boolean\n  gps_on: Boolean\n  alt_on: Boolean\n  speed_on: Boolean\n  course_on: Boolean\n  io1_on: Boolean\n  io2_on: Boolean\n  io3_on: Boolean\n  io4_on: Boolean\n  enable: Boolean\n  period_time: Int\n  createdAt: String\n  updatedAt: String\n}\n\ntype AddPlaceResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype DeletePlaceResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype EditPlaceResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype DailyDistance {\n  km: Float!\n  feet: Float!\n  knot: Float!\n  speed: Float!\n  date: String!\n}\n\ntype GetDailyDistanceResponse {\n  ok: Boolean!\n  error: String\n  resultArr: [DailyDistance]\n  kmsum: Float\n  feetsum: Float\n  knotsum: Float\n  speedavg: Float\n}\n\ntype ManyPlaces {\n  imei: String!\n  places: [Place]\n}\n\ntype GetManyPlacesResponse {\n  ok: Boolean!\n  error: String\n  manyplaces: [ManyPlaces]\n}\n\ntype GetMyPlacesResponse {\n  ok: Boolean!\n  error: String\n  places: [Place]\n}\n\nscalar Date\n\ntype Place {\n  id: Int!\n  name: String\n  lat: Float\n  lng: Float\n  utc: Date\n  alt: Float\n  speed: Float\n  course: Float\n  imei: String\n  kind: String\n  createdAt: String!\n  updatedAt: String\n}\n\ntype ChangeMyPasswordResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype ChangePasswordByAdminResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype CheckUserSameFieldResponse {\n  ok: Boolean!\n  error: String\n  has: Boolean\n}\n\ntype DeleteUserResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype GetChildUsersResponse {\n  ok: Boolean!\n  error: String\n  users: [User]\n}\n\ntype GetMyProfileResponse {\n  ok: Boolean!\n  error: String\n  user: User\n}\n\ntype GetUsersResponse {\n  ok: Boolean!\n  error: String\n  users: [User]\n}\n\ntype User {\n  id: Int!\n  userid: String!\n  email: String\n  verifiedEmail: Boolean!\n  firstName: String!\n  lastName: String!\n  nickname: String\n  role: String!\n  age: Int\n  password: String\n  phoneNumber: String\n  profilePhoto: String\n  companyCode: String\n  registrant: String\n  fax: String\n  address: String\n  postalCode: String\n  activate: Boolean\n  uwpipe: [Whichi]\n  whichigroups: [WhichiGroup]\n  parentUser: User\n  usersAsUser: [User]\n  issuerUser: User\n  usersMade: [User]\n  createdAt: String!\n  updatedAt: String\n}\n\ntype SignInResponse {\n  ok: Boolean!\n  error: String\n  token: String\n}\n\ntype SignUpResponse {\n  ok: Boolean!\n  error: String\n  token: String\n  newUser: User\n}\n\ntype UpdateMyProfileResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype UpdateProfileByAdminResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype File {\n  filename: String\n  path: String\n  mimetype: String\n  encoding: String\n}\n\nscalar Upload\n\ntype SingleFileUploadResponse {\n  ok: Boolean!\n  error: String\n  file: File\n}\n\ntype Verification {\n  id: Int!\n  target: String!\n  payload: String!\n  key: String!\n  verified: Boolean!\n  createdAt: String!\n  updatedAt: String\n}\n\ntype AddWhichiResponse {\n  ok: Boolean!\n  error: String\n  newWhichi: Whichi\n}\n\ntype AddWhichiGroupResponse {\n  ok: Boolean!\n  error: String\n  groupid: Int\n}\n\ntype AddWhichiToUserResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype DelWhichiGroupResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype DelWhichiToUserResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype EditWhichiResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype EditWhichiGroupResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype GetMyWhichiGroupsResponse {\n  ok: Boolean!\n  error: String\n  whichigroups: [WhichiGroup]\n}\n\ntype GetRecentestSettingResponse {\n  ok: Boolean!\n  error: String\n  recentestSetting: RecentestSetting\n}\n\ntype GetUsersWhichisResponse {\n  ok: Boolean!\n  error: String\n  whichis: [Whichi]\n}\n\ntype GetWhichisResponse {\n  ok: Boolean!\n  error: String\n  whichis: [Whichi]\n}\n\ntype RecentestSetting {\n  report1_enable: Boolean\n  report1_utc_on: Boolean\n  report1_gps_on: Boolean\n  report1_alt_on: Boolean\n  report1_speed_on: Boolean\n  report1_course_on: Boolean\n  report1_period_time: Int\n  report1_io1_on: Boolean\n  report1_io2_on: Boolean\n  report1_io3_on: Boolean\n  report1_io4_on: Boolean\n  report2_enable: Boolean\n  report2_utc_on: Boolean\n  report2_gps_on: Boolean\n  report2_alt_on: Boolean\n  report2_speed_on: Boolean\n  report2_course_on: Boolean\n  report2_period_time: Int\n  report2_io1_on: Boolean\n  report2_io2_on: Boolean\n  report2_io3_on: Boolean\n  report2_io4_on: Boolean\n  report3_enable: Boolean\n  report3_utc_on: Boolean\n  report3_gps_on: Boolean\n  report3_alt_on: Boolean\n  report3_speed_on: Boolean\n  report3_course_on: Boolean\n  report3_period_time: Int\n  report3_io1_on: Boolean\n  report3_io2_on: Boolean\n  report3_io3_on: Boolean\n  report3_io4_on: Boolean\n  report4_enable: Boolean\n  report4_utc_on: Boolean\n  report4_gps_on: Boolean\n  report4_alt_on: Boolean\n  report4_speed_on: Boolean\n  report4_course_on: Boolean\n  report4_period_time: Int\n  report4_io1_on: Boolean\n  report4_io2_on: Boolean\n  report4_io3_on: Boolean\n  report4_io4_on: Boolean\n  port1_out_status: String\n  port1_io_status: String\n  port1_ADC: Int\n  port2_out_status: String\n  port2_io_status: String\n  port2_ADC: Int\n  port3_out_status: String\n  port3_io_status: String\n  port3_ADC: Int\n  port4_out_status: String\n  port4_io_status: String\n  port4_ADC: Int\n  imei: String\n  createdAt: String\n  updatedAt: String\n}\n\ntype Whichi {\n  id: Int!\n  messages: [Message]\n  imei: String\n  name: String\n  pilot: String\n  type: String\n  usage: String\n  status: String\n  information: String\n  mission: String\n  activity: String\n  destination: String\n  profilepicture: String\n  icon: String\n  last_message: Message\n  last_position: Place\n  onMap: Boolean\n  users: [User]\n  whichigroup: WhichiGroup\n  serialNumber: String\n  servicePlan: String\n  tx_bytes: Int\n  rx_bytes: Int\n  createdAt: String\n  updatedAt: String\n  placeUpdatedAt: String\n}\n\ntype WhichiGroup {\n  id: Int!\n  name: String\n  icon: String\n  color: String\n  manager: String\n  pilots: String\n  profilePhoto: String\n  whichi: [Whichi]\n  createdBy: User\n  createdAt: String\n  updatedAt: String\n}\n\ntype UpdateRecentestSettingResponse {\n  ok: Boolean!\n  error: String\n}\n"];
/* tslint:disable */

export interface Query {
  GetMessages: GetMessagesResponse;
  GetMessageUseBytes: GetMessageUseBytesResponse;
  GetDailyDistance: GetDailyDistanceResponse;
  GetManyPlaces: GetManyPlacesResponse;
  GetMyPlaces: GetMyPlacesResponse;
  CheckUserSameField: CheckUserSameFieldResponse;
  GetChildUsers: GetChildUsersResponse;
  GetMyProfile: GetMyProfileResponse;
  GetUsers: GetUsersResponse;
  GetMyWhichiGroups: GetMyWhichiGroupsResponse;
  GetRecentestSetting: GetRecentestSettingResponse;
  GetUsersWhichis: GetUsersWhichisResponse;
  GetWhichis: GetWhichisResponse;
}

export interface GetMessagesQueryArgs {
  txrx: string | null;
  kind: Array<string> | null;
  whichiIds: Array<number> | null;
  imeis: Array<string> | null;
  place: boolean | null;
  report_setting: boolean | null;
  io_port_status: boolean | null;
  from: Date | null;
  to: Date | null;
}

export interface GetMessageUseBytesQueryArgs {
  whichiId: number;
}

export interface GetDailyDistanceQueryArgs {
  whichiId: number;
  from: Date | null;
  to: Date | null;
}

export interface GetManyPlacesQueryArgs {
  imeis: Array<string> | null;
  from: string | null;
  to: string | null;
}

export interface GetMyPlacesQueryArgs {
  whichiId: number;
  from: Date | null;
  to: Date | null;
}

export interface CheckUserSameFieldQueryArgs {
  nickname: string | null;
  userid: string | null;
  imei: string | null;
}

export interface GetChildUsersQueryArgs {
  userid: number;
}

export interface GetUsersQueryArgs {
  wholeTree: boolean | null;
}

export interface GetRecentestSettingQueryArgs {
  imei: string;
}

export interface GetWhichisQueryArgs {
  imei: string | null;
}

export type Date = any;

export interface GetMessagesResponse {
  ok: boolean;
  error: string | null;
  messages: Array<Message> | null;
}

export interface Message {
  id: number;
  raw_content: string | null;
  txrx: string | null;
  kind: string | null;
  message_body: string | null;
  reports: Array<Report_Setting> | null;
  ips: Array<IO_Port_Status> | null;
  place: Place | null;
  whichi: Whichi | null;
  whichi_having_last_message: Whichi | null;
  success: boolean | null;
  payload_length: number | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface Report_Setting {
  id: number;
  report_number: number | null;
  utc_on: boolean | null;
  gps_on: boolean | null;
  alt_on: boolean | null;
  speed_on: boolean | null;
  course_on: boolean | null;
  io1_on: boolean | null;
  io2_on: boolean | null;
  io3_on: boolean | null;
  io4_on: boolean | null;
  enable: boolean | null;
  period_time: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface IO_Port_Status {
  id: number;
  port_num: number | null;
  out_status: string | null;
  io_status: string | null;
  ADC: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface Place {
  id: number;
  name: string | null;
  lat: number | null;
  lng: number | null;
  utc: Date | null;
  alt: number | null;
  speed: number | null;
  course: number | null;
  imei: string | null;
  kind: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface Whichi {
  id: number;
  messages: Array<Message> | null;
  imei: string | null;
  name: string | null;
  pilot: string | null;
  type: string | null;
  usage: string | null;
  status: string | null;
  information: string | null;
  mission: string | null;
  activity: string | null;
  destination: string | null;
  profilepicture: string | null;
  icon: string | null;
  last_message: Message | null;
  last_position: Place | null;
  onMap: boolean | null;
  users: Array<User> | null;
  whichigroup: WhichiGroup | null;
  serialNumber: string | null;
  servicePlan: string | null;
  tx_bytes: number | null;
  rx_bytes: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  placeUpdatedAt: string | null;
}

export interface User {
  id: number;
  userid: string;
  email: string | null;
  verifiedEmail: boolean;
  firstName: string;
  lastName: string;
  nickname: string | null;
  role: string;
  age: number | null;
  password: string | null;
  phoneNumber: string | null;
  profilePhoto: string | null;
  companyCode: string | null;
  registrant: string | null;
  fax: string | null;
  address: string | null;
  postalCode: string | null;
  activate: boolean | null;
  uwpipe: Array<Whichi> | null;
  whichigroups: Array<WhichiGroup> | null;
  parentUser: User | null;
  usersAsUser: Array<User> | null;
  issuerUser: User | null;
  usersMade: Array<User> | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface WhichiGroup {
  id: number;
  name: string | null;
  icon: string | null;
  color: string | null;
  manager: string | null;
  pilots: string | null;
  profilePhoto: string | null;
  whichi: Array<Whichi> | null;
  createdBy: User | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface GetMessageUseBytesResponse {
  ok: boolean;
  error: string | null;
  tx: number | null;
  rx: number | null;
}

export interface GetDailyDistanceResponse {
  ok: boolean;
  error: string | null;
  resultArr: Array<DailyDistance> | null;
  kmsum: number | null;
  feetsum: number | null;
  knotsum: number | null;
  speedavg: number | null;
}

export interface DailyDistance {
  km: number;
  feet: number;
  knot: number;
  speed: number;
  date: string;
}

export interface GetManyPlacesResponse {
  ok: boolean;
  error: string | null;
  manyplaces: Array<ManyPlaces> | null;
}

export interface ManyPlaces {
  imei: string;
  places: Array<Place> | null;
}

export interface GetMyPlacesResponse {
  ok: boolean;
  error: string | null;
  places: Array<Place> | null;
}

export interface CheckUserSameFieldResponse {
  ok: boolean;
  error: string | null;
  has: boolean | null;
}

export interface GetChildUsersResponse {
  ok: boolean;
  error: string | null;
  users: Array<User> | null;
}

export interface GetMyProfileResponse {
  ok: boolean;
  error: string | null;
  user: User | null;
}

export interface GetUsersResponse {
  ok: boolean;
  error: string | null;
  users: Array<User> | null;
}

export interface GetMyWhichiGroupsResponse {
  ok: boolean;
  error: string | null;
  whichigroups: Array<WhichiGroup> | null;
}

export interface GetRecentestSettingResponse {
  ok: boolean;
  error: string | null;
  recentestSetting: RecentestSetting | null;
}

export interface RecentestSetting {
  report1_enable: boolean | null;
  report1_utc_on: boolean | null;
  report1_gps_on: boolean | null;
  report1_alt_on: boolean | null;
  report1_speed_on: boolean | null;
  report1_course_on: boolean | null;
  report1_period_time: number | null;
  report1_io1_on: boolean | null;
  report1_io2_on: boolean | null;
  report1_io3_on: boolean | null;
  report1_io4_on: boolean | null;
  report2_enable: boolean | null;
  report2_utc_on: boolean | null;
  report2_gps_on: boolean | null;
  report2_alt_on: boolean | null;
  report2_speed_on: boolean | null;
  report2_course_on: boolean | null;
  report2_period_time: number | null;
  report2_io1_on: boolean | null;
  report2_io2_on: boolean | null;
  report2_io3_on: boolean | null;
  report2_io4_on: boolean | null;
  report3_enable: boolean | null;
  report3_utc_on: boolean | null;
  report3_gps_on: boolean | null;
  report3_alt_on: boolean | null;
  report3_speed_on: boolean | null;
  report3_course_on: boolean | null;
  report3_period_time: number | null;
  report3_io1_on: boolean | null;
  report3_io2_on: boolean | null;
  report3_io3_on: boolean | null;
  report3_io4_on: boolean | null;
  report4_enable: boolean | null;
  report4_utc_on: boolean | null;
  report4_gps_on: boolean | null;
  report4_alt_on: boolean | null;
  report4_speed_on: boolean | null;
  report4_course_on: boolean | null;
  report4_period_time: number | null;
  report4_io1_on: boolean | null;
  report4_io2_on: boolean | null;
  report4_io3_on: boolean | null;
  report4_io4_on: boolean | null;
  port1_out_status: string | null;
  port1_io_status: string | null;
  port1_ADC: number | null;
  port2_out_status: string | null;
  port2_io_status: string | null;
  port2_ADC: number | null;
  port3_out_status: string | null;
  port3_io_status: string | null;
  port3_ADC: number | null;
  port4_out_status: string | null;
  port4_io_status: string | null;
  port4_ADC: number | null;
  imei: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface GetUsersWhichisResponse {
  ok: boolean;
  error: string | null;
  whichis: Array<Whichi> | null;
}

export interface GetWhichisResponse {
  ok: boolean;
  error: string | null;
  whichis: Array<Whichi> | null;
}

export interface Mutation {
  AddRx: AddRxResponse;
  AddRxMessage: AddRxMessageResponse | null;
  AddRxReport: AddRxReportResponse;
  AddTxDistress: AddTxDistressResponse | null;
  AddTxIoPort: AddTxIoPortResponse | null;
  AddTxMessage: AddTxMessageResponse | null;
  AddTxPoll: AddTxPollResponse;
  AddTxReport: AddTxReportResponse | null;
  AddTxReportSet: AddTxReportSetResponse | null;
  AddTxReportsIoPortSet: AddTxReportsIoPortSetResponse | null;
  AddPlace: AddPlaceResponse;
  DeletePlace: DeletePlaceResponse;
  EditPlace: EditPlaceResponse;
  ChangeMyPassword: ChangeMyPasswordResponse;
  ChangePasswordByAdmin: ChangePasswordByAdminResponse;
  DeleteUser: DeleteUserResponse;
  SignIn: SignInResponse;
  SignUp: SignUpResponse;
  UpdateMyProfile: UpdateMyProfileResponse;
  UpdateProfileByAdmin: UpdateProfileByAdminResponse;
  SingleFileUpload: SingleFileUploadResponse;
  AddWhichi: AddWhichiResponse;
  AddWhichiGroup: AddWhichiGroupResponse;
  AddWhichiToUser: AddWhichiToUserResponse;
  DelWhichiGroup: DelWhichiGroupResponse;
  DelWhichiToUser: DelWhichiToUserResponse;
  EditWhichi: EditWhichiResponse;
  EditWhichiGroup: EditWhichiGroupResponse;
  UpdateRecentestSetting: UpdateRecentestSettingResponse;
}

export interface AddRxMutationArgs {
  raw_content: string;
}

export interface AddRxMessageMutationArgs {
  raw_content: string;
  message_body: string;
}

export interface AddRxReportMutationArgs {
  raw_content: string;
  start: number;
}

export interface AddTxDistressMutationArgs {
  imei: string;
  on: string;
}

export interface AddTxIoPortMutationArgs {
  imei: string;
  IOPort1_IO_status: string | null;
  IOPort1_out_status: string | null;
  IOPort2_IO_status: string | null;
  IOPort2_out_status: string | null;
  IOPort3_IO_status: string | null;
  IOPort3_out_status: string | null;
  IOPort4_IO_status: string | null;
  IOPort4_out_status: string | null;
}

export interface AddTxMessageMutationArgs {
  imei: string;
  message_body: string;
}

export interface AddTxPollMutationArgs {
  imei: string;
  reportNum: string;
}

export interface AddTxReportMutationArgs {
  imei: string;
}

export interface AddTxReportSetMutationArgs {
  imei: string;
  report_masking_bit: string;
  io_masking_bit: string;
  period_time: string;
}

export interface AddTxReportsIoPortSetMutationArgs {
  imei: string;
  report_masking_bit_1: string;
  period_time_1: string;
  io_masking_bit_1: string;
  report_masking_bit_2: string;
  period_time_2: string;
  io_masking_bit_2: string;
  report_masking_bit_3: string;
  period_time_3: string;
  io_masking_bit_3: string;
  report_masking_bit_4: string;
  period_time_4: string;
  io_masking_bit_4: string;
  IOPort1_IO_status: string | null;
  IOPort1_out_status: string | null;
  IOPort2_IO_status: string | null;
  IOPort2_out_status: string | null;
  IOPort3_IO_status: string | null;
  IOPort3_out_status: string | null;
  IOPort4_IO_status: string | null;
  IOPort4_out_status: string | null;
}

export interface AddPlaceMutationArgs {
  raw: string | null;
  lat: number;
  lng: number;
  imei: string | null;
  speed: number | null;
  course: number | null;
  utc: string | null;
  poll: boolean | null;
}

export interface DeletePlaceMutationArgs {
  placeId: number;
}

export interface EditPlaceMutationArgs {
  placeId: number;
  name: string | null;
  isFav: boolean | null;
}

export interface ChangeMyPasswordMutationArgs {
  userid: number;
  previousPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordByAdminMutationArgs {
  userid: number;
  newPassword: string;
  confirmPassword: string;
}

export interface DeleteUserMutationArgs {
  userid: number;
}

export interface SignInMutationArgs {
  userid: string;
  password: string;
}

export interface SignUpMutationArgs {
  userid: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  uwpipeid: Array<number> | null;
  assetParentId: number | null;
  customerParentId: number | null;
  companyCode: string | null;
  registrant: string | null;
  fax: string | null;
  address: string | null;
  postalCode: string | null;
  nickname: string | null;
}

export interface UpdateMyProfileMutationArgs {
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  email: string | null;
  profilePhoto: string | null;
  age: number | null;
  companyCode: string | null;
  registrant: string | null;
  fax: string | null;
  address: string | null;
  postalCode: string | null;
  activate: boolean | null;
  nickname: string | null;
}

export interface UpdateProfileByAdminMutationArgs {
  userId: number;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  email: string | null;
  profilePhoto: string | null;
  age: number | null;
  companyCode: string | null;
  registrant: string | null;
  fax: string | null;
  address: string | null;
  postalCode: string | null;
  activate: boolean | null;
  nickname: string | null;
}

export interface SingleFileUploadMutationArgs {
  file: Upload;
  userId: number | null;
  whichiId: number | null;
  whichigroupId: number | null;
}

export interface AddWhichiMutationArgs {
  name: string;
  imei: string;
  pilot: string | null;
  type: string | null;
  usage: string | null;
  status: string | null;
  information: string | null;
  mission: string | null;
  activity: string | null;
  destination: string | null;
  profilepicture: string | null;
  icon: string | null;
  serialNumber: string | null;
  servicePlan: string | null;
}

export interface AddWhichiGroupMutationArgs {
  name: string | null;
  icon: string | null;
  color: string | null;
  manager: string | null;
  pilots: string | null;
}

export interface AddWhichiToUserMutationArgs {
  id: number;
  imei: string;
}

export interface DelWhichiGroupMutationArgs {
  whichiGroupId: number;
}

export interface DelWhichiToUserMutationArgs {
  userid: string;
  imei: string;
}

export interface EditWhichiMutationArgs {
  imei: string;
  name: string | null;
  pilot: string | null;
  type: string | null;
  usage: string | null;
  status: string | null;
  information: string | null;
  mission: string | null;
  activity: string | null;
  icon: string | null;
  destination: string | null;
  onMap: boolean | null;
  whichigroup: number | null;
  serialNumber: string | null;
  servicePlan: string | null;
}

export interface EditWhichiGroupMutationArgs {
  id: number;
  name: string | null;
  icon: string | null;
  color: string | null;
  manager: string | null;
  pilots: string | null;
}

export interface UpdateRecentestSettingMutationArgs {
  imei: string;
  name: string | null;
  pilot: string | null;
  type: string | null;
  usage: string | null;
  status: string | null;
  information: string | null;
  mission: string | null;
  activity: string | null;
  icon: string | null;
  destination: string | null;
  onMap: boolean | null;
  whichigroup: number | null;
}

export interface AddRxResponse {
  ok: boolean;
  error: string | null;
}

export interface AddRxMessageResponse {
  ok: boolean;
  error: string | null;
}

export interface AddRxReportResponse {
  ok: boolean;
  error: string | null;
}

export interface AddTxDistressResponse {
  ok: boolean;
  error: string | null;
}

export interface AddTxIoPortResponse {
  ok: boolean;
  error: string | null;
}

export interface AddTxMessageResponse {
  ok: boolean;
  error: string | null;
}

export interface AddTxPollResponse {
  ok: boolean;
  error: string | null;
}

export interface AddTxReportResponse {
  ok: boolean;
  error: string | null;
}

export interface AddTxReportSetResponse {
  ok: boolean;
  error: string | null;
}

export interface AddTxReportsIoPortSetResponse {
  ok: boolean;
  error: string | null;
}

export interface AddPlaceResponse {
  ok: boolean;
  error: string | null;
}

export interface DeletePlaceResponse {
  ok: boolean;
  error: string | null;
}

export interface EditPlaceResponse {
  ok: boolean;
  error: string | null;
}

export interface ChangeMyPasswordResponse {
  ok: boolean;
  error: string | null;
}

export interface ChangePasswordByAdminResponse {
  ok: boolean;
  error: string | null;
}

export interface DeleteUserResponse {
  ok: boolean;
  error: string | null;
}

export interface SignInResponse {
  ok: boolean;
  error: string | null;
  token: string | null;
}

export interface SignUpResponse {
  ok: boolean;
  error: string | null;
  token: string | null;
  newUser: User | null;
}

export interface UpdateMyProfileResponse {
  ok: boolean;
  error: string | null;
}

export interface UpdateProfileByAdminResponse {
  ok: boolean;
  error: string | null;
}

export type Upload = any;

export interface SingleFileUploadResponse {
  ok: boolean;
  error: string | null;
  file: File | null;
}

export interface File {
  filename: string | null;
  path: string | null;
  mimetype: string | null;
  encoding: string | null;
}

export interface AddWhichiResponse {
  ok: boolean;
  error: string | null;
  newWhichi: Whichi | null;
}

export interface AddWhichiGroupResponse {
  ok: boolean;
  error: string | null;
  groupid: number | null;
}

export interface AddWhichiToUserResponse {
  ok: boolean;
  error: string | null;
}

export interface DelWhichiGroupResponse {
  ok: boolean;
  error: string | null;
}

export interface DelWhichiToUserResponse {
  ok: boolean;
  error: string | null;
}

export interface EditWhichiResponse {
  ok: boolean;
  error: string | null;
}

export interface EditWhichiGroupResponse {
  ok: boolean;
  error: string | null;
}

export interface UpdateRecentestSettingResponse {
  ok: boolean;
  error: string | null;
}

export interface Verification {
  id: number;
  target: string;
  payload: string;
  key: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string | null;
}
