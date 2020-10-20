import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";

const resolvers: Resolvers = {
  Query: {
    GetUsers: privateResolver(async (_, args, { req }) => {
      const { user } = req;
      const { wholeTree } = args;

      if(wholeTree && user.role == "administrator"){
        let users = await User.findOne({id: user.id},{relations: [ "usersAsUser","usersAsUser.usersAsUser", "usersAsUser.usersAsUser.parentUser", "issuerUser", "usersAsUser.issuerUser", "usersAsUser.usersAsUser.issuerUser","usersAsUser.uwpipe", "usersAsUser.usersAsUser.uwpipe", "usersAsUser.usersAsUser.uwpipe.whichigroup", "usersAsUser.usersAsUser.usersAsUser", "usersAsUser.usersAsUser.usersAsUser.parentUser", "usersAsUser.usersAsUser.usersAsUser.uwpipe", "usersAsUser.usersAsUser.usersAsUser.uwpipe.whichigroup"]})
        return {
          ok: true,
          error: null,
          users: [users]
        };

      }else if(user.role == "agent"){
        let users = await User.findOne({id: user.id},{relations: ["uwpipe", "usersAsUser", "usersAsUser.parentUser", "usersAsUser.usersAsUser", "usersAsUser.usersAsUser.parentUser", "issuerUser", "usersAsUser.issuerUser", "usersAsUser.usersAsUser.issuerUser","usersAsUser.uwpipe", "usersAsUser.uwpipe.whichigroup", "usersAsUser.usersAsUser.uwpipe", "usersAsUser.usersAsUser.uwpipe.whichigroup"]})
        return {
          ok: true,
          error: null,
          users: [users]
        };

      }else if(user.role == "administrator"){
        let users = await User.find({relations: ["uwpipe", "usersAsUser", "issuerUser"]})
        return {
          ok: true,
          error: null,
          users: users
        };

      }else{
        let users = await User.find({relations: ["issuerUser"] })
        return {
          ok: true,
          error: null,
          users
        };

      }
     
    })
  }
};
export default resolvers;
