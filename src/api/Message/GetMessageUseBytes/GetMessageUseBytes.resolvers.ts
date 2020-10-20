
import { GetMessageUseBytesQueryArgs, GetMessageUseBytesResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
//import { getConnection} from 'typeorm';
import Message from "../../../entities/Message";


//import Whichi from "../../../entities/Whichi";
//import { timeout, TimeoutError } from 'promise-timeout';

const resolvers: Resolvers = {
  Query: {
    GetMessageUseBytes: privateResolver(
      async (
        parent,
        args: GetMessageUseBytesQueryArgs,
        { req, res }
      ): Promise<GetMessageUseBytesResponse> => {
        //const user: User = req.user;
        const {whichiId} = args;
        try {
         // Message.
         let {txSum} = await Message.createQueryBuilder("message")
         .select("SUM(message.payload_length)", "txSum")
         .where("message.whichiId = :whichiId", {whichiId: whichiId})
         .andWhere("message.txrx = :tx", {tx: "tx"})
         .getRawOne()

         let {rxSum} = await Message.createQueryBuilder("message")
         .select("SUM(message.payload_length)", "rxSum")
         .where("message.whichiId = :whichiId", {whichiId: whichiId})
         .andWhere("message.txrx = :rx", {rx: "rx"})
         .getRawOne()
            
         
         console.log("txsum  = ", txSum)


          return {
            ok: true,
            error: null,
            tx:txSum,
            rx:rxSum
          }
            
           
        } catch (error) {
            console.log("erro = ", error)

          return {
            ok: false,
            error: "error.message" + error,
            tx: null,
            rx: null
          };

        }
        
      }
    )
  }
};

export default resolvers;
