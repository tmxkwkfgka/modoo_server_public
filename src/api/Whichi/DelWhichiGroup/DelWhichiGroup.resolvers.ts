
import { DelWhichiGroupMutationArgs, DelWhichiGroupResponse } from "../../../types/graph";
import User from "../../../entities/User";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";

import WhichiGroup from "../../../entities/WhichiGroup";
import Whichi from "../../../entities/Whichi";

//role administrator, agent, customer, asset
const resolvers: Resolvers = {
  Mutation: {
    DelWhichiGroup: privateResolver(
      async (
        _,
        args: DelWhichiGroupMutationArgs,
        { req }
      ): Promise<DelWhichiGroupResponse> => {
        const user: User = req.user;
       
        const whichiGroupId = args.whichiGroupId;


        try{
           let whichiGroup = await WhichiGroup.findOne({where:{id: whichiGroupId}})
           
           console.log(whichiGroup)

           if(whichiGroup){
            let updateResult = await Whichi.update({whichigroup: whichiGroup}, {whichigroup: null});
            let result = await WhichiGroup.delete(whichiGroupId);

            console.log("update result = ", updateResult)
            console.log("del result=  ", result)
            //if(result.raw.affected > 0){
            return {
                ok: true,
                error: null
            }
 
            // }else{
            //      return {
            //          ok: false,
            //          error: "no mapped whichigroup"
            //      }
 
            // }

           }else{
            return {
              ok: false,
              error: "no mapped whichigroup"
            }

           }
          
           
        }catch(err){
          console.log("ERR = ", err)
            return {
                ok: false,
                error: err
            }
        }


      }
    )
  }
};

export default resolvers;
