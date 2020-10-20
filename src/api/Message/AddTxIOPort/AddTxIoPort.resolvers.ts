
import { AddTxIoPortMutationArgs, AddTxIoPortResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import Message from "../../../entities/Message";
import Whichi from "../../../entities/Message";
import IO_Port_Status from "../../../entities/IO_Port_Status";
import {SendMessage} from "../../../utils/sendMessageToGw";
import retUn from "../../../utils/retUn";
import {parseConfirmMsg} from "../../../utils/parseConfirmMsg"


const resolvers: Resolvers = {
  Mutation: {
    AddTxIoPort: privateResolver(
      async (
        _,
        args: AddTxIoPortMutationArgs,
        { req }
      ): Promise<AddTxIoPortResponse> => {
        //const user: User = req.user;
        try {
          const {imei, IOPort1_IO_status, IOPort1_out_status, IOPort2_IO_status, IOPort2_out_status, IOPort3_IO_status, IOPort3_out_status, IOPort4_IO_status, IOPort4_out_status} = args;
          let MSB_bit_str = IOPort1_IO_status + "0" + IOPort1_out_status + IOPort2_IO_status + "0" +IOPort2_out_status;
          let LSB_bit_str = IOPort3_IO_status + "0" + IOPort3_out_status+ IOPort4_IO_status + "0" + IOPort4_out_status;
          let timeOut = 5000;
          let payload = "535749" + parseInt(MSB_bit_str,2).toString(16) + parseInt(LSB_bit_str,2).toString(16);
          let msgSend = new SendMessage(imei, payload);
          let whichi = await Whichi.findOne({where: {imei: imei}});
          let promises: Promise<AddTxIoPortResponse>[]= []
          msgSend.init();
          let eventOnPromise = new Promise<AddTxIoPortResponse>((resolve,reject)=>{
            msgSend.on('data', (data)=>{
              console.log("confirm data = ", data);
              
              
              
              Message.create({
                
                kind: "ioport_tx_ask",
                txrx: "tx",
                raw_content: msgSend.raw_content,
                whichi,
                payload_length: payload.length / 2
     
               }).save()
               .then((message)=>{
                 //confirm message 파싱하고 status에 따라 에러 또는 성공메시지 걸러낸다음 리턴함
                 let confirmObj = parseConfirmMsg(message);
  
              

                  return Promise.all([ 
                    IO_Port_Status.create({
                      port_num: 1,
                      out_status: retUn(IOPort1_out_status),
                      io_status: retUn(IOPort1_IO_status),
                      message: message
                    }).save(),
                    IO_Port_Status.create({
                      port_num: 2,
                      out_status: retUn(IOPort2_out_status),
                      io_status: retUn(IOPort2_IO_status),
                      message: message
                    }).save(),
                    IO_Port_Status.create({
                      port_num: 3,
                      out_status: retUn(IOPort3_out_status),
                      io_status: retUn(IOPort3_IO_status),
                      message: message
                    }).save(),
                    IO_Port_Status.create({
                      port_num: 4,
                      out_status: retUn(IOPort4_out_status),
                      io_status: retUn(IOPort4_IO_status),
                      message: message
                    }).save(),
                
                  ]).then((results)=>{
                    if(confirmObj.error == null){
                      message.success = true;
                    }else{
                      message.success = false;
                    }

                    return message.save()
                    .then((res)=>{
                      return resolve({
                        ok: true,
                        error: null
                      })
    
    
    
                    })

                  })

                
                
  
               })
  
  
            })
            
            msgSend.on('error', (err)=>{
              
              return resolve({
                ok: false,
                error: err
              });
  
            })
            msgSend.on('close', (err)=>{
              // return {
              //   ok: true,
              //   error: null
              // };
              
            })

          })
          promises.push(eventOnPromise)

          promises.push(new Promise<AddTxIoPortResponse>((resolve, reject)=>{

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
            error: error.message
          };

        }
      }
    )
  }
};

export default resolvers;
