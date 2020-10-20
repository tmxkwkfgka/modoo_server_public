import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";

const resolvers: Resolvers = {
  Query: {
    GetMyProfile: privateResolver(async (_, __, { req }) => {
      const { user } = req;
      let userWithIssuer  = await User.findOne({
        where: {id: user.id},
        relations: ['usersAsUser', "usersMade", "issuerUser", "parentUser"] 
       })
      return {
        ok: true,
        error: null,
        user: userWithIssuer
      };
    })
  }
};
export default resolvers;
