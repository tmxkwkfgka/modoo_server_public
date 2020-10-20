
import { SingleFileUploadMutationArgs, SingleFileUploadResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
//import {parseConfirmMsg} from "../../../utils/parseConfirmMsg"
import File from "../../../entities/File";
import { createWriteStream } from 'fs';
//import { resolve } from "dns";
import moment from 'moment';
import cleanUndefinedArgs from "../../../utils/cleanUndefinedArgs";
//import { timeout, TimeoutError } from 'promise-timeout';
//const uploadPath = '../../../public/photos'
import Whichi from "../../../entities/Whichi"
import WhichiGroup from "../../../entities/WhichiGroup"
import User from "../../../entities/User"
const path = require("path")


const resolvers: Resolvers = {
  Mutation: {
    SingleFileUpload: privateResolver(
      async (
        parent,
        args: SingleFileUploadMutationArgs,
        { req, res }
      ): Promise<SingleFileUploadResponse> => {
        //const user: User = req.user;
        try {
          const {file, userId, whichiId, whichigroupId} = args;
          const fileObj =  await file;
          const { stream, filename, mimetype, encoding } = fileObj
          const filteredId = cleanUndefinedArgs({userId, whichiId, whichigroupId}, [])

          console.log("files info", filename, mimetype, encoding, fileObj )

          //const readStream = stream();

          const prefix = moment(new Date()).format("YYYYMMDD_hhmmssSSS");
          let savedPath = ""
          savedPath = path.join(__dirname, "..", "..", "..", "..", "public", "photos",`${prefix}-${filename}`)
          console.log(savedPath)
          const uniqueFileName = `${prefix}-${filename}`

          // if(userId){

          // }
          // whichiId: Int
          // whichigroupId: Int
          let targetUser, targetWhichi, targetWhichiGroup
          if(userId){
            targetUser = await User.findOne({id: userId})
          }else if(whichiId){
            targetWhichi = await Whichi.findOne({id: whichiId})
          }else if(whichigroupId){
            targetWhichiGroup = await WhichiGroup.findOne({id: whichigroupId})

          }




          

          const ret =  await new Promise<SingleFileUploadResponse>((resolve, reject) => {
              // 파일을 지정된 path에 저장
              return stream.
              pipe(createWriteStream(savedPath))
              .on('finish', () => { 
                
                  return File.create({
                      prefix,
                      path: savedPath,
                      filename: uniqueFileName,
                      mimetype,
                      encoding,
                      ...filteredId
  
                  }).save().then((createdFile)=>{

                      if(targetUser){

                        targetUser.profilePhoto = uniqueFileName
                        targetUser.save().then((result)=>{
                            resolve({
                              ok: true,
                              error: null,
                              file: createdFile
                          })
                        })

                      }else if(targetWhichi){

                        targetWhichi.profilepicture = uniqueFileName
                        targetWhichi.save().then((result)=>{
                          resolve({
                            ok: true,
                            error: null,
                            file: createdFile
                            })
                          })

                      }else if(targetWhichiGroup){

                        targetWhichiGroup.profilePhoto = uniqueFileName
                        targetWhichiGroup.save().then((result)=>{
                          resolve({
                            ok: true,
                            error: null,
                            file: createdFile
                            })
                        })

                      }else{
                        resolve({
                          ok: false,
                          error: "file saved. but there is no mapped object",
                          file: createdFile
                        })

                      }



                     
                  })
              })
              .on('error', ()=>{ resolve({ok: false, error: "file save error", file: null})}) 
             

             

          })
          return ret;
            // .catch((err)=>{
            //     console.log("file upload promise error", err)
            //     return resolve({
            //         ok: false,
            //         error: err,
            //         file: null
            //     })
            // })
            


          
        } catch (error) {

          console.log("error")

          return {
            ok: false,
            error: error,
            file: null
          };

        }
        
      }
    )
  }
};

export default resolvers;
