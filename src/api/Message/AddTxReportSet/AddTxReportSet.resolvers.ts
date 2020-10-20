
import { AddTxReportSetMutationArgs, AddTxReportSetResponse } from "../../../types/graph";
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
    AddTxReportSet: privateResolver(
      async (
        parent,
        args: AddTxReportSetMutationArgs,
        { req, res }
      ): Promise<AddTxReportSetResponse> => {
        //const user: User = req.user;
        try {
          const {imei, report_masking_bit, period_time, io_masking_bit} = args;

          let payload = "535752" + parseInt(report_masking_bit,2).toString(16).padStart(2,'0') + parseInt(period_time,10).toString(16).padStart(4,'0') + parseInt(io_masking_bit,2).toString(16).padStart(2,'0')
          let msgSend = new SendMessage(imei, payload);
          let whichi = await Whichi.findOne({where: {imei: imei}});
          let timeOut = 5000;

          let report_number = parseInt(report_masking_bit.substr(0,2), 2) + 1;
          let enable = report_masking_bit[2]=="1"? true : false;
          let utc_on = report_masking_bit[3]=="1"? true : false;
          let gps_on = report_masking_bit[4]=="1"? true : false;
          let alt_on = report_masking_bit[5]=="1"? true : false;
          let speed_on = report_masking_bit[6]=="1"? true : false;
          let course_on = report_masking_bit[7]=="1"? true : false;

          let io1_on = io_masking_bit[4]=="1"? true : false;
          let io2_on = io_masking_bit[5]=="1"? true : false;
          let io3_on = io_masking_bit[6]=="1"? true : false;
          let io4_on = io_masking_bit[7]=="1"? true : false;



          let promises: Promise<AddTxReportSetResponse>[]= []

          msgSend.init();

          let eventOnPromise = new Promise<AddTxReportSetResponse>((resolve,reject)=>{
            
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
                  report_number, enable, utc_on, gps_on, alt_on, speed_on, course_on, period_time: parseInt(period_time,10),
                  message: message, io1_on, io2_on, io3_on, io4_on
                }).save()


              ])
              .then((results)=>{
               
                console.log("allpush results = ", results)
                return resolve({
                  ok: true,
                  error: " "
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
        
        
           promises.push(new Promise<AddTxReportSetResponse>((resolve, reject)=>{
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
