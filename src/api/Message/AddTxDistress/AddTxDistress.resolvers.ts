
import { AddTxDistressMutationArgs, AddTxDistressResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import Message from "../../../entities/Message";
import {SendMessage} from "../../../utils/sendMessageToGw";
import {parseConfirmMsg} from "../../../utils/parseConfirmMsg"
import Whichi from "../../../entities/Whichi";
//import { timeout, TimeoutError } from 'promise-timeout';




const resolvers: Resolvers = {
  Mutation: {
    AddTxDistress: privateResolver(
      async (
        parent,
        args: AddTxDistressMutationArgs,
        { req, res }
      ): Promise<AddTxDistressResponse> => {
        //const user: User = req.user;
        try {
          const {imei, on} = args;
          

          let payload = "44" + on;
          let msgSend = new SendMessage(imei, payload);
          let timeOut = 5000;
          let whichi = await Whichi.findOne({where: {imei: imei}});
          let promises: Promise<AddTxDistressResponse>[]= []

          msgSend.init();

          let eventOnPromise = new Promise<AddTxDistressResponse>((resolve,reject)=>{
            
            msgSend.on('data', (data)=>{
            
            
            
              let confirmObj = parseConfirmMsg(data);
              console.log("confirm data = ", data, msgSend.raw_content, confirmObj);
              let message = Message.create({
                
                kind: "distress_tx_set",
                txrx: "tx",
                raw_content: msgSend.raw_content,
                whichi,
                payload_length: payload.length / 2
     
              })
              if(confirmObj.error == null){
                  message.success = true;
              }else{
                  message.success = false;
              }
              
              
          
              return message.save()
              .then((message)=>{
                console.log("after message save then ",message)
                //confirm message 파싱하고 status에 따라 에러 또는 성공메시지 걸러낸다음 리턴함
                // distress on이면 status를 distress로 바꾸고 off이면 active로 바꿈
                if(whichi){
                  // if(on == "01")
                  //   whichi.status = "distress";
                  // else if(on == "00")
                  //   whichi.status = "active";

                  whichi.save()
                  .then((updateResult)=>{
                    return resolve({
                      ok: true,
                      error: null
                    })

                  }).catch((err)=>{
                    return resolve({
                      ok: false,
                      error: err
                    })

                  })

                }else{
                  return resolve({
                    ok: false,
                    error: "no mapped whichi"
                  })

                }
                  
              
                  
               
              })
              .catch((err)=>{
                return resolve({
                  ok: false,
                  error: "error"
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
        
        
           promises.push(new Promise<AddTxDistressResponse>((resolve, reject)=>{
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
