import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import {
    GetChildUsersResponse
} from "../../../types/graph";

const resolvers: Resolvers = {
  Query: {
    GetChildUsers:  privateResolver(async (_, args, { req }): Promise<GetChildUsersResponse> => {
      const { user } = req;
      const userid = args.userid;
      const role = user.role;
      console.log(role)
      try{
        let targetUser = await User.findOne({
            where: {id: userid},
            relations: ['usersAsUser']
          })
        
        
        if(targetUser && targetUser.usersAsUser){
            return {
                ok: true,
                error: null,
                users: targetUser.usersAsUser
              };
      
        }else{
            return {
                ok: false,
                error: "no child user",
                users: null
              };
            
        }
        
      }catch(err){
        return {
            ok: false,
            error: err,
            users: null
          };
      }
    })
  }
};
export default resolvers;
