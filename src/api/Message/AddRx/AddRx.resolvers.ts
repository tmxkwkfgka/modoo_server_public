
import { AddRxMutationArgs, AddRxResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import Message from "../../../entities/Message";
import Report_Setting from "../../../entities/Report_Setting"
import IO_Port_Status from "../../../entities/IO_Port_Status"
import Place from "../../../entities/Place"
import {parse} from "../../../utils/parseHex";
import Whichi from "../../../entities/Whichi";
import RecentestSetting from '../../../entities/RecentestSetting'


const resolvers: Resolvers = {
  Mutation: {
    AddRx: privateResolver(
      async (
        parent,
        args: AddRxMutationArgs,
        { req, res }
      ): Promise<AddRxResponse> => {
        //const user: User = req.user;
        try {
          const {raw_content} = args;
          let resultObj :any = parse(raw_content);
          let payload_length = resultObj.payload.info.MO_payload_len;

          console.log("before type check resultobjj", resultObj)
          if(resultObj.payload.type == "report_rx_ask"){
            //resultObj.info.reports
            //resultObj.info.
            let imei = resultObj.header.info.MO_imei;
            let whichi = await Whichi.findOne({where: {imei: imei}});
            if(!whichi)
              console.log("no whichi");
            let message = await Message.create({
              raw_content,
              kind: "report_rx_ask",
              txrx: "rx",
              payload_length,
              whichi
            }).save();
            //let reports : Array<Report_Setting> = [];
            resultObj.payload.info.reports.forEach(async (report)=>{

             
              await Report_Setting.create({
                report_number: report.report_num,
                enable: report.reportOn? true: false,
                utc_on: report.utcOn? true : false,
                gps_on: report.gpsOn? true : false,
                alt_on: report.altOn? true : false,
                speed_on: report.speedOn? true: false,
                course_on: report.courseOn? true: false,
                period_time: report.periodTime,
                io1_on: report.io1On? true : false,
                io2_on: report.io2On? true : false,
                io3_on: report.io3On? true : false,
                io4_on: report.io4On? true : false,
                message: message
              }).save()
              
              
         
            })
            //           result Obj =  [ { port_num: 1, io_status: '00', out_status: '01' },
            //        { port_num: 2, io_status: '11', out_status: '0' },
            //  { port_num: 3, io_status: '', out_status: '' },
            //  { port_num: 4, io_status: '', out_status: '' } ]
            resultObj.payload.info.ioport_io_statuses.forEach(async (io)=>{
              await IO_Port_Status.create({
                port_num: io.port_num,
                io_status: io.io_status,
                out_status: io.out_status,
                message: message
              }).save()
            })

                  
            return {
              ok: true,
              error: null
            };

          }else if(resultObj.payload.type == "place_rx_ask"){
            let imei = resultObj.header.info.MO_imei;
            let whichi = await Whichi.findOne({where: {imei: imei}});
            if(!whichi)
              console.log("no whichi");
            console.log("place_rx_ask start !!")
            let message = await Message.create({
              raw_content,
              kind: "place_rx_ask",
              txrx: "rx",
              payload_length,
              whichi
            }).save();

            let {lat, lng, utc, altitude, speed, course, report_number, port1_status, port1_io, port1_adc, port2_status, port2_io, port2_adc, port3_status, port3_io, port3_adc, port4_status, port4_io, port4_adc} = resultObj.payload.info;
            //let imei = resultObj.header.info.MO_imei;
            if(port1_status){
              await IO_Port_Status.create({port_num: 1, io_status: port1_status, out_status: port1_io, ADC: port1_adc, message: message}).save()
            }
            if(port2_status){
              await IO_Port_Status.create({port_num: 2, io_status: port2_status, out_status: port2_io, ADC: port2_adc, message: message}).save()
            }
            if(port3_status){
              await IO_Port_Status.create({port_num: 3, io_status: port3_status, out_status: port3_io, ADC: port3_adc, message: message}).save()
            }
            if(port4_status){
              await IO_Port_Status.create({port_num: 4, io_status: port4_status, out_status: port4_io, ADC: port4_adc, message: message}).save()
            }

            let place = await Place.create({
              lat, lng, utc, alt: altitude, speed, course, imei, report_number, message, kind: "place_rx_ask"
            }).save();
            if(whichi){
              whichi.placeUpdatedAt = place.createdAt;
              whichi.last_position = place;
              await whichi.save();
            }
              
            console.log("inserted place = ", place);

            return {
              ok: true,
              error: null
            }



          }else if(resultObj.payload.type == "place_rx_poll"){
            let imei = resultObj.header.info.MO_imei;
            let whichi = await Whichi.findOne({where: {imei: imei}});
            if(!whichi)
              console.log("no whichi");
            let message = await Message.create({
              raw_content,
              kind: "place_rx_poll",
              txrx: "rx",
              payload_length,
              whichi
            }).save();

            let {lat, lng, utc, altitude, speed, course, report_number} = resultObj.payload.info;
            //let imei = resultObj.header.info.MO_imei;
            let place = await Place.create({
              lat, lng, utc: utc, alt: altitude, speed, course, imei, report_number, message, kind: "place_rx_poll"
            }).save();
            
            if(whichi){
              whichi.placeUpdatedAt = place.createdAt;
              whichi.last_position = place;
              await whichi.save();
            }
            console.log("inserted place = ", place);
            return {
              ok: true,
              error: null
            }
            
          }else if(resultObj.payload.type == "message_rx"){
            let imei = resultObj.header.info.MO_imei;
            let whichi = await Whichi.findOne({where: {imei: imei}});
            if(!whichi){
              console.log("no whichi");
              whichi = undefined
            }
              
           
              
            console.log("message rx save before ", resultObj)
            let message = await Message.create({
              raw_content,
              kind: "message_rx",
              txrx: "rx",
              whichi,
              payload_length,
              message_body: Buffer.from(resultObj.payload.info.message.match(/.{1,2}/g).map(v=>parseInt(v, 16))).toString(),
            }).save();
            console.log("message = ", message)
            if(whichi){
              whichi.last_message = message;
              await whichi.save();
            }
                      
          }else if(resultObj.payload.type == "poweron_rx"){

            let imei = resultObj.header.info.MO_imei;
            let whichi = await Whichi.findOne({where: {imei: imei}});
            if(!whichi)
              console.log("no whichi");
            let message = await Message.create({
              raw_content,
              kind: "poweron_rx",
              txrx: "rx",
              payload_length,
              whichi
            }).save();
            //let reports : Array<Report_Setting> = [];
            resultObj.payload.info.reports.forEach(async (report)=>{
              console.log("파워온 rx 레포트 = ", report)
             await Report_Setting.create({
                report_number: report.report_num,
                enable: report.reportOn,
                utc_on: report.utcOn? true : false,
                gps_on: report.gpsOn? true : false,
                alt_on: report.altOn? true : false,
                speed_on: report.speedOn? true: false,
                course_on: report.courseOn? true: false,
                period_time: report.periodTime,
                io1_on: report.io1On? true : false,
                io2_on: report.io2On? true : false,
                io3_on: report.io3On? true : false,
                io4_on: report.io4On? true : false,
                message: message
              }).save()
              
         
            })
            //           result Obj =  [ { port_num: 1, io_status: '00', out_status: '01' },
            //        { port_num: 2, io_status: '11', out_status: '0' },
            //  { port_num: 3, io_status: '', out_status: '' },
            //  { port_num: 4, io_status: '', out_status: '' } ]
            resultObj.payload.info.ioport_io_statuses.forEach(async (io)=>{
              await IO_Port_Status.create({
                port_num: io.port_num,
                io_status: io.io_status,
                out_status: io.out_status,
                message: message
              }).save()
            })

      

            //const msg = await Message.findOne({where: {imei: imei, kind:"ioport_tx_ask"}, order: {id: "DESC"}, relations: ['ips']})
            let recent = await RecentestSetting.findOne({where: {imei: imei}});

            if(recent){

              
              resultObj.payload.info.ioport_io_statuses.forEach((io, index)=>{
                if(recent){
                  recent[`port${(index+1).toString()}_out_status`] =  io? io.out_status : ""
                  recent[`port${(index+1).toString()}_io_status`] =  io? io.io_status : ""
                  //recent.port1_ADC =  port1? port1.ADC: null

                }
             
              })

              // [ { report_num: 0,
              //   reportOn: 1,
              //   utcOn: 1,
              //   gpsOn: 1,
              //   altOn: 1,
              //   speedOn: 1,
              //   courseOn: 1,
              //   periodTime: 5,
              //   io1On: 0,
              //   io2On: 0,
              //   io3On: 0,
              //   io4On: 1 },...]
              resultObj.payload.info.reports.forEach((report, index)=>{
                if(recent){
                  recent[`report${(index+1).toString()}_enable`] = report? report.reportOn : null
                  recent[`report${(index+1).toString()}_utc_on`] = report? report.utcOn : null
                  recent[`report${(index+1).toString()}_gps_on`] = report? report.gpsOn : null
                  recent[`report${(index+1).toString()}_alt_on`] = report? report.altOn : null
                  recent[`report${(index+1).toString()}_speed_on`] = report? report.speedOn : null
                  recent[`report${(index+1).toString()}_course_on`] = report? report.courseOn : null
                  recent[`report${(index+1).toString()}_period_time`] = report? report.periodTime : null

                  recent[`report${(index+1).toString()}_io1_on`] = report? report.io1On : null
                  recent[`report${(index+1).toString()}_io2_on`] = report? report.io2On : null
                  recent[`report${(index+1).toString()}_io3_on`] = report? report.io3On : null
                  recent[`report${(index+1).toString()}_io4_on`] = report? report.io4On : null
                }

              })

              await recent.save()
              return {
                ok: true,
                error: null
              };

            }else{
              let obj= {}
              obj["imei"] = imei
              
              resultObj.payload.info.ioport_io_statuses.forEach((io, index)=>{
               
                  obj[`port${(index+1).toString()}_out_status`] =  io? io.out_status : ""
                  obj[`port${(index+1).toString()}_io_status`] =  io? io.io_status : ""
                  //recent.port1_ADC =  port1? port1.ADC: null
               
              })
              resultObj.payload.info.reports.forEach((report, index)=>{
              
                  obj[`report${(index+1).toString()}_enable`] = report? report.enable : null
                  obj[`report${(index+1).toString()}_utc_on`] = report? report.utcOn : null
                  obj[`report${(index+1).toString()}_gps_on`] = report? report.gpsOn : null
                  obj[`report${(index+1).toString()}_alt_on`] = report? report.altOn : null
                  obj[`report${(index+1).toString()}_speed_on`] = report? report.speedOn : null
                  obj[`report${(index+1).toString()}_course_on`] = report? report.courseOn : null
                  obj[`report${(index+1).toString()}_period_time`] = report? report.periodTime : null

                  obj[`report${(index+1).toString()}_io1_on`] = report? report.io1On : null
                  obj[`report${(index+1).toString()}_io2_on`] = report? report.io2On : null
                  obj[`report${(index+1).toString()}_io3_on`] = report? report.io3On : null
                  obj[`report${(index+1).toString()}_io4_on`] = report? report.io4On : null
             

              })
              console.log("before create obj = ", obj)
             
              await RecentestSetting.create(obj).save()

                  
            return {
              ok: true,
              error: null
            };
            

           }
        
        
      }else if(resultObj.payload.type == "distress_rx"){
          let imei = resultObj.header.info.MO_imei;
          let whichi = await Whichi.findOne({where: {imei: imei}});
          if(!whichi)
            console.log("no whichi");

            let {lat, lng, utc, altitude, speed, course, report_number, distress} = resultObj.payload.info;
        //rx_on rx_off
          let message = await Message.create({
            raw_content,
            kind: distress == 0? "distress_rx_off" : "distress_rx_on",
            txrx: "rx",
            whichi,
            payload_length,
            message_body: distress.toString()
          }).save();

         
          //let imei = resultObj.header.info.MO_imei;
          let place = await Place.create({
            lat, lng, utc, alt: altitude, speed, course, imei, report_number, message, kind: "distress_rx"
          }).save();
          
          if(whichi){
            whichi.placeUpdatedAt = place.createdAt;
            whichi.last_position = place;
            if(distress == 1){
              whichi.status = "distress"
            }else if(distress == 0){
              whichi.status = "active"
            }
            await whichi.save();
          }
          console.log("inserted place = ", place);
          return {
            ok: true,
            error: null
          }
          
        }else if(resultObj.payload.type == "ioport_rx_success"){
          let imei = resultObj.header.info.MO_imei;
          let whichi = await Whichi.findOne({where: {imei: imei}});
          if(resultObj.payload.info.success){
            // 최근것을 가져오려면? order by 말고 어떤것 필요? order by id limit 1
            const msg = await Message.findOne({where: {imei: imei, kind:"ioport_tx_ask"}, order: {id: "DESC"}, relations: ['ips']})
            let recent = await RecentestSetting.findOne({where: {imei: imei}});

            if(!msg){
              return {
                ok: false,
                error: "no ioport tx set"
              };
            }

            if(recent){
              const port1 = msg.ips.find(e=>e.port_num == 1);
              const port2 = msg.ips.find(e=>e.port_num == 2);
              const port3 = msg.ips.find(e=>e.port_num == 3);
              const port4 = msg.ips.find(e=>e.port_num == 4);
              recent.port1_out_status =  port1? port1.out_status : ""
              recent.port1_io_status =  port1? port1.io_status : ""
              recent.port1_ADC =  port1? port1.ADC: null
              recent.port2_out_status = port2? port2.out_status : ""
              recent.port2_io_status = port2? port2.io_status : ""
              recent.port2_ADC = port2? port2.ADC: null
              recent.port3_out_status = port3? port3.out_status : ""
              recent.port3_io_status = port3? port3.io_status : ""
              recent.port3_ADC = port3? port3.ADC: null
              recent.port4_out_status = port4? port4.out_status : ""
              recent.port4_io_status = port4? port4.io_status : ""
              recent.port4_ADC = port4? port4.ADC: null
              await recent.save()
            

            }else{
              const port1 = msg.ips.find(e=>e.port_num == 1);
              const port2 = msg.ips.find(e=>e.port_num == 2);
              const port3 = msg.ips.find(e=>e.port_num == 3);
              const port4 = msg.ips.find(e=>e.port_num == 4);
              await RecentestSetting.create({
                imei,
                port1_out_status: port1? port1.out_status : "",
                port1_io_status: port1? port1.io_status : "",
                port1_ADC: port1? port1.ADC: null,
                port2_out_status: port2? port2.out_status : "",
                port2_io_status: port2? port2.io_status : "",
                port2_ADC: port2? port2.ADC: null,
                port3_out_status: port3? port3.out_status : "",
                port3_io_status: port3? port3.io_status : "",
                port3_ADC: port3? port3.ADC: null,
                port4_out_status: port4? port4.out_status : "",
                port4_io_status: port4? port4.io_status : "",
                port4_ADC: port4? port4.ADC: null,
                
                
              }).save()
            
            }
            
            let message = await Message.create({
              raw_content,
              kind: "ioport_rx_success",
              txrx: "rx",
              payload_length,
              whichi
            }).save();

            return {
              ok: true,
              error: null
            };

          }else{
            return {
              ok: false,
              error: "msg is not successful"
            };

          }

        }else if(resultObj.payload.type == "report_rx_success"){
          let imei = resultObj.header.info.MO_imei;
          let whichi = await Whichi.findOne({where: {imei: imei}});
          if(resultObj.payload.info.success){
            // 최근것을 가져오려면? order by 말고 어떤것 필요? order by id limit 1
            const msg = await Message.findOne({where: {imei: imei, kind:"report_tx_set"},  order: {id: "DESC"}, relations: ['reports']})
            let recent = await RecentestSetting.findOne({where: {imei: imei}});

            if(!msg){
              return {
                ok: false,
                error: "no report tx set"
              };
            }
            console.log("report_rx_success = ", msg)
            console.log(recent)

            if(recent){
              const report1 = msg.reports.find(e=>e.report_number == 0);
              const report2 = msg.reports.find(e=>e.report_number == 1);
              const report3 = msg.reports.find(e=>e.report_number == 2);
              const report4 = msg.reports.find(e=>e.report_number == 3);
              console.log("when report exist  = ", report1, report2, report3, report4)
              recent.report1_enable =  report1? report1.enable : null
              recent.report1_utc_on =  report1? report1.utc_on : null
              recent.report1_gps_on =  report1? report1.gps_on: null
              recent.report1_alt_on = report1? report1.alt_on : null
              recent.report1_speed_on = report1? report1.speed_on : null
              recent.report1_course_on = report1? report1.course_on: null
              recent.report1_period_time = report1? report1.period_time : null

              recent.report2_enable =  report2? report2.enable : null
              recent.report2_utc_on =  report2? report2.utc_on : null
              recent.report2_gps_on =  report2? report2.gps_on: null
              recent.report2_alt_on = report2? report2.alt_on : null
              recent.report2_speed_on = report2? report2.speed_on : null
              recent.report2_course_on = report2? report2.course_on: null
              recent.report2_period_time = report2? report2.period_time : null

              recent.report3_enable =  report3? report3.enable : null
              recent.report3_utc_on =  report3? report3.utc_on : null
              recent.report3_gps_on =  report3? report3.gps_on: null
              recent.report3_alt_on = report3? report3.alt_on : null
              recent.report3_speed_on = report3? report3.speed_on : null
              recent.report3_course_on = report3? report3.course_on: null
              recent.report3_period_time = report3? report3.period_time : null

              recent.report4_enable =  report4? report4.enable : null
              recent.report4_utc_on =  report4? report4.utc_on : null
              recent.report4_gps_on =  report4? report4.gps_on: null
              recent.report4_alt_on = report4? report4.alt_on : null
              recent.report4_speed_on = report4? report4.speed_on : null
              recent.report4_course_on = report4? report4.course_on: null
              recent.report4_period_time = report4? report4.period_time : null
            
              await recent.save()
           

            }else{
              const report1 = msg.reports.find(e=>e.report_number == 1);
              const report2 = msg.reports.find(e=>e.report_number == 2);
              const report3 = msg.reports.find(e=>e.report_number == 3);
              const report4 = msg.reports.find(e=>e.report_number == 4);
              await RecentestSetting.create({
                imei,
                report1_enable :  report1? report1.enable : null,
                report1_utc_on :  report1? report1.utc_on : null,
                report1_gps_on :  report1? report1.gps_on: null,
                report1_alt_on : report1? report1.alt_on : null,
                report1_speed_on : report1? report1.speed_on : null,
                report1_course_on : report1? report1.course_on: null,
                report1_period_time : report1? report1.period_time : null,
                report2_enable :  report2? report2.enable : null,
                report2_utc_on :  report2? report2.utc_on : null,
                report2_gps_on :  report2? report2.gps_on: null,
                report2_alt_on : report2? report2.alt_on : null,
                report2_speed_on : report2? report2.speed_on : null,
                report2_course_on : report2? report2.course_on: null,
                report2_period_time : report2? report2.period_time : null,
                report3_enable :  report3? report3.enable : null,
                report3_utc_on :  report3? report3.utc_on : null,
                report3_gps_on :  report3? report3.gps_on: null,
                report3_alt_on : report3? report3.alt_on : null,
                report3_speed_on : report3? report3.speed_on : null,
                report3_course_on : report3? report3.course_on: null,
                report3_period_time : report3? report3.period_time : null,
                report4_enable :  report4? report4.enable : null,
                report4_utc_on :  report4? report4.utc_on : null,
                report4_gps_on :  report4? report4.gps_on: null,
                report4_alt_on : report4? report4.alt_on : null,
                report4_speed_on : report4? report4.speed_on : null,
                report4_course_on : report4? report4.course_on: null,
                report4_period_time : report4? report4.period_time : null
      
                
              }).save()
             
            }

            let message = await Message.create({
              raw_content,
              kind: "report_rx_success",
              txrx: "rx",
              payload_length,
              whichi
            }).save();

            return {
              ok: true,
              error: null
            };

          }else{
            return {
              ok: false,
              error: "msg is not successful"
            };

          }

        }else{

        }

          return {
            ok: true,
            error: null
          };
          

        } catch (error) {
          console.log(error)

          return {
            ok: false,
            error: error
          };

        }
        
      }
    )
  }
};

// function hex2a(hexx) {
//   var hex = hexx.toString();//force conversion
//   var str = '';
//   for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
//       str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
//   return str;
// }

// function is_hangul_char(c) {
//   //c = ch.charCodeAt(0);
//   //console.log("in ishanguel c = ", c)
//   //c = parseInt(c, 16)
//   //12 : 0x3132
//   if( 0x1100<=c && c<=0x11FF ) return true;
//   if( 0x3130<=c && c<=0x318F ) return true;
//   if( 0xAC00<=c && c<=0xD7A3 ) return true;
//   return false;
// }

// function hexstr_to_hanguel_or_else(hexstr){
//   let pointer = 0;
//   let retstr = ""
//   while(pointer < hexstr.length){
//     if(is_hangul_char(parseInt(hexstr.slice(pointer, pointer+4), 16))){
//       //console.log("한글맞음")
//       retstr += String.fromCharCode(parseInt(hexstr.slice(pointer, pointer+4),16))
//       pointer += 4;
//     }else{
//       retstr += String.fromCharCode(parseInt(hexstr.slice(pointer, pointer+2),16))
//       pointer += 2;
//     }
//   }

//   return retstr;

// }



export default resolvers;
