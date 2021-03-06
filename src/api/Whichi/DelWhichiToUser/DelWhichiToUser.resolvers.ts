
import { DelWhichiToUserMutationArgs, DelWhichiToUserResponse } from "../../../types/graph";
import User from "../../../entities/User";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import Whichi from "../../../entities/Whichi";
import {getConnection} from 'typeorm';


//role administrator, agent, customer, asset
const resolvers: Resolvers = {
  Mutation: {
    DelWhichiToUser: privateResolver(
      async (
        _,
        args: DelWhichiToUserMutationArgs,
        { req }
      ): Promise<DelWhichiToUserResponse> => {
        const user: User = req.user;
        const {userid, imei} = args;

        let userForWhichi  = await User.findOne({where: {userid: userid}})
        let whichi = await Whichi.findOne({where: {imei: imei}});
        if(!userForWhichi || !whichi){
            return {
                ok: false,
                error: "mapped user or whichi not exist"
            }
        }
        if(user.role == "administrator"){

        }else if(user.role == "agent"){
            if(userForWhichi.role != "customer" && userForWhichi.role != "asset"){
                return {
                    ok: false,
                    error: "subuser role is not able to controled by parentuser, parent: agent, sub: " + userForWhichi.role
                }
            }
        }else if(user.role == "customer"){
            if(userForWhichi.role != "asset"){
                return {
                    ok: false,
                    error: "subuser role is not able to controled by parentuser customer, sub: " + userForWhichi.role
                }
            }
        }
        try {
            //const {name, imei} = args;
            
            await getConnection()
            .createQueryBuilder()
            .relation(User, "uwpipe")
            .of(userForWhichi)
            .remove(whichi);

            //user.uwpipe.push(whichi)
            //user.uwpipe.push(whichi);
            await userForWhichi.save();

                 
          //User.create({ ...args }).save();
          
        
          return {
            ok: true,
            error: null
          };
          
        } catch (error) {
          console.log(error)

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
