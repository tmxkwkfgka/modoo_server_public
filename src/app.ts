import cors from "cors";
import { NextFunction, Response } from "express";
import { GraphQLServer, PubSub } from "graphql-yoga";
import helmet from "helmet";
import logger from "morgan";
import schema from "./schema";
import decodeJWT from "./utils/decodeJWT";
import {request} from 'graphql-request'
//const encoding = require("encoding")
const { Parser } = require('json2csv');
const moment = require('moment')
const path = require('path')
const express = require('express')


const getWhichiQuery = 
`
    query GetWhichi(
        $imei: String!
    ){
        GetWhichis(
            imei: $imei
              
          ){
            ok
            error
            whichis{
              id
              whichigroup{
                name
                
              }
              messages{
                place{
                  lat
                  alt
                  lng
                  speed
                  course
                  createdAt
                  
                }
                
              }
            }
            
          }

    }
`
const GetMessages = 
`
    query GetMessages(
      $whichiIds: [Int], $kind: [String], $from: Date, $to: Date, $place: Boolean, $io_port_status: Boolean
    ){

     
      GetMessages(
            whichiIds:$whichiIds
            kind: $kind
            from: $from
            to: $to
            place: $place
            io_port_status: $io_port_status
          ) {
              ok
              error
              messages {
                id
                createdAt
                kind
                place{
                  utc
                  lat
                  lng
                  alt
                  speed
                  course
                }
                ips {
                  id
                  port_num
                  out_status
                  io_status
                  ADC
                }
              }
          }
    
      
    }
`

const GetDailyDistance = 
`
  query GetDailyDistance(
    $whichiId: Int!,
    $from: Date,
    $to: Date
  ){

    GetDailyDistance(
      whichiId: $whichiId,
      from: $from,
      to: $to,
      
    ){
      ok
      error
      resultArr{
        km
        feet
        knot
        speed
        date
        
      }
      kmsum
      feetsum
      knotsum
      speedavg
    }
  

  }
  

`

class App {
  public app: GraphQLServer;
  public pubSub: any;
  constructor() {
    this.pubSub = new PubSub();
    this.pubSub.ee.setMaxListeners(99);
    this.app = new GraphQLServer({
      schema,
      context: req => {
        const { connection: { context = null } = {} } = req;
        return {
          res: req.response,
          req: req.request,
          pubSub: this.pubSub,
          context
        };
      }
    });
    this.middlewares();
    this.restApi();

  }
  private middlewares = (): void => {
    this.app.express.use(cors());
    this.app.express.use(logger("dev"));
    this.app.express.use(helmet());
    this.app.express.use(this.jwt);
    this.app.express.use(express.static(path.join(__dirname, "..", "public")))
    console.log("join path = ", path.join(__dirname, "..", "public"))

  };

  // this.app.express.use("/gdgd", (req,res)=>{

  // })

  // private distance(lat1, lon1, lat2, lon2, unit) {
  //   if ((lat1 == lat2) && (lon1 == lon2)) {
  //     return 0;
  //   }
  //   else {
  //     var radlat1 = Math.PI * lat1/180;
  //     var radlat2 = Math.PI * lat2/180;
  //     var theta = lon1-lon2;
  //     var radtheta = Math.PI * theta/180;
  //     var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  //     if (dist > 1) {
  //       dist = 1;
  //     }
  //     dist = Math.acos(dist);
  //     dist = dist * 180/Math.PI;
  //     dist = dist * 60 * 1.1515;
  //     if (unit=="K") { dist = dist * 1.609344 }
  //     if (unit=="N") { dist = dist * 0.8684 }
  //     if (unit=="F") { dist = dist * 5280.00016896}
  //     return dist;
  //   }
  // }
  
  
  

