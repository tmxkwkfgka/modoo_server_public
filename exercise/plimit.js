//import { timeout, TimeoutError } from 'promise-timeout';
const timeout = require('promise-timeout').timeout;
const TimeoutError = require('promise-timeout').TimeoutError

var _promise = function(){
    return new Promise((resolve, reject)=>{
        setTimeout(function(){
            resolve("완료")

        }, 3000)
    })
}
    
function bb(){
    return _promise()
    .then((text)=>{
        return "Gdgdg"
    })
}

let aa = bb();


