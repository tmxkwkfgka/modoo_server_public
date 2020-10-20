//import Place from "../../../entities/Place";
import User from "../../../entities/User";
import { UpdateRecentestSettingMutationArgs, UpdateRecentestSettingResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
//import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";
//import cleanUndefinedArgs from "../../../utils/cleanUndefinedArgs";
//import Whichi from "../../../entities/Whichi";

//import WhichiGroup from "../../../entities/WhichiGroup";
//import {getConnection} from 'typeorm'

const resolvers: Resolvers = {
  Mutation: {
    UpdateRecentestSetting: privateResolver(
      async (
        _,
        args: UpdateRecentestSettingMutationArgs,
        { req }
      ): Promise<UpdateRecentestSettingResponse> => {
        const user: User = req.user;
        try {
            return {
                ok: true,
                error: null
            }
                
            
            // const imei = args.imei;
            // const groupId = args.whichigroup;
            // const updatedObj = cleanUndefinedArgs(args, ['imei', 'whichigroup']);
            // console.log("groupid = ", groupId)
            // if(groupId === null){
            //   console.log("when groupid is null", groupId)
            //   updatedObj["whichigroup"] = null
            // }else if(groupId === undefined){
            //   console.log("updatedObj = ", updatedObj)
            // }else{
            //   const whichiGroup = await WhichiGroup.findOne({id: groupId})
            //   console.log("whichi group = ", whichiGroup)
            //   if(whichiGroup){
            //     updatedObj["whichigroup"] = whichiGroup
            //   }else{
            //     return {
            //       ok: false,
            //       error: "no mapped whichigroup id, check whichigroup id"
            //     }
            //   }
            // }
            
            // let updatedWhichi = await Whichi.update({imei: imei}, updatedObj)
            // console.log(updatedWhichi.raw.changedRows)
            // if(updatedWhichi.raw.changedRows > 0){
            //     return {
            //         ok: true,
            //         error: null
            //     }

            // }else{
            //     return {
            //         ok: false,
            //         error: "no mapped imei, check imei"
            //     }
            // }

            
        
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
