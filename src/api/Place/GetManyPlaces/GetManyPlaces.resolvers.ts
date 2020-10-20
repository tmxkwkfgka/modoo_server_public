//import Whichi from "../../../entities/Whichi";
import { GetManyPlacesResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import {   getConnection } from "typeorm";
import Place from "../../../entities/Place";
//import Whichi from "../../../entities/Whichi";

const resolvers: Resolvers = {
  Query: {
    GetManyPlaces: privateResolver(
      async (_, args, { req }): Promise<GetManyPlacesResponse> => {
        const {imeis, from, to} = args;
        try {
          
          console.log("imeis = ", imeis)
            // const whichi = await Whichi.findOne(
            //   { id: whichiId },
            // );
            //날짜 필터 되어 있으면
            if(from && to){
              let matchFrom = from.match(/([12]\d{3}.(0[1-9]|1[0-2]).(0[1-9]|[12]\d|3[01])) ([01][0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9]|)/g)
              let matchTo = from.match(/([12]\d{3}.(0[1-9]|1[0-2]).(0[1-9]|[12]\d|3[01])) ([01][0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9]|)/g)
              //넘어온 문자열이 date 타입일경우
            
              if(matchFrom && matchTo && matchFrom[0] && matchTo[0]){
                let wherein = {}
               

                const places = await getConnection()
                .getRepository(Place)
                .createQueryBuilder("place")
                .where("place.imei In (:imeis)", {imeis: imeis})
                .andWhere("place.createdAt >= :from", {from: from})
                .andWhere("place.createdAt <= :to", {to: to})
                .getMany()

                //console.log("places = ", places)
                let ret: any = []
                imeis.forEach((imei=>ret.push({"imei": imei, "places": []})))
                places.forEach((place)=>{
                  for(let i=0; i<ret.length; i++){
                    if(place.imei == ret[i].imei){
                      ret[i].places.push(place)
                      return;
                    }
                  }
                })
             
                return {
                  ok: true,
                  manyplaces: ret,
                  error: null
                };

                // let whichis: any = await getConnection()
                // .getRepository(Whichi)
                // .createQueryBuilder("whichi")
                // .leftJoinAndSelect("whichi.messages", "message")
                // .leftJoinAndSelect("messages.place", "place")
                // .where("whichi.iemi IN (:imeis)", {imeis: imeis})
                // .andWhere("place.createdAt >= :from", {from: matchFrom[0]})
                // .andWhere("place.createdAt <= :to", {to: matchTo[0]})
                // .getMany();
                // console.log("whichis = ", whichis)
           
                
                
               
              //   if (whichi) {
              //     const places = await Place.find({
              //         where : {
              //           imei : whichi.imei, 
              //           utc: Between(new Date(matchFrom[0]), new Date(matchTo[0]))
              //         }
              //     })
              //     return {
              //       ok: true,
              //       places: places,
              //       error: null
              //     };
              //   }else{
              //     return {
              //       ok: false,
              //       places: null,
              //       error: "whichi not found"
              //     };
              //   }
                
              // }
                  return {
                    ok: false,
                    manyplaces: null,
                    error: "whichi not found"
                  };

            }
          }
            
            //날짜가 없을때
            if(imeis){
              const places = await getConnection()
                .getRepository(Place)
                .createQueryBuilder("place")
                .where("place.imei In (:imeis)", {imeis: imeis})
                .getMany()
              
              let ret: any = []
              imeis.forEach((imei=>ret.push({"imei": imei, "places": []})))
              places.forEach((place)=>{
                for(let i=0; i<ret.length; i++){
                  if(place.imei == ret[i].imei){
                    ret[i].places.push(place)
                    return;
                  }
                }
              })

              if (places && places.length > 0) {
                return {
                  ok: true,
                  manyplaces: ret,
                  error: null
                };
  
              }

            }
        
            return {
              ok: false,
              manyplaces: null,
              error: "whichi not found"
            };
         
       
      }catch (error) {
          return {
            ok: false,
            error: error.message,
            manyplaces: null
          };
        }
      }
    )
  }
};
export default resolvers;
