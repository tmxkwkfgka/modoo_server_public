
import { EditWhichiGroupMutationArgs, EditWhichiGroupResponse } from "../../../types/graph";
import User from "../../../entities/User";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import cleanUndefinedArgs from "../../../utils/cleanUndefinedArgs"

import WhichiGroup from "../../../entities/WhichiGroup";


//role master, user1, user2, user3
const resolvers: Resolvers = {
  Mutation: {
    EditWhichiGroup: privateResolver(
      async (
        _,
        args: EditWhichiGroupMutationArgs,
        { req }
      ): Promise<EditWhichiGroupResponse> => {
        const user: User = req.user;
       
      
        const whichiGroupId = args.id;

        try{
            //let whichi  = await Whichi.findOne({where: {imei: imei},  relations: ["whichigroup"]})
            
           
            const updateObj = cleanUndefinedArgs(args, ["id"]);

            let updatedWhichiGroup = await WhichiGroup.update({id: whichiGroupId}, updateObj)
            if(updatedWhichiGroup.raw.changedRows > 0){
                return {
                    ok: true,
                    error: null
                }

            }else{
                return {
                    ok: false,
                    error: "no mapped whichigroup, check id"
                }
            }


          
            // if(whichi){
            //   let mappedWhichiGroup = whichi.whichigroup
            //   const updateObj = cleanUndefinedArgs(args, ['imei']);
            //   //let updateWhichis = mappedWhichiGroup.whichi;
            //   updateWhichis.push(whichi);
            //   let updatedWhichiGroup = await WhichiGroup.update({whichi: updateWhichis}, updateObj)
              
            //   console.log(updatedWhichiGroup.raw.changedRows)
            //   if(updatedWhichiGroup.raw.changedRows > 0){
            //       return {
            //           ok: true,
            //           error: null
            //       }

            //   }else{
            //       return {
            //           ok: false,
            //           error: "no mapped imei, check imei"
            //       }
            //   }
            //   return {
            //       ok: true,
            //       error: null
            //   }

            // }else{
            //   return {
            //     ok: false,
            //     error: "no mapped whichi, check imei"
            //   }
            // }
            
        }catch(err){
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
