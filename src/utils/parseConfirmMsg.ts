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


const parseConfirmMsg = (confirm)=>{
    console.log("confirm = ", confirm)
    //let MT_confirm_msg_len = parseInt(confirm.toString('hex', 1, 3), 16);
    //let unique_client_id = parseInt(confirm.toString('hex', 3, 7), 16);
    let imei = confirm.toString('ascii', 10, 25);
    console.log("imei ascii = ", imei)
    //let auto_id_ref = parseInt(confirm.toString('hex', 22, 26), 16);
    let MT_message_status = hexToSignedInt(confirm.toString('hex', 29, 31));
    console.log("mt msg status = ", MT_message_status)

    let msg = ""
    if(1 <= MT_message_status && MT_message_status <= 50){
        msg = "successful, order of message in the MT message queue " + MT_message_status.toString();
    }else if(MT_message_status == 0){
        msg = "successful, no payload in message" + MT_message_status.toString();
    }else if(MT_message_status == -1){
        msg = "Invalid IMEI – too few characters, non-numeric characters" + MT_message_status.toString();
    }else if(MT_message_status == -2){
        msg = "Unknown IMEI – not provisioned on the Iridium Gateway" + MT_message_status.toString();
    }else if(MT_message_status == -3){
        msg = "Payload size exceeded maximum allowed" + MT_message_status.toString();
    }else if(MT_message_status == -4){
        msg = "Payload expected, but none received" + MT_message_status.toString();
    }else if(MT_message_status == -5){
        msg = "MT message queue full (max of 50)" + MT_message_status.toString();
    }else if(MT_message_status == -6){
        msg = "MT resources unavailable" + MT_message_status.toString();
    }else if(MT_message_status == -7){
        msg = "Violation of MT DirectIP protocol error" + MT_message_status.toString();
    }else if(MT_message_status == -8){
        msg = "Ring alerts to the given IMEI are disabled" + MT_message_status.toString();
    }else if(MT_message_status == -9){
        msg = "The given IMEI is not attached (not set to receive ring alerts)" + MT_message_status.toString();
    }else if(MT_message_status == -10){
        msg = "Source IP address rejected by MT filter" + MT_message_status.toString();
    }else if(MT_message_status == -11){
        msg = "MTMSN value is out of range (valid range is 1 – 65,535)" + MT_message_status.toString();
    }


    
    return {
        msg,
        error: (0 <= MT_message_status && MT_message_status <= 50)? null : true,
        imei
        
    }


}

export {
    parseConfirmMsg
}