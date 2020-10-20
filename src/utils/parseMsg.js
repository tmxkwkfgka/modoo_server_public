function parse(data){

   let buflen = data.length;
   console.log('buflen = ', buflen);

   if(buflen > 3){
       let ctoken = data[3];
       let dataLen = 256 * data[1] + data[2];
       let dataStart = 4;
       if(ctoken == 73){
           //imei 
           let len = dataLen - 1
           let imeiArr = data.slice(dataStart, dataStart+len);
           console.warn("len = ")
           console.warn(len)
           console.warn(imeiArr)
           let imeiStr = imeiArr.map((v)=>{return String.fromCharCode(v)}).join('')
           return {
               type: "rx_imei_ask",
               imei: imeiStr
           }

       }else if(ctoken == 67){
        // 나중에 코드에 따른 정의내용을 노가다로 해서 연결해야함
        let len = dataLen - 1
        let status = data[dataStart];
        let regErr = data[dataStart + 1];
        let gps = data[dataStart + 2];

        return {
            type: "rx_network_status_ask",
            status: status,
            regErr: regErr,
            gps: gps
        }


       }else if(ctoken == 77){
           let subtoken = data[dataStart];
           if(subtoken == 83){
             let status = data[dataStart + 1];
             return { 
                 type: "rx_user_message_ask",
                 status : status

             }
           }
        //    else if(subtoken == 82){
        //    }

       }else if(ctoken == 80){
        let report_masking_bin = data[dataStart].toString(2).padStart(8, '0');
        let report_num = parseInt(report_masking_bin.substr(0,2), 2);
        let reportOn = Number(report_masking_bin.substr(2,1));
        let utcOn = Number(report_masking_bin.substr(3,1));
        let gpsOn = Number(report_masking_bin.substr(4,1));
        let altOn = Number(report_masking_bin.substr(5,1));
        let speedOn = Number(report_masking_bin.substr(6,1));
        let courseOn = Number(report_masking_bin.substr(7,1));

        let io_masking_bin = data[dataStart+1].toString(2).padStart(8, '0');
        let io1On = Number(io_masking_bin.substr(4,1));
        let io2On = Number(io_masking_bin.substr(5,1));
        let io3On = Number(io_masking_bin.substr(6,1));
        let io4On = Number(io_masking_bin.substr(7,1));

        let onArr = [].concat(utcOn, gpsOn, altOn, speedOn, courseOn);

        let datan = parsePayloadData(report_masking_bin, data.slice(dataStart + 2, dataStart + (dataLen - 2)));
        datan["type"] = "poll_rx_ask"
        return datan;

       }else if(ctoken == 68){
           let distress = data[dataStart];
           let report_masking_bin = data[dataStart+1].toString(2).padStart(8, '0');
           let datan = parsePayloadData(report_masking_bin, data.slice(dataStart + 3, dataStart + (dataLen - 2)));
           datan["type"] = "distress_rx_set"
           return datan;

       }else if(ctoken == 76){
           // 정기적 위치 데이터 수신인데 이때는 파싱하고 confirm메시지를 whichi-10으로 날려야함
           let datan = parsePayloadData(data.slice(dataStart + 1, dataStart + (dataLen - 2)));
           datan["type"] = "place_rx_ask"
           return datan;
       }else if(ctoken == 83){
           let subctoken = data[dataStart];
           reports = []

           if(subctoken == 82){
            for(let i=1; i<5; i++){
            
                let start = dataStart + (4*(i-1)) + 1
                let report_masking_bin = data[start].toString(2).padStart(8, '0');
                let report_num = parseInt(report_masking_bin.substr(0,2), 2);
                let reportOn = Number(report_masking_bin.substr(2,1));
                let utcOn = Number(report_masking_bin.substr(3,1));
                let gpsOn = Number(report_masking_bin.substr(4,1));
                let altOn = Number(report_masking_bin.substr(5,1));
                let speedOn = Number(report_masking_bin.substr(6,1));
                let courseOn = Number(report_masking_bin.substr(7,1));
    
                let periodTime = data.slice(start+1, start+3)
                let iomasking = data[start+3];
                reports.push({ report_num, reportOn, utcOn, gpsOn, altOn, speedOn, courseOn, periodTime, iomasking})
               }
    
               let ioportstatus_binstr = parseInt(toHexString(data.slice(datastart + 17, datastart + 19)), 16).toString(2);
               port1_io_status = ioportstatus_binstr.substr(0,1);
               port1_out_status = ioportstatus_binstr.charAt(3);
    
               port2_io_status = ioportstatus_binstr.substr(4,5);
               port2_out_status = ioportstatus_binstr.charAt(7);
    
               port3_io_status = ioportstatus_binstr.substr(8,9);
               port3_out_status = ioportstatus_binstr.charAt(11);
    
               port4_io_status = ioportstatus_binstr.substr(12,13);
               port4_out_status = ioportstatus_binstr.charAt(5);
    
               return {
                   type: "report_rx_ask",
                   reports: reports,
                   port1_io_status, port1_out_status,
                   port2_io_status, port2_out_status,
                   port3_io_status, port3_out_status,
                   port4_io_status, port4_out_status

               }

           }else if(subctoken == 87){
               //02 00 03 53 57 00 ad 03  실제로 ioport set rx로 오는 데이터
               let subctoken2 = data[dataStart+1];
               if(subctoken2 == 73){
                   //ioport ack, 위치텐에서 오는 메시지에 그냥 에크만옴
                   console.log("IOport ack ");
               }else if(subctoken2 == 82){
                   // report set ack, 위치텐에서 오는 메시지에 그냥 에크만옴
                   console.log("Report set ack ");
               }
           }


           
         


       }


   }else{
       console.log("error length too short")
   }

}


