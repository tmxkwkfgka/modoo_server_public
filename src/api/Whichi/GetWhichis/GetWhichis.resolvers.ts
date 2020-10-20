
import { GetWhichisResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import Whichi from "../../../entities/Whichi";

const resolvers: Resolvers = {
  Query: {
    GetWhichis: privateResolver(
      async (_, args, { req }): Promise<GetWhichisResponse> => {
        try {

          const {imei} =args;
          if(imei != null){
              const whichi : any = await Whichi.find(
              {
                  where : {imei : imei},
                  relations: ["last_position", "last_message", "whichigroup", "messages", "messages.place"]
              } 
              )
             
                  return {
                    ok: true,
                    error: null,
                    whichis: whichi 
                }
  
          }else{
              const whichis: any = await Whichi.find(  {
                relations: ["last_position", "last_message", "whichigroup", "messages", "messages.place"]
            } );
              return {
                ok: true,
                error: null,
                whichis: whichis
              }

          }
     
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            whichis: null
          };
        }
      }
    )
  }
};
export default resolvers;
