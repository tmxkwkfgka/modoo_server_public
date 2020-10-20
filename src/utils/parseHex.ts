import { RxReportSettingObj, RxReport } from "../types/types"
//01004201001c121daccc33303032333430363535323136353000008c00005d9a769c03000b002333608130fb000000030200124c2f000035b04000c5268000005e00000000

function parse(data){

   let buflen = data.length;
   console.log('buflen = ', buflen)
   console.log(data.toString('hex', 0, 2))
   console.log(data.toString('ascii', 10, 26))
   if(data.length > 3*2){
      
      let start = 0;
      let headerObj, locObj, payloadObj;
      //let MO_protocol_revision_num = data[0];
      console.log("typeof ", typeof data[0])
      //let MO_overall_msg_len = parseInt(data.toString('hex', start+1, start+3), 16);
      //1001cf0122aa800000000005daeb8f503000b0023377481ba86000000660200184c1f0f0808140209130012d6870012d687003039303930390ff00ff00ff00ff0


      let MO_iei = parseInt(data.substr(start+6, 2), 16);

      let lastIndex = start+3*2
      for(let i=0; (i < 4) && (lastIndex<data.length); i++){
         console.log("MO_iei = ", MO_iei)
         if(MO_iei == 1){
            headerObj = parseHeaderInfo(lastIndex, data);
            lastIndex = headerObj.lastIndex;
            console.log("in header lastindex and datalen = " ,lastIndex, data.length, headerObj)
            if(lastIndex < data.length)
               MO_iei = parseInt(data.substr(lastIndex, 2),16)
         }else if(MO_iei == 2){
            payloadObj = parsePayloadInfo(lastIndex, data);
            lastIndex = payloadObj.lastIndex;
            console.log("lastindex and datalen = " ,lastIndex, data.length)
            if(lastIndex < data.length)
               MO_iei = parseInt(data.substr(lastIndex, 2), 16)
            
         }else if(MO_iei == 3){
            locObj = parseLocInfo(lastIndex, data);
            
            lastIndex = locObj.lastIndex;
            console.log("in loc lastindex and datalen = " ,lastIndex, data.length, locObj)
            if(lastIndex < data.length)
               MO_iei = parseInt(data.substr(lastIndex, 2),16)
         }
         // }else if(MO_iei == 5){
           
         // }
   
      } 

      console.log("header=", headerObj,"locobj=", locObj, "payloadObj = ", payloadObj)
     
      return {
          header: headerObj,
          loc: locObj,
          payload: payloadObj
      }
      
      // let MO_header_iei = data[3];
      // let MO_header_len = parseInt(data.toString('hex', 4, 6), 16);
      // let MO_cdr_reference = parseInt(data.toString('hex', 6, 10), 16);
      // let MO_imei = data.toString('ascii', 10, 26)
      // let MO_session = parseInt(data.toString('hex', 27, 28), 16);
      // let MO_momsn = parseInt(data.toString('hex', 28, 30), 16);
      // let MO_mtmsn = parseInt(data.toString('hex', 30, 32), 16);
      // let MO_epochtime = parseInt(data.toString('hex', 32, 36), 16);

      
      // let MO_location_iei = parseInt(data.toString('hex', 36, 37), 16);
      // let MO_location_len = parseInt(data.toString('hex', 37, 39), 16);
      // let MO_location_first_byte = parseInt(data.toString('hex', 39, 40), 16);

   
   }else{
      return {
         error: "too short."
      }

   }

}

