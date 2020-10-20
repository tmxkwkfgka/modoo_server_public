import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import Whichi from "../../../entities/Whichi";
import {
    CheckUserSameFieldQueryArgs,
    CheckUserSameFieldResponse
  } from "../../../types/graph";

const resolvers: Resolvers = {
  Query: {
    CheckUserSameField: privateResolver(async (_, args: CheckUserSameFieldQueryArgs, { req }):  Promise<CheckUserSameFieldResponse> => {
      //const { user } = req;
      //const { role } = args;

      try{
          const { userid, nickname, imei } = args;
          if(userid){
            const checkUser = await User.findOne({userid: userid})
            if(checkUser){
                return {
                    ok: true,
                    error: null,
                    has: true
                }
            }else{
                return {
                    ok: true,
                    error: null,
                    has: false
                }

            }
          }

          if(nickname){
            let checkUser = await User.findOne({nickname: nickname})
            if(checkUser){
                return {
                    ok: true,
                    error: null,
                    has: true
                }
            }else{
                return {
                    ok: true,
                    error: null,
                    has: false
                }

            }

          }
          if(imei){
            const checkWhichi = await Whichi.findOne({imei: imei})
            if(checkWhichi){
                return {
                    ok: true,
                    error: null,
                    has: true
                }
            }else{
                return {
                    ok: true,
                    error: null,
                    has: false
                }

            }

          }

          return {
              ok: false,
              error: "invalid arguments",
              has: null
          }


      }catch(err){
        return {
            ok: false,
            error: err,
            has: null
        }

      }
     
    })
  }
};
export default resolvers;
