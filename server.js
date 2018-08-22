const app = require('express')();
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

app.use("/graphql",expressGraphQL({
    schema,
    graphiql:true
}))



app.listen(3000,()=>{
    console.log('listening');
})