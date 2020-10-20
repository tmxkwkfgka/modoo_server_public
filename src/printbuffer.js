

console.log(new Buffer(200).toString('hex').match(/../g).join(' '))

console.log(Buffer.from([12,22,33]))

let MT_revision_number = [1];
let MT_overall_len = [0,20];
let MT_header_iei = [65];
let MT_header_len = [0, 21];
let MT_unique_client_msg_id = [77, 115, 103, 49];
let MT_imei = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
let MT_disposition_flags = [0, 0];

let MT_payload_iei = [42];
let MT_payload_len = [1];
let MT_payload = [51];

let MT_priority_iei = [70];
let MT_priority_len = [0, 2];
let MT_priority_level = [0, 1]

let empty = [];
let MT_msg = empty.concat(MT_revision_number, MT_overall_len, MT_header_iei, MT_header_len, MT_unique_client_msg_id, MT_imei, MT_disposition_flags, MT_payload_iei, MT_payload_len, MT_payload, MT_priority_iei, MT_priority_len, MT_priority_level)
//console.log("MT_msg = ", MT_msg, "len = ", MT_msg.length, Buffer.from(MT_msg))


// 01 00 3f 01 00 1c f9 3c f6 a4 33 30 30 32 33 34 30 31 30 36 30 39 39 39 30 00 03 c0 00 00 5d 6f b1 c5 03 00 0b 00 23 28 b1 81 2a 79 00 00 00 04 02 00 0f 4c 0b 00 00 35 b0 3e 00 c5 26 80 00 00 00 00

let sample = Buffer.from([1, 0, 63, 1, 0, 28, 249, 60, 246, 164, 51, 48, 48, 50, 51, 52, 48, 49, 48, 54, 48, 57, 57, 57, 48, 0, 3, 192, 0, 0, 93, 111, 177, 197, 3, 0, 11, 0, 35, 40, 177, 129, 42, 121, 0, 0, 0, 4, 2, 0, 15, 76, 11, 0, 0, 53, 176, 62, 0, 197, 38, 130, 0, 0, 0, 0])

console.log("sample = ", sample)
console.log("numArr = ", sample.toString('hex').match(/../g).map(v=>parseInt(v, 16)))

function parseData(data){

   let buflen = data.length;
   console.log('buflen = ', buflen)
   console.log(data.toString('hex', 0, 2))
   console.log(data.toString('ascii', 10, 26))
   if(data.length > 3){
      
      let start = 0;
      let headerObj, locObj, payloadObj;
      let MO_protocol_revision_num = data[0];
      console.log("typeof ", typeof data[0])
      let MO_overall_msg_len = parseInt(data.toString('hex', start+1, start+3), 16);


      let MO_iei = parseInt(data.toString('hex', start+3, start+4), 16);

      let lastIndex = start+3
      for(let i=0; (i < 4) && (lastIndex<data.length); i++){
         console.log("MO_iei = ", MO_iei)
         if(MO_iei == 1){
            headerObj = parseHeaderInfo(lastIndex, data);
            lastIndex = headerObj.lastIndex;
            if(lastIndex < data.length)
               MO_iei = data[lastIndex]
         }else if(MO_iei == 2){
            payloadObj = parsePayloadInfo(lastIndex, data);
            lastIndex = payloadObj.lastIndex;
            if(lastIndex < data.length)
               MO_iei = data[lastIndex]
            
         }else if(MO_iei == 3){
            locObj = parseLocInfo(lastIndex, data);
            lastIndex = locObj.lastIndex;
            if(lastIndex < data.length)
               MO_iei = data[lastIndex]
         }else if(MO_iei == 5){
           
         }
   
      } 

      console.log(headerObj, locObj, "payloadObj = ", payloadObj)
     
      
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

   
   }

}

function parsePayloadInfo(start, wholemsg){
   if(wholemsg.length < start + 3){
      return {
         errMsg: "length is short"
      }
   }else{
      let MO_payload_iei = parseInt(wholemsg.toString('hex', start, start+1), 16);
      let MO_payload_len = parseInt(wholemsg.toString('hex', start+1, start+3), 16);



      if(wholemsg.length < (start+3) + MO_payload_len ){
         return {
            errMsg: "length is short"
         }
      }else{
         let MO_payload = wholemsg.toString('hex', start+3, (start+3) + MO_payload_len);
         console.log("mo payload = ", MO_payload);
         let MO_cToken = wholemsg.toString('hex', start+3, start+4);
         let MO_report_masking = wholemsg.toString('hex', start+4, start+5);
         let MO_io_masking = wholemsg.toString('hex', start+5, start+6);
         console.log("before parsedatapayload MO_PAYLOAD = ", MO_payload)
         let payloadDataObj = parsePayloadData(MO_report_masking, MO_payload)
         console.log("payloadDataObj = ", payloadDataObj)


         return {
            info: {
               MO_payload_iei,
               MO_payload_len,
               MO_payload,
               ...payloadDataObj
              
            },
            lastIndex: (start+3) + MO_payload_len,
            errMsg: null
            
         }
      }

   }
}

