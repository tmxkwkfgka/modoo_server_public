import User from "../../../entities/User";
import Message from "../../../entities/Message";
import {
    UpdateProfileByAdminMutationArgs,
    UpdateProfileByAdminResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import cleanUndefinedArgs from "../../../utils/cleanUndefinedArgs";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Mutation: {
    UpdateProfileByAdmin: privateResolver(
      async (
        _,
        args: UpdateProfileByAdminMutationArgs,
        { req }
      ): Promise<UpdateProfileByAdminResponse> => {
        const user: User = req.user;
        const notNull: any = cleanUndefinedArgs(args, ["userId"]);
        const userId = args.userId;
        const myrole = user.role;
     
        try {
            const targetUser = await User.findOne({where: {id: userId}, relations: ["uwpipe"]});

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
            }
          
          if(targetUser){
            let previousActivate = targetUser? targetUser.activate : undefined
            await User.update({ id: userId }, { ...notNull });
            if(notNull.activate === false && previousActivate === true){
              let whichiOfTarget = targetUser.role == "asset" && targetUser.uwpipe[0]? targetUser.uwpipe[0] : undefined;
              // 관리자가 활성화된 유저를 비활성화 시킴 로그 남겨야함
              await Message.create({
                kind: "user_inactive",
                message_body: userId.toString(),
                whichi: whichiOfTarget
               
              }).save()
              console.log("user inactive ", )
            }
  
            if(notNull.activate === true && previousActivate === false){
              let whichiOfTarget = targetUser.role == "asset" && targetUser.uwpipe[0]? targetUser.uwpipe[0] : undefined;
              await Message.create({
                kind: "user_active",
                message_body: userId.toString(),
                whichi: whichiOfTarget
              }).save()
              console.log("user activate")
            }
  

          }
    
          return {
            ok: true,
            error: null
          };
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