function parseLocInfo(start, wholemsg){
   if(wholemsg.length < start+14*2){
      console.log("길이짧음 u데이터 잘못됌");
      return {
         errMsg: "length is short"
      }
   }

   let MO_location_iei = parseInt(wholemsg.substr(start, 1*2), 16);
   let MO_location_len = parseInt(wholemsg.substr(start+1*2, 2*2), 16);
   let MO_location_first_byte = parseInt(wholemsg.substr(start+3*2, 1*2), 16);
   let Mo_location_lat_degree = parseInt(wholemsg.substr(start+4*2, 1*2), 16);
   let Mo_location_lat = parseInt(wholemsg.substr(start+5*2, 2*2), 16);
   let Mo_location_lng_degree = parseInt(wholemsg.substr(start+7*2, 1*2), 16);
   let Mo_location_lng = parseInt(wholemsg.substr(start+8*2, 2*2), 16);
   let MO_cep_radius = parseInt(wholemsg.substr(start+10*2, 4*2), 16);
   //parseLocationByte(MO_location_first_byte);
   return {
      info: {
         MO_location_iei,
         MO_location_len,
         MO_location_first_byte,
         Mo_location_lat_degree,
         Mo_location_lat,
         Mo_location_lng_degree,
         Mo_location_lng,
         MO_cep_radius
        

      },
      lastIndex: start + 14*2,
      errMsg: null
   }
   

}

const parseRxReportSetting = (start: number, wholemsg: string): RxReportSettingObj =>{

   let MO_payload_iei = parseInt(wholemsg.substr(start, 2), 16);
   let MO_payload_len = parseInt(wholemsg.substr(start+2, 2), 16);
   let MO_payload = wholemsg.substr(start+6, (start+6) + (MO_payload_len*2));
   let reports : RxReport[] = [];
   for(let i=0; i<4; i++){
      reports.push(parseReport(start+10+8*i, wholemsg));
   }
 
   
   

   return {
      info: {
         MO_payload_iei,
         MO_payload_len,
         MO_payload,
         reports: reports,
        
      },
      lastIndex: (start+3) + MO_payload_len,
      errMsg: null
   }
}


