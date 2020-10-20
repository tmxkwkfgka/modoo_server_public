import User from "../../../entities/User";
import {
  SignUpMutationArgs,
  SignUpResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import createJWT from "../../../utils/createJWT";
import cleanUndefinedArgs from "../../../utils/cleanUndefinedArgs";



const resolvers: Resolvers = {
  Mutation: {
    SignUp: async (
      _,
      args: SignUpMutationArgs,
      context
    ): Promise<SignUpResponse> => {

      const {userid, role, firstName, lastName, email, password, phoneNumber, customerParentId, assetParentId} = args;
      const cleanUndefined = cleanUndefinedArgs(args, ["customerParentId", "assetParentId"])

      //let parentUser = undefined;
      let user = context.req.user;


      try {
        const existingUser = await User.findOne({ userid });
        if (existingUser) {
          return {
            ok: false,
            error: "same id exist",
            token: null,
            newUser: existingUser
          };
        } else {

          if(!context.req.user){
            return {
              ok: false,
              error: "You should log in instead",
              token: null,
              newUser: null
            };
            //throw new Error("No JWT. I refuse to proceed");
          }else if(user.role == "administrator"){
            //admin이 customer가입시킬때는 agentid를 인자로 받아서 그놈을 parent 로 해야함
            if(role == "agent"){
              const newUser =  User.create({ ...cleanUndefined, parentUser: user, issuerUser: user });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
              await newUser.save();
              const token = createJWT(newUser.id);
              return {
                ok: true,
                error: null,
                token,
                newUser
              };
            }else if(role == "customer"){

              let customerParent =  customerParentId?  await User.findOne({where: {id: customerParentId}}) : null
              if(customerParent && customerParent.role == "agent"){
                const newUser =  User.create({ ...cleanUndefined, parentUser: customerParent, issuerUser: user });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                await newUser.save();
                const token = createJWT(newUser.id);
                return {
                  ok: true,
                  error: null,
                  token,
                  newUser
                };
              }else{
                return {
                  ok: false,
                  error: "no mapped customerParent or role is not a agent",
                  token: null,
                  newUser: null
                }
              }
             

            }else if(role == "asset" ){
              let assetParent =  assetParentId?  await User.findOne({where: {id: assetParentId}}) : null
              if(assetParent && assetParent.role == "customer"){
                const newUser =  User.create({...cleanUndefined, parentUser: assetParent, issuerUser: user });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                await newUser.save();
                const token = createJWT(newUser.id);
                return {
                  ok: true,
                  error: null,
                  token,
                  newUser
                };
              }else{
                return {
                  ok: false,
                  error: "no mapped assetParent or role is not a customer",
                  token: null,
                  newUser: null
                }
              }

            }else{
              return {
                ok: false,
                error: "no auth to sign up for " + role,
                token: null,
                newUser: null
              };
            }
            
          }else if(user.role == "agent"){
            
            if(role == "customer"){
               
              const newUser =  User.create({...cleanUndefined, parentUser: user, issuerUser: user });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
              await newUser.save();
              const token = createJWT(newUser.id);
              return {
                ok: true,
                error: null,
                token,
                newUser
              };
    
            }else if(role == "asset"){
              const assetParent = await User.findOne({where:{id: assetParentId}})
              if(assetParent && assetParent.role == "customer"){
                const newUser =  User.create({...cleanUndefined, parentUser: assetParent, issuerUser: user});
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                await newUser.save();
                const token = createJWT(newUser.id);
                return {
                  ok: true,
                  error: null,
                  token,
                  newUser
                };

              }else{
                return {
                  ok: false,
                  error: "no matched assetparent or role is not a customer",
                  token: null,
                  newUser: null
                };
                
              }
             
    
            }else{
              return {
                ok: false,
                error: "no auth to sign up for" + role,
                token: null,
                newUser:null
              };
    
            }
          }else if(user.role == "customer"){
            //parentUser = user;
            return {
              ok: false,
              error: "no auth to sign up for" + role,
              token: null,
              newUser:null
            };
          }else{
            return {
              ok: false,
              error: "no auth to sign up for" + role,
              token: null,
              newUser:null
            };

          }
         
          //현재사용된 유저 확인 로그인된 놈이 마스터이면 걍 create 권한없는 놈이 로그인 됐으면 안됌, 마스터가 선주 가입시키는것은 걍되고 하위 id 없음
          //만약 선주가 로그인되어서 회원가입 시킬때 새로운 회원의 하위 id는 로그인된 선주
          // if(context.req.user.role != "user1"){
          //   // 오너가 아닌 선원이나 선원가족은 가입시 하나의 whichi 단말기 정보를 가지게 된다.
          //   // if(!args.uwpipeid){
          //   //   return {
          //   //     ok: false,
          //   //     error: "imei is required",
          //   //     token: null
          //   //   }
          //   // }
            
          //   //const relatedWhichi = await Whichi.find({ id: uwpipeid})
          //   const relatedWhichis = await getConnection().createQueryBuilder(Whichi, "whichi")
          //   .where("whichi.id IN (:ids)", {ids: uwpipeid})
          //   .getMany();
          //   const newUser = User.create({ userid, role, firstName, lastName, email, password, phoneNumber, uwpipe: relatedWhichis , parentUser });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
          //   await newUser.save();
          //   const token = createJWT(newUser.id);
          //   return {
          //     ok: true,
          //     error: null,
          //     token
          //   };

          // }else{

          //     const { userid, role, firstName, lastName, email, password, phoneNumber} = args;
          //    const newUser = await User.create({ userid, role, firstName, lastName, email, password, phoneNumber}).save();
          //    const token = createJWT(newUser.id);
          //    return {
          //      ok: true,
          //      error: null,
          //      token
          //    };
          // }

         
     
          
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null,
          newUser:null
        };
      }
    }
  }
};



export default resolvers;