function parsePayloadData(report_masking, payload_data){
   console.log("in parsepayloaddata", hex2bin(report_masking));
   let report_masking_bin = hex2bin(report_masking);
   let masking = {
      "report_num": {
         "val": report_masking_bin.substr(0,2),
         "len": 0,
         "func": function(idx){
            return {"report_num" : report_masking_bin.substr(0,4)};
         }
      },
      "utc": {
        "val": report_masking_bin.substr(3,1),
        "len": 6 * 2,
        "func": function(idx){
           return {
              "utc": `${parseInt(payload_data.substr(idx+10, 2), 16).toString()}.${parseInt(payload_data.substr(idx+8, 2), 16).toString()}.${parseInt(payload_data.substr(idx+6, 2), 16).toString()} ${parseInt(payload_data.substr(idx, 2), 16).toString()} : ${parseInt(payload_data.substr(idx+2, 2), 16).toString()} : ${parseInt(payload_data.substr(idx+4, 2), 16).toString()}`
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
      } 
   }

  
   let ret = {};
   let idx = 6;
   Object.keys(masking).forEach(function(key){
      let cur = masking[key];
     
      if(cur["val"]  == "1" || cur["len"] == 0){
         console.log("idx, key", idx, key)
         Object.keys(cur["func"](idx)).forEach(function(subvalKey){
            ret[subvalKey] = cur["func"](idx)[subvalKey];

         })

         idx += cur["len"];
      }
      
   })

   console.log("payload ret = ", ret);

   return ret;

   


}

function parseLocInfo(start, wholemsg){
   if(wholemsg.length < start+14){
      console.log("길이짧음 u데이터 잘못됌");
      return {
         errMsg: "length is short"
      }
   }

   let MO_location_iei = parseInt(wholemsg.toString('hex', start, start+1), 16);
   let MO_location_len = parseInt(wholemsg.toString('hex', start+1, start+3), 16);
   let MO_location_first_byte = parseInt(wholemsg.toString('hex', start+3, start+4), 16);
   let Mo_location_lat_degree = parseInt(wholemsg.toString('hex', start+4, start+5), 16);
   let Mo_location_lat = parseInt(wholemsg.toString('hex', start+5, start+7), 16);
   let Mo_location_lng_degree = parseInt(wholemsg.toString('hex', start+7, start+8), 16);
   let Mo_location_lng = parseInt(wholemsg.toString('hex', start+8, start+10), 16);
   let MO_cep_radius = parseInt(wholemsg.toString('hex', start+10, start+14), 16);
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
      lastIndex: start + 14,
      errMsg: null
   }
   

}

function parseHeaderInfo(start, wholemsg){
   //let idx = start;
   if(wholemsg.length < start + 31){
      console.log("길이짧음 u데이터 잘못됌");
      return {
         errMsg: "length is short"
      }
   }
   let MO_header_len  = parseInt(wholemsg.toString('hex', start+1, start+3), 16);
   let MO_cdr_reference  = parseInt(wholemsg.toString('hex', start+3, start+7), 16);
   let MO_imei  = wholemsg.toString('ascii', start+7, start+22);
   let MO_session = parseInt(wholemsg.toString('hex', start+22, start+23), 16);
   let MO_momsn = parseInt(wholemsg.toString('hex', start+23, start+25), 16);
   let MO_mtmsn = parseInt(wholemsg.toString('hex', start+25, start+27), 16);
   let MO_epochtime = parseInt(wholemsg.toString('hex', start+27, start+31), 16);

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
      lastIndex: start + 31,
      errMsg: null
   }

}


function parseLocationByte(firstByte){

   let bitArrary = (+firstByte.toString()).toString(2);
   
   let rerserved = bitArrary.substr(0, 4);
   let formatCode = bitArrary.substr(4, 6);
   let nsi = bitArrary.substr(6, 7)=="0"? "north" : "south";
   let ewi = bitArrary.substr(7)=="0"? "ease" : "west";

   console.log({
      rerserved,
      formatCode,
      nsi,
      ewi
   })

}

function hex2bin(hex){
   return (parseInt(hex, 16).toString(2)).padStart(8, '0');
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

parseData(sample)