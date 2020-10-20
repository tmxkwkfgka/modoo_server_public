import { SelectQueryBuilder } from "typeorm";
//import Message from "../entities/Message";

const addingJoin = (repository: SelectQueryBuilder<any>, joinArgsArr: [[string, string]]): SelectQueryBuilder<any> => {
    
    if(joinArgsArr.length > 0){
        repository = joinArgsArr.reduce((accu, cur, curindex, array)=>{
            //console.log(cur)
            //console.log(accu)
            return accu.leftJoinAndSelect(cur[0], cur[1]);
        }, repository)

        return repository;
    }else{
        return repository;
    }
    
};
  
  export default addingJoin;
  