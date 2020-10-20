
import { GetMessagesQueryArgs, GetMessagesResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import { getConnection} from 'typeorm';
import Message from "../../../entities/Message";
import addingJoin from "../../../utils/addingJoin";
import addingWhere from "../../../utils/addingWhere";
import Whichi from "../../../entities/Whichi";
//import { timeout, TimeoutError } from 'promise-timeout';
const moment = require('moment')



const resolvers: Resolvers = {
  Query: {
    GetMessages: privateResolver(
      async (
        parent,
        args: GetMessagesQueryArgs,
        { req, res }
      ): Promise<GetMessagesResponse> => {
        //const user: User = req.user;
        try {
            let mappedArr : [[string, string]] | any = [];

            const {txrx, kind, whichiIds, imeis, place, report_setting, io_port_status, from, to} = args;
            if(report_setting){
                mappedArr.push(["message.reports","report__setting"])
            }
            if(io_port_status){
                mappedArr.push(["message.ips", "io__port__status"])
            }
            if(place){
                mappedArr.push(["message.place", "place"])
            }
            let mappedArrWhere: any = []
            if(txrx){
                mappedArrWhere.push(['message.txrx = :txrx', {txrx: txrx}])
            }
            if(kind){
                mappedArrWhere.push(['message.kind IN(:kind)', {kind: kind}])
            }
            if(whichiIds){
                mappedArrWhere.push(['message.whichiId IN(:whichiIds)', {whichiIds: whichiIds}])
            }
            if(imeis){
              let whichis = await getConnection()
              .getRepository(Whichi)
              .createQueryBuilder("whichi")
              .where("whichi.imei IN(:imeis)", {imeis: imeis})
              .getMany()

              let whichiids = whichis.map((whichi)=>whichi.id);
              
              mappedArrWhere.push(['message.whichiId IN(:whichiIds)', {whichiIds: whichiids}])
            }

            console.log(mappedArr)
            console.log(mappedArrWhere)


            let result : any = await getConnection()
            .getRepository(Message)
            .createQueryBuilder("message")

            
            result = addingJoin(result, mappedArr)
            result = addingWhere(result, mappedArrWhere)
            console.log("from to  =", from, to)
            if(from && to){
              // let matchFrom = from.match(/([12]\d{3}.(0[1-9]|1[0-2]).(0[1-9]|[12]\d|3[01])) ([01][0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9]|)/g)
              // let matchTo = from.match(/([12]\d{3}.(0[1-9]|1[0-2]).(0[1-9]|[12]\d|3[01])) ([01][0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9]|)/g)
         
            const fromStr = moment(from).format('YYYY.MM.DD')
            const toStr = moment(new Date(moment(to).year(), moment(to).month(), moment(to).date(), 23, 59, 59)).format('YYYY.MM.DD HH:mm:ss');
            console.log("from to sr = ", fromStr, toStr)
              result
              .andWhere("message.createdAt >= :from", {from: fromStr})
              .andWhere("message.createdAt <= :to", {to:toStr})
              
            }
            // from to  = 2019-01-02T00:00:00.000Z 2019-01-15T00:00:00.000Z
            // from to sr =  2019.01.02 09:00:00 2019.01.15 09:00:00

            result = await result.getMany();

            // .leftJoinAndSelect("message.reports", "report__setting")
            // .leftJoinAndSelect("message.ips", "io__port__status")
            // .leftJoinAndSelect("message.place", "place")
            //.where("user.id IN(:userId)", {userId: user.id})
            //.getMany()

            console.log("result = ", result)

            return {
                ok: true,
                error: null,
                messages: result
              };
           
        } catch (error) {
            console.log("erro = ", error)

          return {
            ok: false,
            error: "error.message",
            messages: null
          };

        }
        
      }
    )
  }
};

export default resolvers;
