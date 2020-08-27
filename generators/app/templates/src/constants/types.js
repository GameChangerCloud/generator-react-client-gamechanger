<%typesName.forEach(typeName => {%>
<%if(!scalarsName.includes(typeName)){%>export const <%-typeName%> = "<%-typeName%>"<%}%><%})%>