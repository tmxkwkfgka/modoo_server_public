const parse =  require("./parseHex.ts").parse;


let hexStr = "01004301001c4d8a08d6333030323334303130363039393930000dae00005e055ba603000b00254c367fe7fe00000003020013413f0005004000780080007800c00078000000"

let resultObj = parse(hexStr)

console.log(resultObj)


