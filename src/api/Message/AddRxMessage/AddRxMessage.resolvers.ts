
import { AddRxMessageMutationArgs, AddRxMessageResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import Message from "../../../entities/Message";


const resolvers: Resolvers = {
  Mutation: {
    AddRxMessage: privateResolver(
      async (
        _,
        args: AddRxMessageMutationArgs,
        { req }
      ): Promise<AddRxMessageResponse> => {
        //const user: User = req.user;
        try {
         
          await Message.create({
            ...args,
            kind: "message_rx",
            txrx: "rx"
 
           }).save();
        
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
