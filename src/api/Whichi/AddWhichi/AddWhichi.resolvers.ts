
import { AddWhichiMutationArgs, AddWhichiResponse } from "../../../types/graph";
import User from "../../../entities/User";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import Whichi from "../../../entities/Whichi";
import {getConnection} from 'typeorm';
import cleanUndefinedArgs from "../../../utils/cleanUndefinedArgs"


//role administrator, agent, customer, asset
const resolvers: Resolvers = {
  Mutation: {
    AddWhichi: privateResolver(
      async (
        _,
        args: AddWhichiMutationArgs,
        { req }
      ): Promise<AddWhichiResponse> => {
        const user: User = req.user;
        if(user.role != "administrator" && user.role != "agent"){
            return {
                ok: false,
                error: "not admin",
                newWhichi: null
            };
        }
        try {
            //const {name, imei} = args;

            const cleanedArgu = cleanUndefinedArgs(args, [])
            
            let whichi = await Whichi.create({
                ...cleanedArgu
                
            }).save();

            await getConnection()
            .createQueryBuilder()
            .relation(User, "uwpipe")
            .of(user)
            .add(whichi);

            //user.uwpipe.push(whichi)
            //user.uwpipe.push(whichi);
            await user.save();

                 
          //User.create({ ...args }).save();
          
        
          return {
            ok: true,
            error: null,
            newWhichi: whichi
          };
          
        } catch (error) {
          console.log(error)

          return {
            ok: false,
            error: error.message,
            newWhichi: null
          };

        }
      }
    )
  }
};

export default resolvers;
