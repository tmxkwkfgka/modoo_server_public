import Whichi from "../../../entities/Whichi";
import { GetMyPlacesResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import { Between } from "typeorm";
import Place from "../../../entities/Place";

const resolvers: Resolvers = {
  Query: {
    GetMyPlaces: privateResolver(
      async (_, args, { req }): Promise<GetMyPlacesResponse> => {
        const {whichiId, from, to} = args;
        try {
          
         
          console.log("from to = ", from ,to )
            const whichi = await Whichi.findOne(
              { id: whichiId }
            );
            //날짜 필터 되어 있으면
            if(from && to){
              console.log("from to datetime", typeof from, to)
              //let matchFrom = from.match(/([12]\d{3}.(0[1-9]|1[0-2]).(0[1-9]|[12]\d|3[01])) ([01][0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9]|)/g)
              //let matchTo = to.match(/([12]\d{3}.(0[1-9]|1[0-2]).(0[1-9]|[12]\d|3[01])) ([01][0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9]|)/g)
              //넘어온 문자열이 date 타입일경우
              //console.log("from to = ", matchFrom[0], matchTo[0])
            
              //if(matchFrom && matchTo && matchFrom[0] && matchTo[0]){
                
               
              if (whichi) {
                const places = await Place.find({
                    where : {
                      imei : whichi.imei, 
                      createdAt: Between(from, to)
                    }
                })
                return {
                  ok: true,
                  places: places,
                  error: null
                };
              }else{
                return {
                  ok: false,
                  places: null,
                  error: "whichi not found"
                };
              }
                
             // }

            }
            
            //날짜가 없을때
            if(whichi){
              const places = await Place.find({
                where : {
                  imei : whichi.imei, 
                
                }
              })

              if (places) {
                return {
                  ok: true,
                  places: places,
                  error: null
                };
  
              }

            }
        
            return {
              ok: false,
              places: null,
              error: "whichi not found"
            };
         
        
      }catch (error) {
          return {
            ok: false,
            error: error.message,
            places: null
          };
        }
      }
    )
  }
};
export default resolvers;
