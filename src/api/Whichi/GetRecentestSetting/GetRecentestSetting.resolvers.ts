
import { GetRecentestSettingQueryArgs, GetRecentestSettingResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import RecentestSetting from "../../../entities/RecentestSetting";

const resolvers: Resolvers = {
  Query: {
    GetRecentestSetting: privateResolver(
      async (_, args: GetRecentestSettingQueryArgs , { req }): Promise<GetRecentestSettingResponse> => {
        try {

          const {imei} =args;
          if(imei){
              const recentestSetting : any = await RecentestSetting.findOne(
              {
                  where : {imei : imei},
                 
              } 
              )
             
                  return {
                    ok: true,
                    error: null,
                    recentestSetting 
                  }
  
          }else{
            
              return {
                ok: false,
                error: "no mapped imei whichi",
                recentestSetting: null
              }

          }
     
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            recentestSetting: null
          };
        }
      }
    )
  }
};
export default resolvers;
