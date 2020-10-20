

let MT_revision_number = [1];
let MT_overall_len = [0,20];    // 31 + payloadlen
let MT_header_iei = [65];
let MT_header_len = [0, 21];
let MT_unique_client_msg_id = [77, 115, 103, 49];
let MT_imei = [51, 48, 48, 50, 51, 52, 48, 54, 53, 53, 50, 49, 54, 53, 48]; //
let MT_disposition_flags = [0, 0];

let MT_payload_iei = [66];
let MT_payload_len = [0,2]; //
let MT_payload = [51];  //

let MT_priority_iei = [70];
let MT_priority_len = [0, 2];
let MT_priority_level = [0, 1]



import net from 'net';

const EventEmitter = require('events')

function makeMTMessage(imei, payload){
	console.log(" makemtstart ", payload, payload.length)
	// 4dac00b098b2e4 14

	let empty : Number[] = [];
	//MT_payload_len = [payload.length];
	MT_payload = payload.match(/.{2}/g).map(v=>parseInt(v, 16))
	MT_imei = imei.split("").map((v,i)=>imei.charCodeAt(i));
	let overallLen = 32 + payload.length/2

	MT_payload_len = [parseInt((payload.length/2).toString(16).padStart(4, '0').substr(0,2), 16), parseInt((payload.length/2).toString(16).padStart(4, '0').substr(2,2), 16)]
	MT_overall_len = [parseInt(overallLen.toString(16).padStart(4, '0').substr(0,2), 16), parseInt(overallLen.toString(16).padStart(4, '0').substr(2,2), 16)];
	let MT_msg : Number[] = empty.concat(MT_revision_number, MT_overall_len, MT_header_iei, MT_header_len, MT_unique_client_msg_id, MT_imei, MT_disposition_flags, MT_payload_iei, MT_payload_len, MT_payload, MT_priority_iei, MT_priority_len, MT_priority_level)

	return MT_msg;

}


class SendMessage extends EventEmitter {

	constructor(imei, payload){
		super();
	
		this._socket = new net.Socket();
		this.imei = imei;
		console.log("in constructor payload ", payload)
		this.payload = payload;
		this.raw_content = null
		
	}
	init(){
	
		let _payload = this.payload;
		let _imei = this.imei;
		let sock = this._socket;
		let _this = this;
		this._socket.connect(10800, "12.47.179.12", function(){
			console.log("connected ");
			console.log('payload = ', _payload)
			let mt_message = makeMTMessage(_imei, _payload)
			_this.raw_content = Buffer.from(mt_message).toString('hex');
			console.log("before sock write = ", mt_message)
			sock.write(Buffer.from(mt_message))

		})
		this._socket.on('data', function(data) {
			console.log('Received: ' + data.toString('hex').match(/../g).join(' '));
			_this.emit("data", data)
			//this._socket.destroy(); // kill client after server's response
		});

		this._socket.on('close', function() {
			console.log('Connection closed');
			_this.emit('close')
		});
		this._socket.on('error', function(err){
			console.log("connect err = ", err);
			_this.emit('error', err)
		})
		this._socket.on('timeout', ()=>{
			console.log("time out !!")
			_this.emit('timeout');
		})
		// this._setListeners(()=>{

		// 	console.log("listen end")
		// })
		
	}

	// 에러 생기면 실패응답 리턴
	// 클로즈는 언제 되는가? 보내고 받고 자동으로 되나 코드 만들어서 해야되나?



	_setListeners(callback){
		//12.47.179.12
		
		
		//callback();
		
	}

}


export {
	SendMessage
}