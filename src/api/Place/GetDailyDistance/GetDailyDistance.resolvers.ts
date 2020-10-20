import Whichi from "../../../entities/Whichi";
import { GetDailyDistanceResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import { Between } from "typeorm";
import Place from "../../../entities/Place";
const moment = require('moment')

const resolvers: Resolvers = {
  Query: {
    GetDailyDistance: privateResolver(
      async (_, args, { req }): Promise<GetDailyDistanceResponse> => {
        const {whichiId, from, to} = args;
        try {
          
         
            const whichi = await Whichi.findOne(
              { id: whichiId }
            );
            console.log("from to datetime", typeof from, to)
            //날짜 필터 되어 있으면
            if(from && to){
              console.log("from to datetime", typeof from, to)
              //let matchFrom = from.match(/([12]\d{3}.(0[1-9]|1[0-2]).(0[1-9]|[12]\d|3[01])) ([01][0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9]|)/g)
              //let matchTo = to.match(/([12]\d{3}.(0[1-9]|1[0-2]).(0[1-9]|[12]\d|3[01])) ([01][0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9]|)/g)
              //넘어온 문자열이 date 타입일경우
              //console.log("from to = ", matchFrom[0], matchTo[0])
            
              //if(matchFrom && matchTo && matchFrom[0] && matchTo[0]){
              const fromStr = moment(from).format('YYYY.MM.DD')
              const toStr = moment(new Date(moment(to).year(), moment(to).month(), moment(to).date(), 23, 59, 59)).format('YYYY.MM.DD HH:mm:ss');
               
              if (whichi) {
                const places = await Place.find({
                    where : {
                      imei : whichi.imei, 
                      createdAt: Between(fromStr, toStr)
                    }
                })

                let resultArr : any = []
    
                
                let descArr =  places.sort((a,b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                // 유효한 위도경도 값을 가진 place만 배열에저장
                descArr = descArr.filter((place)=>{
                  return ((-90 <= place.lat) && (place.lat <= 90)) && ((-180 <= place.lng) && (place.lng <= 180))
                })
                let sumDisKm = 0;
                let sumDisFeet = 0;
                let sumDisKnot = 0;
                let sumSpeed = 0;
                let speedIndex = 0;
                console.log("desc arr  = ", descArr)
                for(let i=0; i<descArr.length-1; i++){
                    let first = new Date(descArr[i].createdAt)
                    let second = new Date(descArr[i+1].createdAt)
                    let diskm: any = distance(descArr[i].lat, descArr[i].lng, descArr[i+1].lat, descArr[i+1].lng, 'K').toFixed(2)
                    let disfeet: any = distance(descArr[i].lat, descArr[i].lng, descArr[i+1].lat, descArr[i+1].lng, 'F').toFixed(2)
                    let disknot: any = distance(descArr[i].lat, descArr[i].lng, descArr[i+1].lat, descArr[i+1].lng, 'N').toFixed(2)
                    let speed: any = descArr[i].speed? descArr[i].speed : 0;
                    if(first.getFullYear() == second.getFullYear() && first.getMonth() == second.getMonth() && first.getDate() == second.getDate() && (i+1 != descArr.length-1)){
                      // 같은 날이면
                      sumDisKm += diskm*1
                      sumDisFeet += disfeet*1
                      sumDisKnot += disknot*1
                      sumSpeed += speed
                    }else{
                      // 같은날이 아니면 array에 push하고 sum값은 초기화
                        console.log(sumDisKm.toFixed(2), first)
                        resultArr.push({
                          km: sumDisKm,
                          feet: sumDisFeet,
                          knot: sumDisKnot,
                          speed: sumSpeed / (i-speedIndex+1),
                          date: moment(first).format('YYYY-MM-DD'),

                        })
                        sumDisKm = 0;
                        sumDisFeet = 0;
                        sumDisKnot = 0;
                        speedIndex = i+1;
                        sumSpeed = 0;
                    }

                  
                }
                
                // return res.json({
                //   descArr
                // })
                // const fields = ['date', 'km', 'feet', 'knot'];
                // const opts = { fields };

                // const parser = new Parser(opts)
                // const csv = parser.parse(resultArr);
              
                let kmsum = 0;
                let feetsum = 0;
                let knotsum = 0;
                let speedsum = 0;
                //let arrlen = resultArr.length;
                resultArr.forEach((ob)=>{
            
                  kmsum += ob.km;
                  feetsum += ob.feet;
                  knotsum += ob.knot;
                  speedsum += ob.speed;
                })
                
                return {
                    ok: true,
                    error: null,
                    resultArr,
                    kmsum,
                    feetsum,
                    knotsum,
                    speedavg: speedsum / descArr.length
                  };
              }else{
                return {
                  ok: false,
                  resultArr: null,
                  kmsum: null,
                  feetsum: null,
                  knotsum: null,
                  speedavg: null,
                  error: "whichi not found"
                };
              }
                
             // }
            }
          
            return {
              ok: false,
              resultArr: null,
              kmsum: null,
              feetsum: null,
              knotsum: null,
              speedavg: null,
              error: "invalid argument"
            };
         
        
      }catch (error) {
          return {
            ok: false,
            resultArr: null,
            kmsum: null,
            feetsum: null,
            knotsum: null,
            speedavg: null,
            error
          };
        }


      }
    )
  }
};

function distance(lat1, lon1, lat2, lon2, unit) {
  if (((lat1 == lat2) && (lon1 == lon2)) || !(lat1 &&  lon1 && lat2 && lon2)) {
    return 0;
  }
  else {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    if (unit=="F") { dist = dist * 5280.00016896}
    return dist;
  }
}

export default resolvers;
