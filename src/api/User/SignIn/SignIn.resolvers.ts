import User from "../../../entities/User";
import {
  SignInMutationArgs,
  SignInResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import createJWT from "../../../utils/createJWT";

const resolvers: Resolvers = {
  Mutation: {
   SignIn: async (
      _,
      args: SignInMutationArgs
    ): Promise<SignInResponse> => {
      const { userid, password } = args;
      try {
        const user = await User.findOne({ userid });
        if (!user) {
          return {
            ok: false,
            error: "No user found with that email",
            token: null
          };
        }
        const checkPassword = await user.comparePassword(password);
        if (checkPassword) {
          const token = createJWT(user.id);
          return {
            ok: true,
            error: null,
            token
          };
        } else {
          return {
            ok: false,
            error: "Wrong password",
            token: null
          };
        }
      } catch (error) {
        console.log(error)
        return {
          ok: false,
          error: error,
          token: null
        };
      }
    }
  }
};
export default resolvers;
