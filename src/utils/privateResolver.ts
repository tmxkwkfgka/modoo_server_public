const privateResolver = resolverFunction => async (
  parent,
  args,
  context,
  info
) => {
  // if (!context.req.user) {
  //   throw new Error("No JWT. I refuse to proceed");
  // }

  const user = context.req.user;
  //여기서 회원 레벨관리d
  // console.log("private resolver args = ")
  // console.log('parent = ')
  // console.log(parent)
  // console.log('args = ')
  // console.log(args)
  // console.log('context = ')
  // console.log(context)
  // console.log('info = ')
  // console.log(info)
  const fieldName = info.fieldName;
  // switch(fieldName){
  //   case 'AddTxDistress':                       // Messages
  //     if(["asset"].includes(user.role))  return new Error("no auth");
  //     break;
  //   case 'AddTxIOPort':
  //     if(["asset"].includes(user.role))  return new Error("no auth");
  //     break;
  //   case 'AddTxMessage':
  //     if(["asset"].includes(user.role))  return new Error("no auth");
  //     break;
  //   case 'AddTxPoll':
  //     if(["asset"].includes(user.role))  return new Error("no auth");
  //     break;
  //   case 'AddTxReport':
  //     if(["asset"].includes(user.role))  return new Error("no auth");
  //     break;
  //   case 'AddTxReportSet':
  //     if(["asset"].includes(user.role))  return new Error("no auth");
  //     break;
  //   case 'AddTxReport':
  //     if(["asset"].includes(user.role))  return new Error("no auth");
  //     break;
  //   case 'GetMessages' :
  //     if(["asset"].includes(user.role))  return new Error("no auth");
  //     break;
  //   case 'AddPlace':     // place       이것은 따로 설정 필요없음 하지만 모든 api 보여줄려고 일단 넣음
  //     break;
  //   case 'DeletePlace':
  //     break;
  //   case 'EditPlace':
  //     break;
  //   case 'GetDailyDistance':
  //     break;
  //   case 'GetManyPlaces':
  //     break;
  //   case 'GetMyPlaces':
  //     break;
  //   case 'AddWhichi':         //Whichi
  //     break;
  //   case 'AddWhichiGroup':
  //     break;
  //   case 'AddWhichiToUser':         
  //     break;
  //   case 'DelWhichiGroup':
  //     break;
  //   case 'DelWhichiToUser':
  //     break;
  //   case 'EditWhichi':
  //     if(["asset"].includes(user.role))  return new Error("no auth");
  //     break;
  //   case 'EditWhichiGroup':
  //     if(["asset"].includes(user.role))  return new Error("no auth");
  //     break;
  //   case 'GetMyWhichiGroup':
  //     break;
  //   case 'GetUsersWhichis':
  //     break;
  //   case 'GetWhichis':
  //     break;
    
  // }
  

  const resolved = await resolverFunction(parent, args, context, info);
  return resolved;
};



export default privateResolver;
