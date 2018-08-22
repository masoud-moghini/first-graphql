const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
}=graphql
const _ = require('lodash');


const UserType = new GraphQLObjectType({
    name:"User",
    fields:{
        id:{type:GraphQLString},
        firstName:{type:GraphQLString},
        age:{type:GraphQLInt}
    }
})
const RootQuery = new GraphQLObjectType({
    name:"RootQueryType",
    fields:{
        user:{
            type:UserType,
            args:{
                id:{
                    type:GraphQLString
                }
            },
            resolve(parentValue,args){
                return users.find((user)=>{return user.id == args.id})
            }
        }
    }
})

module.exports=new GraphQLSchema({
    query:RootQuery
})

users = [
    {id:'23',firstName:'John',age:35},
    {id:'42',firstName:'Mike',age:95}
]