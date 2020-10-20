
import { GetMyWhichiGroupsResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";

import WhichiGroup from "../../../entities/WhichiGroup";

const resolvers: Resolvers = {
  Query: {
    GetMyWhichiGroups: privateResolver(
      async (_, args, { req }): Promise<GetMyWhichiGroupsResponse> => {
        const user = req.user
        try {

          if(user){
            const whichigroups : any = await WhichiGroup.find(
                {
                    where : {createdBy : user},        
                } 
            )
            return {
                ok: true,
                error: null,
                whichigroups
              };
          }
          return {
            ok: false,
            error: "no user",
            whichigroups: null
          };
     
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            whichigroups: null
          };
        }
      }
    )
  }
};
export default resolvers;
