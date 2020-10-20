import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import {
    ChangeMyPasswordResponse,
    ChangeMyPasswordMutationArgs
} from "../../../types/graph";
//import bcrypt from "bcrypt";

//const BCRYPT_ROUNDS = 10;
const resolvers: Resolvers = {
  Mutation: {
    ChangeMyPassword: privateResolver(async (_, args: ChangeMyPasswordMutationArgs, { req }): Promise<ChangeMyPasswordResponse> => {
      const user: User = req.user;
      const {previousPassword, newPassword, confirmPassword } = args;
      //const myrole = user.role;
      
      try{
        //const hashedPassword = await bcrypt.hash(previousPassword, BCRYPT_ROUNDS)
        //console.log("hashed and cur=", hashedPassword, user.password)
        const checkPassword = await user.comparePassword(previousPassword)
        if(checkPassword && newPassword == confirmPassword){
          user.password = newPassword;
          const passwordUpdateResult = await user.save();
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