const parsePayloadInfo = (start: number, wholemsg: string): object | null => {
    
    // hex문자 한개가 4비트라서 곱하기 2필요
   console.log("wholemsg = ", wholemsg)
    
    let MO_payload_iei = parseInt(wholemsg.substr(start, 1*2), 16);
    let MO_payload_len = parseInt(wholemsg.substr(start+1*2, 2*2), 16);



    let MO_payload = wholemsg.substr(start+3*2, (start+3*2) + (MO_payload_len*2));
    console.log("mo payload = ", MO_payload);
    let MO_cToken = wholemsg.substr(start+3*2, 1*2);

    if(MO_cToken == "53" && wholemsg.substr(start+4*2, 2) == "52"){

        let reports : object[] = [];
        for(let i=0; i<4; i++){
            reports.push(parseReport(start+5*2+8*i, wholemsg));
        }
        let io_port_status_bin = hex2bin(wholemsg.substr(start+21*2, 4));
      
        console.log("io_port_status_bin = ", io_port_status_bin, wholemsg.substr(start+21*2, 4))

       
        let ioport_io_statuses : object[] = [];
      
        for(let a=0; a<4; a++){
            ioport_io_statuses.push({
                "port_num": a+1,
                "io_status": io_port_status_bin.substr(a*4, 2),
                "out_status": io_port_status_bin.substr((a+1)*4 - 1, 1),
            })
        }
      

        return {
            type: "report_rx_ask",
            info: {
               MO_payload_iei,
               MO_payload_len,
               MO_payload,
               reports: reports,
               ioport_io_statuses: ioport_io_statuses
              
            },
            lastIndex: (start+3*2) + (MO_payload_len * 2),
            errMsg: null
        }
        // ioport1_io_status = io_port_status_bin.substr(0,2);
        // ioport1_out_status = io_port_status_bin.substr(3,1);
        // ioport2_io_status = io_port_status_bin.substr(4,2);
        // ioport2_out_status = io_port_status_bin.substr(7,1);
        // ioport3_io_status = io_port_status_bin.substr(8,2);
        // ioport3_out_status = io_port_status_bin.substr(11,1);
        // ioport4_io_status = io_port_status_bin.substr(12,2);
        // ioport4_out_status = io_port_status_bin.substr(15,1);
            
    }else if(MO_cToken == "4c"){
       // io masking 처리 안한듯,
       // io status도 같이오는데 masking과 함께 같이처리를 안함
      console.log("when mo_ctoken is 4c. ", wholemsg.substr(start+8, start + MO_payload_len *2))
            
        let MO_report_masking = wholemsg.substr(start+8, 2);
        let Mo_io_masking = wholemsg.substr(start+10, 2);
        //let MO_io_masking = wholemsg.substr(start+10, 2);
        console.log("before parsedatapayload MO_PAYLOAD = ", MO_payload)
        let payloadDataObj = parsePayloadData(MO_report_masking, Mo_io_masking, MO_payload)
        console.log("payloadDataObj = ", payloadDataObj)
        console.log("mo payload len = ", MO_payload_len)

        return {
            type: "place_rx_ask",
            info: {
            MO_payload_iei,
            MO_payload_len,
            MO_payload,
            ...payloadDataObj
            
            },
            lastIndex: (start+3*2) + (MO_payload_len * 2),
            errMsg: null
            
        }

    }else if(MO_cToken == "50"){
         console.log("when mo_ctoken is 50. ", wholemsg.substr(start+8, start + MO_payload_len *2))
        // polldata rx
        let MO_report_masking = wholemsg.substr(start+8, 2);
        //let MO_io_masking = wholemsg.substr(start+10, 2);
        let Mo_io_masking = wholemsg.substr(start+10, 2);
        //let MO_io_masking = wholemsg.substr(start+10, 2);
       
        console.log("before parsedatapayload MO_PAYLOAD = ", MO_payload)
        let payloadDataObj = parsePayloadData(MO_report_masking, Mo_io_masking, MO_payload)
        console.log("payloadDataObj = ", payloadDataObj)

        return {
            type: "place_rx_poll",
            info: {
            MO_payload_iei,
            MO_payload_len,
            MO_payload,
            ...payloadDataObj
            
            },
            lastIndex: (start+3*2) + (MO_payload_len * 2),
            errMsg: null
            
        }


    }else if(MO_cToken == "4d"){

         console.log("when mo_ctoken is 4d. ", wholemsg.substr(start+8, start + MO_payload_len *2))

        let message = wholemsg.substr(start+8, start + MO_payload_len *2);
        return {
            type: "message_rx",
            info: {
               MO_payload_iei,
               MO_payload_len,
               MO_payload,
               message
            },
            lastIndex: (start+3*2) + (MO_payload_len * 2),
            errMsg: null
        }


    }else if(MO_cToken == "41"){

      let reports : object[] = [];
      for(let i=0; i<4; i++){
          reports.push(parseReport(start+4*2+8*i, wholemsg));
      }
      let io_port_status_bin = hex2bin(wholemsg.substr(start+20*2, 4));
      let ioport_io_statuses : object[] = [];
      console.log("io_port_status_bin = ", io_port_status_bin, wholemsg.substr(start+20*2, 4))
      for(let a=0; a<4; a++){
          ioport_io_statuses.push({
              "port_num": a+1,
              "io_status": io_port_status_bin.substr(a*4, 2),
              "out_status": io_port_status_bin.substr((a+1)*4 - 1, 1),
          })
      }

      return {
          type: "poweron_rx",
          info: {
             MO_payload_iei,
             MO_payload_len,
             MO_payload,
             reports: reports,
             ioport_io_statuses: ioport_io_statuses
          },
          lastIndex: (start+3*2) + (MO_payload_len * 2),
          errMsg: null
      }


    }
   else if(MO_cToken == "44"){
      console.log("when mo_ctoken is 44. distress_rx", wholemsg.substr(start+8, start + MO_payload_len *2))
            
        let distress = parseInt(wholemsg.substr(start+4*2, 2), 16);
        let MO_report_masking = wholemsg.substr(start+5*2, 2);
        let MO_io_masking = wholemsg.substr(start+6*2, 2);
        console.log("before parsedatapayload MO_PAYLOAD = ", MO_payload)
        let payloadDataObj = parsePayloadData(MO_report_masking, MO_io_masking, MO_payload)
        console.log("payloadDataObj = ", payloadDataObj)

        return {
            type: "distress_rx",
            info: {
               MO_payload_iei,
               MO_payload_len,
               MO_payload,
               distress,
               ...payloadDataObj
            
            },
            lastIndex: (start+3*2) + (MO_payload_len * 2),
            errMsg: null
            
        }
// let MO_cToken = wholemsg.substr(start+3*2, 1*2);
   }else if(MO_cToken == "53" && wholemsg.substr(start+4*2, 1*2) == "57" && wholemsg.substr(start+5*2, 1*2) == "49"){
      let ioportSetResult = wholemsg.substr(start+6*2, 1*2);
      if(parseInt(ioportSetResult) == 1){
         // ioport setting 성공
         return {
            info: {
               MO_payload_iei,
               MO_payload_len,
               MO_payload,
               success: true
            },
         
            type: "ioport_rx_success",
            
         }


      }else if(parseInt(ioportSetResult) == 0){
         // ioport settting 실패
         return {
            info: {
               MO_payload_iei,
               MO_payload_len,
               MO_payload,
               success: false
            },
            type: "ioport_rx_success",
          
         }

      }else{
         // 알수없는 에러
         return {
            info: {
               MO_payload_iei,
               MO_payload_len,
               MO_payload,
               success: false
            },
           
            type: "ioport_rx_success",
           
         }
      }



   }else if(MO_cToken == "53" && wholemsg.substr(start+4*2, 1*2) == "57" && wholemsg.substr(start+5*2, 1*2) == "52"){
      let reportSetResult = wholemsg.substr(start+6*2, 1*2);
      if(parseInt(reportSetResult) == 1){
         // ioport setting 성공
         return {
            info: {
               MO_payload_iei,
               MO_payload_len,
               MO_payload,
               success: true
            },
       
            type: "report_rx_success",
           
         }


      }else if(parseInt(reportSetResult) == 0){
         // ioport settting 실패
         return {
            info: {
               MO_payload_iei,
               MO_payload_len,
               MO_payload,
               success: false

            },
            type: "report_rx_success",
           
         }

      }else{
         // 알수없는 에러
         return {
            info: {
               MO_payload_iei,
               MO_payload_len,
               MO_payload,
               success: false

            },
            type: "report_rx_success",
          
         }
      }



   }else {
      return null;
   }

   
   
   

    //0x53 0x52 설정값 읽기 rx
    //0x4c 위치정보 
    //0x50 poll data 위치
    //0x4d 사용자 메시지




    
  };

  function parseReport(start, wholemsg){
    let report_masking_bin = hex2bin(wholemsg.substr(start, 2));
    let report_num = parseInt(report_masking_bin.substr(0,2), 2)+1;
    let reportOn = Number(report_masking_bin.substr(2,1));
    let utcOn = Number(report_masking_bin.substr(3,1));
    let gpsOn = Number(report_masking_bin.substr(4,1));
    let altOn = Number(report_masking_bin.substr(5,1));
    let speedOn = Number(report_masking_bin.substr(6,1));
    let courseOn = Number(report_masking_bin.substr(7,1));

    let periodTime = parseInt(wholemsg.substr(start+2, 4), 16);
    let io_masking_bin = hex2bin(wholemsg.substr(start+6, 2));
    let io1On = Number(io_masking_bin.substr(4,1));
    let io2On = Number(io_masking_bin.substr(5,1));
    let io3On = Number(io_masking_bin.substr(6,1));
    let io4On = Number(io_masking_bin.substr(7,1));

    return {
       report_num, reportOn, utcOn, gpsOn, altOn, speedOn, courseOn, periodTime, io1On, io2On, io3On, io4On
    }


}