  private restApi(){

    this.app.express.use('/whichis_csv_download', (req:any, res:any)=>{
      let imei = req.query.imei;
      if(!imei){
        return res.json({
          ok: false,
          error: "imei is not valid"
        })
      }
      let variables = {
        imei: "300234010609990"
      }

      try {
        request('http://52.79.84.133:4001/graphql', getWhichiQuery, variables).then((data :any)=>{
          console.log(data);
          let resultArr : any = []
          let whichigroup = data.GetWhichis.whichis[0].whichigroup;
          if(whichigroup && whichigroup.name){
            whichigroup = whichigroup.name 
          }
          data.GetWhichis.whichis[0].messages.forEach((message)=>{
              if(message.place){
               
                  resultArr.push({
                    lat: message.place.lat,
                    lng: message.place.lng,
                    speed: message.place.speed,
                    course: message.place.course,
                    time: moment(message.place.createdAt).format('YYYY-MM-DD hh:mm:ss'),
                    group: whichigroup
                })
              }
                
           })
          let descArr = resultArr.sort((a,b)=>new Date(b.time).getTime() - new Date(a.time).getTime())
          
          // return res.json({
          //   descArr
          // })
          const fields = ['lat', 'lng', 'speed', 'course', 'time', 'group'];
          const opts = { fields };
  
          const parser = new Parser(opts)
          const csv = parser.parse(descArr);
          res.setHeader('Contetn-Type', 'application/csv')
          res.attachment(moment(new Date()).format('YYYY-MM-DD_hh_mm_ss') + ".csv")
          return res.send(require('encoding').convert(csv, 'euc-kr'))
  
        })

      }catch(err){
        return res.json({
          ok:false,
          error: "csv export err"
        })

      }
     


    })

    
    this.app.express.use('/distance_download', (req:any, res:any)=>{

      let whichiId = req.query.whichiid;
      let from = req.query.from;
      let to = req.query.to;

      console.log("argu = ", whichiId, from, to)
      let variables = {
        whichiId: whichiId, from, to
      }
     

      //data.GetMyPlaces.places
      request('http://52.79.84.133:4001/graphql', GetDailyDistance, variables).then((data :any)=>{

        let resultArr = data.GetDailyDistance.resultArr;
      
        
        // return res.json({
        //   descArr
        // })
        // const fields = ['date', 'km', 'feet', 'knot'];
        // const opts = { fields };

        // const parser = new Parser(opts)
        // const csv = parser.parse(resultArr);
        let csv = `start,${from},end,${to}\n`
        csv += 'date,distance(km),distance(feet),speed(knot),speed(km)\n';
        let kmsum = 0;
        let feetsum = 0;
        let knotsum = 0;
        let speedkmsum = 0;
        let arrlen = resultArr.length;
        resultArr.forEach((ob)=>{
          csv += `${ob.date},${ob.km},${ob.feet},${ob.knot},${ob.speed}\n`
          kmsum += ob.km;
          feetsum += ob.feet;
          knotsum += ob.knot;
          speedkmsum += ob.speed;
        })
        csv += `total,${kmsum},${feetsum},${knotsum}\n`
        csv += `평균,${kmsum/arrlen},${feetsum/arrlen},${knotsum/arrlen},${speedkmsum/arrlen}\n`

        res.setHeader('Contetn-Type', 'application/csv')
        res.attachment(moment(new Date()).format('YYYY-MM-DD_hh_mm_ss') + ".csv")
        return res.send(require('encoding').convert(csv, 'euc-kr'))

      })
    })


    this.app.express.use('/position_download', (req:any, res:any)=>{

      let whichiId = req.query.whichiid;
      let from = req.query.from;
      let to = req.query.to;

      console.log("argu = ", whichiId, from, to)
      let variables = {
        whichiIds: [whichiId], from, to, place: true, io_port_status: true, kind: ["place_rx_ask"]
      }
     
      
      //data.GetMyPlaces.places
      request('http://52.79.84.133:4001/graphql', GetMessages, variables).then((data :any)=>{

        let messages = data.GetMessages.messages;
      
        
        // return res.json({
        //   descArr
        // })
        // const fields = ['date', 'km', 'feet', 'knot'];
        // const opts = { fields };

        // const parser = new Parser(opts)
        // const csv = parser.parse(resultArr);
        console.log("messages = ",messages)
        let ipsArr: any =  [];
        messages.forEach((message)=>{
          ipsArr.push([{out_status:"no data", io_status: "no data"},{out_status:"no data", io_status: "no data"},{out_status:"no data", io_status: "no data"},{out_status:"no data", io_status: "no data"}])
          message.ips.forEach((ip)=>{
            ipsArr[ipsArr.length - 1][ip.port_num - 1] = ip
          })
         
        })
        let csv = `start,${from},end,${to}\n`
        csv += 'Date,UTC,Latitude,Longitude,Altitude,Speed,Course,IO1_out,IO1_IO,IO2_out,IO2_IO,IO3_out,IO3_IO,IO4_out,IO4_IO\n';
        messages.forEach((ob, index)=>{
          csv += `${moment(ob.createdAt).format("YYYY-MM-DD hh:mm:ss")},${moment(ob.place.utc).format("YYYY-MM-DD hh:mm:ss")},${ob.place.lat},${ob.place.lng},${ob.place.alt},${ob.place.speed},${ob.place.course},${ipsArr[index][0].out_status},${ipsArr[index][0].io_status},${ipsArr[index][1].out_status},${ipsArr[index][1].io_status},${ipsArr[index][2].out_status},${ipsArr[index][2].io_status},${ipsArr[index][3].out_status},${ipsArr[index][3].io_status}\n`
        
        })
       
        res.setHeader('Contetn-Type', 'application/csv')
        res.attachment(moment(new Date()).format('YYYY-MM-DD_hh_mm_ss') + ".csv")
        return res.send(require('encoding').convert(csv, 'euc-kr'))

      })
    })

    this.app.express.use('/event_download', (req:any, res:any)=>{

      let whichiId = req.query.whichiid;
      let from = req.query.from;
      let to = req.query.to;

      console.log("argu = ", whichiId, from, to)
      let variables = {
        whichiIds: [whichiId], from, to, kind: ["report_rx_ask", "place_rx_poll", "distress_tx_set", "distress_rx", "ioport_tx_ask", "poll_tx_ask", "report_tx_ask", "report_tx_set", "poweron_rx", "message_tx", "message_rx", "user_active", "user_inactive", "ioport_rx_success", "report_rx_success"]
      }
     
      //data.GetMyPlaces.places
      request('http://52.79.84.133:4001/graphql', GetMessages, variables).then((data :any)=>{

        let messages = data.GetMessages.messages;
      
        
        // return res.json({
        //   descArr
        // })
        // const fields = ['date', 'km', 'feet', 'knot'];
        // const opts = { fields };

        // const parser = new Parser(opts)
        // const csv = parser.parse(resultArr);
        function getStatusDetail(message_kind){
          if(message_kind == "whichi_active"){
            return {
              status: "USE",
              detail: "Device approval"
            }
      
          }else if(message_kind=="whichi_inactive"){
            return {
              status: "STOP",
              detail: "Device not approval"
            }
      
          }else if(message_kind == "report_rx_ask"){
            return {
              status: "Setting",
              detail: "Response - Setting Read"
            }
          }else if(message_kind == "report_rx_success"){
            return {
              status: "Setting",
              detail: "Report Setting changes success"
            }
          }else if(message_kind == "ioport_rx_success"){
            return {
              status: "Setting",
              detail: "IO Port Setting change success"
            }
          }else if(message_kind == "distress_tx_set"){
            return {
              status: "Distress",
              detail: "Request - Distress State Change"
            }
          }else if(message_kind == "ioport_tx_ask"){
            return {
              status: "Distress",
              detail: "Request - IO Setting Read"
            }
          }else if(message_kind == "place_rx_poll"){
            return {
              status: "Poll",
              detail: "Response - Poll Signal"
            }
          }else if(message_kind == "poll_tx_ask"){
            return {
              status: "Poll",
              detail: "Request - Poll Signal"
            }
          }else if(message_kind == "report_tx_ask"){
            return {
              status: "Setting",
              detail: "Request - Report Setting Read"
            }
          }else if(message_kind == "report_tx_set"){
            return {
              status: "Setting",
              detail: "Request - Setting Write"
            }
          }else if(message_kind == "poweron_rx"){
            return {
              status: "Active",
              detail: "Asset powered on"
            }
          }else if(message_kind ==" message_tx"){
           return { status: 'Message',
            event: 'Sent Message'}
            
          }else if(message_kind == "message_rx"){
            return {
              status: 'Message',
              event: 'Received Message',
            }
          }

          // user_active: {
          //   status: 'USE',
          //   event: 'Device approval',
          //   color: '#4070F6',
          // },
          // user_inactive: {
          //   status: 'STOP',
          //   event: 'Device not approval',
          //   color: '#999',
          // },
          //distress
        


          return {
            status: "no data",
            detail: "no data"
          }
      
        }
        let csv = `start,${from},end,${to}\n`
        csv += 'id,Date,Event Status,Detail\n';
        messages.forEach((ob)=>{
          csv += `${ob.id},${moment(ob.createdAt).format("YYYY-MM-DD HH:mm:ss")},${getStatusDetail(ob.kind).status},${getStatusDetail(ob.kind).detail}\n`
        
        })
       
        res.setHeader('Contetn-Type', 'application/csv')
        res.attachment(moment(new Date()).format('YYYY-MM-DD_hh_mm_ss') + ".csv")
        return res.send(require('encoding').convert(csv, 'euc-kr'))

      })
    })




  }

 

  private jwt = async (
    req,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = req.get("X-JWT");
    if (token) {
      console.log("token=", token)
      const user = await decodeJWT(token);
      if (user) {
        req.user = user;
      } else {
        req.user = undefined;
      }
    }
    next();
  };
}



export default new App().app;
