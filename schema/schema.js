const graphql = require('graphql');
const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull
}=graphql
const _ = require('lodash');

const CompanyType = new GraphQLObjectType({
    name:"Company",
    fields:()=>({
        id:{type:GraphQLString},
        name:{type:GraphQLString},
        description:{type:GraphQLString},
        users:{
            type:new GraphQLList(UserType),
            resolve(parentValue,args){
                console.log(args)
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                    .then(resp=>resp.data)
            }
        }
    })
})


const UserType = new GraphQLObjectType({
    name:"User",
    fields:()=>({
        id:{type:GraphQLString},
        firstName:{type:GraphQLString},
        age:{type:GraphQLInt},
        company:{
            type:CompanyType,
            resolve(parentValue,args){
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then(res=>res.data)
            }
        }
    })
})

const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addUser:{
            type:UserType,
            args:{
                firstName:{type:new GraphQLNonNull(GraphQLString)},
                age:{type:new GraphQLNonNull(GraphQLInt)},
                companyId:{type:GraphQLString}
            },
            resolve(parentValue,{firstName,age}){
                return axios.post("http://localhost:3000/users",{firstName,age})
                    .then(resp=>resp.data)
            }
        },
        deleteUser:{
            type:UserType,
            args:{
                id:{type:GraphQLString}
            },
            resolve(parentValue,args){
                console.log(`${JSON.stringify(args) }`)
                return axios.delete(`http://localhost:3000/users/${args.id}`)
                    .then(res=>res.data)
            }
        },
        editUser:{
            type:UserType,
            args:{
                id:{type:GraphQLString},
                firstName:{type:GraphQLString},
                age:{type:GraphQLInt},
                companyId:{type:GraphQLString}
            },
            resolve(parentValue,{id,firstName,age,companyId}){
                console.log(id);
                return axios.patch(`http://localhost:3000/users/${id}`,{firstName,age,companyId})
                    .then(resp=>resp.data)
            }
        }
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
                //return users.find((user)=>{return user.id == args.id})
                console.log(`${args.id}`)
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(resp=>resp.data)
            }
        },
        company:{
            type:CompanyType,
            args:{
                id:{
                    type:GraphQLString
                }
            },
            resolve(parentValue,args){
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                    .then(resp=>resp.data)
            }
        }
    }
})

module.exports=new GraphQLSchema({
    query:RootQuery,
    mutation
})

users = [
    {id:'23',firstName:'John',age:35},
    {id:'42',firstName:'Mike',age:95}
]