<%const resolvers = {
    selector : {
        name : "selector",
        type: "perform",
        resolve: function (field) {
            return field
        }
    }
}%>




<% for (k in resolvers){ 
    if (dirNames.includes(k) ){_%>
        const <%-k %> = {
            name : "<%- k %>" ,
            type : "<%- resolvers[k].type %>" ,
            resolve : <%-resolvers[k].resolve%>
        }
    <%}%>
    
<%}%>
<% let resolversList =[]
for (k in resolvers){ 
    if (dirNames.includes(k) ){
        resolversList.push(k)
    }
}%>
module.exports ={<%for (k in resolversList){ %><%if(k != 0){%>,<%}%><%-resolversList[k]%><%}%>}