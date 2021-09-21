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
    if (dirNames.includes(k)){_%>
        const <%-k %> = {
            name : "<%- k %>" ,
            type : "<%- resolvers[k].type %>" ,
            resolve : <%-resolvers[k].resolve%>
        }
    <%}%>
    
<%}%>
module.exports ={<%= dirNames.filter(dir => !schemaDirectives.includes(dir) ) %>}