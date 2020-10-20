import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import {
    ChangePasswordByAdminResponse,
    ChangePasswordByAdminMutationArgs
} from "../../../types/graph";

const resolvers: Resolvers = {
  Mutation: {
    ChangePasswordByAdmin: privateResolver(async (_, args: ChangePasswordByAdminMutationArgs, { req }): Promise<ChangePasswordByAdminResponse> => {
      const user: User = req.user;
      const {userid, newPassword, confirmPassword } = args;
      const myrole = user.role;
      
      try{

        const targetUser = await User.findOne({where: {id: userid}});

        if(targetUser){
            if(myrole == "administrator"){
                
            }else if(myrole == "agent"){
                if(targetUser.role == "customer" || targetUser.role == "asset"){
    
                }else{
                    return {
                        ok: false,
                        error: "no auth to change password",
                    } 
                }
            }else{
                return {
                    ok: false,
                    error: "no auth to change password", 
                }
            }

            
            if(newPassword == confirmPassword){

              targetUser.password = newPassword;
              const passwordUpdateResult = await targetUser.save();
              console.log("passwordUpdateResult=", passwordUpdateResult)
              return {
                ok: true,
                error: null
              }
              
            }else{
              return {
                ok: false,
                error: "failed, check passwords"
              }
            }

        }else{
            return {
                ok: false,
                error: "failed, no mapped userid"
              }

        }

      }catch(err){
        return {
            ok: false,
            error: err,
          };
      }
    })
  }
};
export default resolvers;
