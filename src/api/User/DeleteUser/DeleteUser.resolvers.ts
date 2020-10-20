import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import {
    DeleteUserResponse,
    DeleteUserMutationArgs
} from "../../../types/graph";

const resolvers: Resolvers = {
  Mutation: {
    DeleteUser: privateResolver(async (_, args: DeleteUserMutationArgs, { req }): Promise<DeleteUserResponse> => {
      const { user } = req;
      const { userid } = args;
      const myrole = user.role;
      

      try{
        let deletedUser = await User.findOne({
            where: {id: userid},
            relations: ['usersAsUser', "usersMade"]
        })

        

        if(deletedUser){

            const deletedUserRole = deletedUser.role;
            if(myrole == "administrator"){
                
            }else if(myrole == "agent"){
                if(deletedUserRole == "customer" || deletedUserRole == "asset"){

                }else{
                    return {
                        ok: false,
                        error: "no auth to delete",
                      
                    } 
                }
    
            }else{
                return {
                    ok: false,
                    error: "no auth to delete",
                   
                }
            }


            //const usersMade = deletedUser.usersMade;
            
            const updateResult = await User.update({issuerUser: deletedUser}, {issuerUser: null});

            console.log('update result = ', updateResult)
            


            const deleteResult = await deletedUser.remove()
            console.log("delete user result = ", deleteResult)
//             POST /graphql 200 314.131 ms - 6671
// token= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTcxNzQwMDI3fQ.UMh5ksGqYN5hfs2ntwTDhhmEUVotjQDLJcqdp-mGzpM
// delete user result =  User {
//   id: undefined,
//   userid: 'customer1',
//   email: 'kag@abc.com',
//   verifiedEmail: false,
//   firstName: 'kag',
//   lastName: 'james',
//   role: 'customer',
//   age: null,
//   password: '$2b$10$BvLKRM0jhppdekMc7K5byOEqZjJiIaxepcYJCkgi4R/2nEhYGiHkm',
//   phoneNumber: '01033330000',
//   verifiedPhoneNumber: false,
//   profilePhoto: null,
//   fbId: null,
//   createdAt: 2019-12-11T04:38:30.664Z,
//   updatedAt: 2019-12-11T04:38:30.664Z
// }

            return {
              ok: true,
              error: null,
            
            };

        }else{
            return {
                ok: false,
                error: "no mapped user",
              
            }
        }
       

      }catch(err){
        return {
            ok: false,
            error: err,
            
          };
      }
    })
  }
};
export default resolvers;
