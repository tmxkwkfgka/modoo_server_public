
import { AddWhichiGroupMutationArgs, AddWhichiGroupResponse } from "../../../types/graph";
import User from "../../../entities/User";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import cleanUndefinedArgs from "../../../utils/cleanUndefinedArgs"
import WhichiGroup from "../../../entities/WhichiGroup";


//role administrator, agent, customer, asset
//add whichi group, imei 
const resolvers: Resolvers = {
  Mutation: {
    AddWhichiGroup: privateResolver(
      async (
        _,
        args: AddWhichiGroupMutationArgs,
        { req }
      ): Promise<AddWhichiGroupResponse> => {
        const user: User = req.user;
       
      

        try{
           
          if(user){
            const createObj = cleanUndefinedArgs(args, ['imei']);
            let whichigroup = await WhichiGroup.create({...createObj, createdBy: user}).save()
            return {
                ok: true,
                error: null,
                groupid: whichigroup.id
            }

          }
          return {
            ok: false,
            error: "no user",
            groupid: null
        }


            
        }catch(err){
            return {
                ok: false,
                error: err,
                groupid: null
            }
        }


      }
    )
  }
};

export default resolvers;
