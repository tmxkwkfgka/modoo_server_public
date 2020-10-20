import { SelectQueryBuilder } from "typeorm";
//import Message from "../entities/Message";

const addingWhere = (repository: SelectQueryBuilder<any>, whereArrArgs: [[any, any]]): SelectQueryBuilder<any> => {
    
    if(whereArrArgs.length > 0){
        repository = whereArrArgs.reduce((accu, cur, curindex, array)=>{

            if(curindex == 0)
                return accu.where(cur[0], cur[1]);
            else
                return accu.andWhere(cur[0], cur[1])

        }, repository)

        return repository;
    }else{
        return repository;
    }
    
};
  
  export default addingWhere;
  