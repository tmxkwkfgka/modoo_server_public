
import { GetUsersWhichisResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";



const resolvers: Resolvers = {
  Query: {
    GetUsersWhichis: privateResolver(
      async (_, args, { req }): Promise<GetUsersWhichisResponse> => {
        try {

            const user = req.user;
            //const {userid} =args;
           
         
            // const users : any = await getConnection()
            // .getRepository(User)
            // .createQueryBuilder("user")
            // .leftJoinAndSelect("user.uwpipe", "whichi")
            // .where("user.id IN(:userId)", {userId: user.id})
            // .getMany()

            // console.log("join whichis = ", users[0].uwpipe)
            
            // return {
            //     ok: true,
            //     error: null,
            //     whichis: users[0].uwpipe
            // }
             // relations: ["last_position", "last_message", "whichigroup", "messages", "messages.place"]

          if(user){
            //"uwpipe.messages", "uwpipe.messages.place",
            const usersWithRelation : any = await User.findOne(
            {
                where : {id : user.id},
                relations: ["uwpipe", "uwpipe.last_position", "uwpipe.last_message", "uwpipe.whichigroup", "usersAsUser", "usersAsUser.uwpipe",  "usersAsUser.uwpipe.last_message", "usersAsUser.uwpipe.last_position", "usersAsUser.uwpipe.whichigroup", "usersAsUser.usersAsUser", "usersAsUser.usersAsUser.uwpipe"]
            } 
            )
            
            if(user.role == "customer"){
              return {
                ok: true,
                error: null,
                whichis: usersWithRelation.usersAsUser.map((assetUser)=>assetUser.uwpipe[0]) 
              }
            }else{
              return {
                ok: true,
                error: null,
                whichis: usersWithRelation.uwpipe 
            }

            }

              

          }else{
             
              return {
                ok: false,
                error: "not valid user login",
                whichis: null
              }

          }
       
     
        } catch (error) {
            console.log(error);
          return {
            ok: false,
            error: error.message,
            whichis: null
          };
        }
      }
    )
  }
};
export default resolvers;
