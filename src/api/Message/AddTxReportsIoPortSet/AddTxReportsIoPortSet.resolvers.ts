
import { AddTxReportsIoPortSetMutationArgs, AddTxReportsIoPortSetResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import Message from "../../../entities/Message";
import Report_Setting from "../../../entities/Report_Setting";
import {SendMessage} from "../../../utils/sendMessageToGw";
import {parseConfirmMsg} from "../../../utils/parseConfirmMsg"
import Whichi from "../../../entities/Whichi";
//import { timeout, TimeoutError } from 'promise-timeout';

const resolvers: Resolvers = {
  Mutation: {
    AddTxReportsIoPortSet: privateResolver(
      async (
        parent,
        args: AddTxReportsIoPortSetMutationArgs,
        { req, res }
      ): Promise<AddTxReportsIoPortSetResponse> => {
        //const user: User = req.user;
        try {
          const {imei, report_masking_bit_1, period_time_1, io_masking_bit_1, report_masking_bit_2, period_time_2, io_masking_bit_2, report_masking_bit_3, period_time_3, io_masking_bit_3, report_masking_bit_4, period_time_4, io_masking_bit_4, IOPort1_IO_status, IOPort1_out_status, IOPort2_IO_status, IOPort2_out_status, IOPort3_IO_status, IOPort3_out_status, IOPort4_IO_status, IOPort4_out_status} = args;

          let MSB_bit_str = IOPort1_IO_status + "0" + IOPort1_out_status + IOPort2_IO_status + "0" +IOPort2_out_status;
          let LSB_bit_str = IOPort3_IO_status + "0" + IOPort3_out_status+ IOPort4_IO_status + "0" + IOPort4_out_status;

          let payload = "5357" + parseInt(report_masking_bit_1,2).toString(16).padStart(2,'0') + parseInt(period_time_1,10).toString(16).padStart(4,'0') + parseInt(io_masking_bit_1,2).toString(16).padStart(2,'0') + 
          parseInt(report_masking_bit_2,2).toString(16).padStart(2,'0') + parseInt(period_time_2,10).toString(16).padStart(4,'0') + parseInt(io_masking_bit_2,2).toString(16).padStart(2,'0')+
          parseInt(report_masking_bit_3,2).toString(16).padStart(2,'0') + parseInt(period_time_3,10).toString(16).padStart(4,'0') + parseInt(io_masking_bit_3, 2).toString(16).padStart(2,'0')+
          parseInt(report_masking_bit_4, 2).toString(16).padStart(2,'0') + parseInt(period_time_4,10).toString(16).padStart(4,'0') + parseInt(io_masking_bit_4, 2).toString(16).padStart(2,'0')+
          parseInt(MSB_bit_str,2).toString(16) + parseInt(LSB_bit_str,2).toString(16);

          let msgSend = new SendMessage(imei, payload);
          let whichi = await Whichi.findOne({where: {imei: imei}});
          let timeOut = 5000;

          //let report_number = parseInt(report_masking_bit.substr(0,2), 2);
          let enable_1 = report_masking_bit_1[2]=="1"? true : false;
          let utc_on_1 = report_masking_bit_1[3]=="1"? true : false;
          let gps_on_1 = report_masking_bit_1[4]=="1"? true : false;
          let alt_on_1 = report_masking_bit_1[5]=="1"? true : false;
          let speed_on_1 = report_masking_bit_1[6]=="1"? true : false;
          let course_on_1 = report_masking_bit_1[7]=="1"? true : false;

          let io1_on_1 = io_masking_bit_1[4]=="1"? true : false;
          let io2_on_1 = io_masking_bit_1[5]=="1"? true : false;
          let io3_on_1 = io_masking_bit_1[6]=="1"? true : false;
          let io4_on_1 = io_masking_bit_1[7]=="1"? true : false;

          let enable_2 = report_masking_bit_2[2]=="1"? true : false;
          let utc_on_2 = report_masking_bit_2[3]=="1"? true : false;
          let gps_on_2 = report_masking_bit_2[4]=="1"? true : false;
          let alt_on_2 = report_masking_bit_2[5]=="1"? true : false;
          let speed_on_2 = report_masking_bit_2[6]=="1"? true : false;
          let course_on_2 = report_masking_bit_2[7]=="1"? true : false;

          let io1_on_2 = io_masking_bit_2[4]=="1"? true : false;
          let io2_on_2 = io_masking_bit_2[5]=="1"? true : false;
          let io3_on_2 = io_masking_bit_2[6]=="1"? true : false;
          let io4_on_2 = io_masking_bit_2[7]=="1"? true : false;

          let enable_3 = report_masking_bit_3[2]=="1"? true : false;
          let utc_on_3 = report_masking_bit_3[3]=="1"? true : false;
          let gps_on_3 = report_masking_bit_3[4]=="1"? true : false;
          let alt_on_3 = report_masking_bit_3[5]=="1"? true : false;
          let speed_on_3 = report_masking_bit_3[6]=="1"? true : false;
          let course_on_3 = report_masking_bit_3[7]=="1"? true : false;

          let io1_on_3 = io_masking_bit_3[4]=="1"? true : false;
          let io2_on_3 = io_masking_bit_3[5]=="1"? true : false;
          let io3_on_3 = io_masking_bit_3[6]=="1"? true : false;
          let io4_on_3 = io_masking_bit_3[7]=="1"? true : false;


          let enable_4 = report_masking_bit_4[2]=="1"? true : false;
          let utc_on_4 = report_masking_bit_4[3]=="1"? true : false;
          let gps_on_4 = report_masking_bit_4[4]=="1"? true : false;
          let alt_on_4 = report_masking_bit_4[5]=="1"? true : false;
          let speed_on_4 = report_masking_bit_4[6]=="1"? true : false;
          let course_on_4 = report_masking_bit_4[7]=="1"? true : false;

          let io1_on_4 = io_masking_bit_4[4]=="1"? true : false;
          let io2_on_4 = io_masking_bit_4[5]=="1"? true : false;
          let io3_on_4 = io_masking_bit_4[6]=="1"? true : false;
          let io4_on_4 = io_masking_bit_4[7]=="1"? true : false;



          let promises: Promise<AddTxReportsIoPortSetResponse>[]= []

          msgSend.init();

          let eventOnPromise = new Promise<AddTxReportsIoPortSetResponse>((resolve,reject)=>{
            
            msgSend.on('data', (data)=>{
            
            
            
              let confirmObj = parseConfirmMsg(data);
              console.log("confirm data = ", data, msgSend.raw_content, confirmObj);
              Message.create({
                
                kind: "report_tx_set",
                txrx: "tx",
                raw_content: msgSend.raw_content,
                whichi,
                payload_length: payload.length / 2
     
              }).save()
              .then((message)=>{
                 if(confirmObj.error == null){
                  message.success = true;
              }else{
                  message.success = false;
              }
              //let ioports : IO_Port_Status[] = []
              Promise.all([
                Report_Setting.create({
                  report_number: 1, enable: enable_1, utc_on: utc_on_1, gps_on: gps_on_1, alt_on: alt_on_1, speed_on: speed_on_1, course_on: course_on_1, period_time: parseInt(period_time_1,10),
                  message: message, io1_on: io1_on_1, io2_on: io2_on_1, io3_on: io3_on_1, io4_on: io4_on_1
                }).save(),
                Report_Setting.create({
                    report_number: 2, enable: enable_2, utc_on: utc_on_2, gps_on: gps_on_2, alt_on: alt_on_2, speed_on: speed_on_2, course_on: course_on_2, period_time: parseInt(period_time_2,10),
                    message: message, io1_on: io1_on_2, io2_on: io2_on_2, io3_on: io3_on_2, io4_on: io4_on_2
                }).save(),
                Report_Setting.create({
                    report_number: 3, enable: enable_3, utc_on: utc_on_3, gps_on: gps_on_3, alt_on: alt_on_3, speed_on: speed_on_3, course_on: course_on_3, period_time: parseInt(period_time_3,10),
                    message: message, io1_on: io1_on_3, io2_on: io2_on_3, io3_on: io3_on_3, io4_on: io4_on_3
                }).save(),
                Report_Setting.create({
                    report_number: 4, enable: enable_4, utc_on: utc_on_4, gps_on: gps_on_4, alt_on: alt_on_4, speed_on: speed_on_4, course_on: course_on_4, period_time: parseInt(period_time_4,10),
                    message: message, io1_on: io1_on_4, io2_on: io2_on_4, io3_on: io3_on_4, io4_on: io4_on_4
                }).save(),
            
              ])
              .then((results)=>{
               
                console.log("allpush results = ", results)
                return resolve({
                  ok: true,
                  error: null
                })
                //message.reports.push(report_setting);
                
               
              })
               .catch((err)=>{
                 console.log(err)
                return resolve({
                  ok: false,
                  error: "error" + err
                })
                
              })
            

              })
             
            
          
  
            })
            
            msgSend.on('error', (err)=>{
              console.log("socket error", err);
              return resolve({
                ok: false,
                error: "error"
              });
  
            })
            msgSend.on('close', (err)=>{
              // return {
              //   ok: true,
              //   error: null
              // };
              console.log("close");
              
            })
            
       

          })

          promises.push(eventOnPromise)
    
        
          //delay_return(timeOut);
        
        
           promises.push(new Promise<AddTxReportsIoPortSetResponse>((resolve, reject)=>{
              setTimeout(()=>{
                resolve({
                  ok: false,
                  error: "timeout"
                })
              }, timeOut)
            })
           )

           return Promise.race(promises)
           .then((res)=>{
             return res;
           })
        
          
        } catch (error) {

          return {
            ok: false,
            error: "error.message"
          };

        }
        
      }
    )
  }
};

export default resolvers;
