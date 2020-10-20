import { GraphQLSchema, GraphQLScalarType } from "graphql";
import { Kind } from 'graphql/language';
import { makeExecutableSchema } from "graphql-tools";
import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import path from "path";
import { GraphQLUpload } from 'graphql-upload'


const allTypes: GraphQLSchema[] = fileLoader(
  path.join(__dirname, "./api/**/*.graphql")
);

const allResolvers: string[] = fileLoader(
  path.join(__dirname, "./api/**/*.resolvers.*")
);

const mergedTypes = mergeTypes(allTypes);
const mergedResolvers = mergeResolvers(allResolvers);

const dateScalarType =new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue : (value) => {
      //console.log("parsevalue  = ", value)
      return new Date(value); // value from the client
    },
    serialize : (value) => {
      //console.log("parsevalue  = ", value)
      return value.getTime(); // value sent to the client
    },
    parseLiteral: (ast) => {
      console.log("ast  = ", ast)
      if (ast.kind === Kind.INT || ast.kind == Kind.STRING) {
        //console.log("parsevalue  = ", ast.value)
        return new Date(ast.value) // ast value is always in string format
      }
      return null;
    }
  })

  mergedResolvers["Date"] = dateScalarType
  mergedResolvers["Upload"] = GraphQLUpload
  console.log("merge resolvers = ")
  console.log(mergedResolvers)
  console.log("mergedTypes = ")
  console.log(mergedTypes)
  
  
const schema = makeExecutableSchema({
  typeDefs: mergedTypes,
  resolvers: mergedResolvers
});
//dfdfdfd
export default schema;