function parsePayloadData(report_masking, io_making, payload_data){
    console.log("in parsepayloaddata", hex2bin(report_masking));
    let report_masking_bin = hex2bin(report_masking);
    let io_masking_bin = hex2bin(io_making)
    let cToken = payload_data.substr(0,2)

    console.log("report_masking_bin , io masking bin,  = ", report_masking_bin, io_masking_bin)

    let masking = {
       "report_number": {
          "val": report_masking_bin.substr(0,2),
          "len": 0,
          "func": function(idx){
             // report num 00 01 10 11 이라서 1씩더해야 report1, report2, report3, report4가 된다.
             return {"report_number" : parseInt(report_masking_bin.substr(0,2), 2) + 1};
          }
       },
       "utc": {
         "val": report_masking_bin.substr(3,1),
         "len": 6 * 2,
         "func": function(idx){
            console.log("utc idx = ", idx)
            return {
               "utc": `20${parseInt(payload_data.substr(idx+10, 2), 16).toString()}.${parseInt(payload_data.substr(idx+8, 2), 16).toString()}.${parseInt(payload_data.substr(idx+6, 2), 16).toString()} ${parseInt(payload_data.substr(idx, 2), 16).toString()}:${parseInt(payload_data.substr(idx+2, 2), 16).toString()}:${parseInt(payload_data.substr(idx+4, 2), 16).toString()}`
            }
 
         }
       },
       "gps": {
          "val": report_masking_bin.substr(4,1),
          "len": 8 * 2,
          "func": function(idx){
             return {
                "lat": hexToSignedInt(payload_data.substr(idx, 8)) / 100000,
                "lng": hexToSignedInt(payload_data.substr(idx+8, 8)) / 100000
             }
          }
       },
       "altitude": {
          "val": report_masking_bin.substr(5,1),
          "len": 3 * 2,
          "func": function(idx){
             return {
                "altitude": hexToSignedInt(payload_data.substr(idx, 6)) / 10
             }
             
          }
          
       },
       "speed": {
          "val": report_masking_bin.substr(6,1),
          "len": 2 * 2,
          "func": function(idx){
             return {
                "speed": parseInt(payload_data.substr(idx, 4), 16) / 100
             }
          }
          
       },
       "course": {
         "val" : report_masking_bin.substr(7,1),
         "len": 2 * 2,
         "func": function(idx){
            return {
               "course": parseInt(payload_data.substr(idx, 4), 16) / 100
            }
         }
       },
       "ioport1": {
          "val": io_masking_bin.substr(4,1),
          "len": 2*2,
          "func": function(idx){
            let ioport_bin = hex2bin(payload_data.substr(idx, 1)) + hex2bin(payload_data.substr(idx+1, 1))
             return {
             
                "port1_status": ioport_bin.substr(0, 2),
                "port1_io": ioport_bin.substr(3, 1),
                "port1_adc": parseInt(ioport_bin.substr(4, 12), 2)

             }
          }
       },
       "ioport2": {
         "val": io_masking_bin.substr(5,1),
         "len": 2*2,
         "func": function(idx){
           let ioport_bin = hex2bin(payload_data.substr(idx, 1)) + hex2bin(payload_data.substr(idx+1, 1))
            return {
              
               "port2_status": ioport_bin.substr(0, 2),
               "port2_io": ioport_bin.substr(3, 1),
               "port2_adc": parseInt(ioport_bin.substr(4, 12), 2)

            }
         }

       },
       "ioport3": {
         "val": io_masking_bin.substr(6,1),
         "len": 2*2,
         "func": function(idx){
           let ioport_bin = hex2bin(payload_data.substr(idx, 1)) + hex2bin(payload_data.substr(idx+1, 1))
            return {
              
               "port3_status": ioport_bin.substr(0, 2),
               "port3_io": ioport_bin.substr(3, 1),
               "port3_adc": parseInt(ioport_bin.substr(4, 12), 2)

            }
         }

       },
       "ioport4": {
         "val": io_masking_bin.substr(7,1),
         "len": 2*2,
         "func": function(idx){
           let ioport_bin = hex2bin(payload_data.substr(idx, 1)) + hex2bin(payload_data.substr(idx+1, 1))
            return {
              
               "port4_status": ioport_bin.substr(0, 2),
               "port4_io": ioport_bin.substr(3, 1),
               "port4_adc": parseInt(ioport_bin.substr(4, 12), 2)

            }
         }

       }

    }
 
   
    let ret = {};
    let idx = 6;
    if(cToken == "44"){
       //distress 일때는 distress값이 응답에 들어가서 idx +2해야함
       console.log("44일때", cToken)
       idx = idx+2
    }
    console.log("parse payload idx = ", idx)
    Object.keys(masking).forEach(function(key){
       let cur = masking[key];
      
       if(cur["val"]  == "1" || cur["len"] == 0){
          console.log("idx, key", idx, key)
          Object.keys(cur["func"](idx)).forEach(function(subvalKey){
             ret[subvalKey] = cur["func"](idx)[subvalKey];
 
          })
          
          console.log("before idx = ", idx)
          idx += cur["len"];
          console.log("after idx = ", idx)
       }
       
    })
 
    console.log("payload ret = ", ret);
 
    return ret;
 }

 function parseHeaderInfo(start, wholemsg){
    console.log("wholemessage and start = ", wholemsg, start)
   //let idx = start;
   if(wholemsg.length < start + 31*2){
      console.log("길이짧음 u데이터 잘못됌");
      return {
         errMsg: "length is short"
      }
   }
   console.log("mo header len str = ", wholemsg.substr(start+1*2, 2*2))
   let MO_header_len  = parseInt(wholemsg.substr(start+1*2, 2*2), 16);
   let MO_cdr_reference  = parseInt(wholemsg.substr(start+3*2, 4*2), 16);
   let MO_imei  = hex_to_ascii(wholemsg.substr(start+7*2, 15*2));
   let MO_session = parseInt(wholemsg.substr(start+22*2, 1*2), 16);
   let MO_momsn = parseInt(wholemsg.substr( start+23*2, 2*2), 16);
   let MO_mtmsn = parseInt(wholemsg.substr(start+25*2, 2*2), 16);
   let MO_epochtime = parseInt(wholemsg.substr( start+27*2, 4*2), 16);

   return {
      info: {
         MO_header_len,
         MO_cdr_reference,
         MO_imei,
         MO_session,
         MO_momsn,
         MO_mtmsn,
         MO_epochtime

      },
      lastIndex: start + 31*2,
      errMsg: null
   }

}



function hex2bin(hex){
	let ret = ""
    hex.match(/.{1,2}/g).forEach(h=>{
		ret += parseInt(h,16).toString(2).padStart(8, '0')

    })
	return ret 
}

function hexToSignedInt(hex) {
   if (hex.length % 2 != 0) {
       hex = "0" + hex;
   }
   var num = parseInt(hex, 16);
   var maxVal = Math.pow(2, hex.length / 2 * 8);
   if (num > maxVal / 2 - 1) {
       num = num - maxVal
   }
   return num;
}
  
  export {
    parseRxReportSetting,
    parse
  } 
  
  function hex_to_ascii(str1)
 {
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
 }

 let hexStr = "01003401001c5b914aa833303032333430363535323136353000096b00005e1fff6103000b002328b1812a790000000202000453574901"

let resultObj = parse(hexStr)

console.log("result Obj = ", resultObj)


//01002d01001c5b982efb33303032333430363535323136353000097300ee5e200b8103000b00232bc481227d0000001b
//ioport_rx_success 오기전에 이것이 온다
