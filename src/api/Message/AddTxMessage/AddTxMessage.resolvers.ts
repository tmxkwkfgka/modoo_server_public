
import { AddTxMessageMutationArgs, AddTxMessageResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import Message from "../../../entities/Message";
import Whichi from "../../../entities/Whichi";
//import User from "../../../entities/User";
import {SendMessage} from "../../../utils/sendMessageToGw";
import {parseConfirmMsg} from "../../../utils/parseConfirmMsg"


const resolvers: Resolvers = {
  Mutation: {
    AddTxMessage: privateResolver(
      async (
        parent,
        args: AddTxMessageMutationArgs,
        { req, res }
      ): Promise<AddTxMessageResponse> => {
        // return {
        //   ok:true,
        //   error:null
        // }

        
        //const user: User = req.user;
        try {
          const {message_body, imei} = args;
          
          // need convert engilish or hanguel to hex
          let payload = "4d" + convertToHex(message_body);
          

          let msgSend = new SendMessage(imei, payload);
          let timeOut = 5000;
          let promises: Promise<AddTxMessageResponse>[]= []
          let whichi = await Whichi.findOne({where: {imei: imei}});
          msgSend.init();

          let eventOnPromise = new Promise<AddTxMessageResponse>((resolve,reject)=>{
            
            msgSend.on('data', (data)=>{
            
              let confirmObj = parseConfirmMsg(data);
              console.log("confirm data = ", data, msgSend.raw_content, confirmObj);
              let message = Message.create({
                
                kind: "message_tx",
                txrx: "tx",
                raw_content: msgSend.raw_content,
                message_body,
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
                
                //confirm message 파싱하고 status에 따라 에러 또는 성공메시지 걸러낸다음 리턴함
                  console.log("after message save then ",message)
                  if(whichi){
                    whichi.last_message = message;
                    whichi.save().then((res)=>{
                      return resolve({
                        ok: true,
                        error: " "
                      })
                    });
                  }else{
                    return resolve({
                      ok: true,
                      error: " "
                    })
                  }
                  
                  
              })
              .catch((err)=>{
                console.log("message save err ", err)
                return resolve({
                  ok: false,
                  error: err
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
        
        
           promises.push(new Promise<AddTxMessageResponse>((resolve, reject)=>{
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

function convertToHex(str){
  let ut8_Buffer = Buffer.from(JSON.parse(JSON.stringify(str)));

  return ut8_Buffer.toString('hex');

}
export default resolvers;