function parsePayloadData(report_masking_bin, payload_data){
    // console.log("in parsepayloaddata", hex2bin(report_masking));
    // report_masking_bin = hex2bin(report_masking);

    

    let masking = {
      
       "utc": {
         "val": report_masking_bin.substr(3,1),
         "len": 6,
         "func": function(idx){
            return {
               "utc": `${payload_data.slice(idx+5, idx+6)}.${payload_data.slice(idx+4, idx+5)}.${payload_data.slice(idx+3, idx+4)} ${payload_data.slice(idx+2, idx+3)} : ${payload_data.slice(idx+1, idx+2)} : ${payload_data.slice(idx, idx+1)}`
            }
 
         }
       },
       "gps": {
          "val": report_masking_bin.substr(4,1),
          "len": 8,
          "func": function(idx){
             return {
                "lat": hexToSignedInt(toHexString(payload_data.slice(idx, idx+4))) / 100000,
                "lng": hexToSignedInt(toHexString(payload_data.slice(idx+4, idx+8))) / 100000
             }
          }
       },
       "altitude": {
          "val": report_masking_bin.substr(5,1),
          "len": 3,
          "func": function(idx){
             return {
                "altitude": hexToSignedInt(toHexString(payload_data.slice(idx, idx+3))) / 10
             }
             
          }
          
       },
       "speed": {
          "val": report_masking_bin.substr(6,1),
          "len": 2,
          "func": function(idx){
             return {
                "speed": hexToUnsignedInt(toHexString(payload_data.slice(idx, idx+2))) / 100
             }
          }
          
       },
       "course": {
         "val" : report_masking_bin.substr(7,1),
         "len": 2,
         "func": function(idx){
            return {
               "course": hexToUnsignedInt(toHexString(payload_data.slice(idx, idx+2))) / 100
            }
         }
       },
       "ioport" : {
           "val": "1",
           "len": 2,
           "func": function(idx){
            
            let ioStatusArr = []
            for(let i=0; i<8; i=i+2){
                let binStr = parseInt(toHexString(payload_data.slice(idx+i, idx+i+2)), 16).toString(2);
                binStr.substr(0,1)

                let ionum = (i == 0)? 1 : (i/2) + 1;
                let ioport = binStr.substr(0,1);
                let io = binStr.charAt(3);
                let adc = parseInt(binStr.substr(4, 15), 2);
                ioStatusArr.push({
                    ionum,
                    ioport,
                    io,
                    adc
                })
            }
               return {
                   ioStatusArr
               }
           }
       }
    }
 
   
    let ret = {};
    let idx = 0;
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
   
 function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
  }

  function hexToUnsignedInt(hex){
    return parseInt(hex,16);
}

export {
    parse
}