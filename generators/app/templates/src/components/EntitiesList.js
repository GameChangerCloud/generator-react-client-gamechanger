/** Display a list of entity of type <%-typeName%> */
import React, {useEffect} from 'react'
import MaterialTable from "material-table";
import { useHistory } from 'react-router-dom';
import Button from "@material-ui/core/Button";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const <%-typeNamePlural%>List = ({<%-typeNameLowerPlural%>, onDelete, onLoad, isLoading}) => {
		const history = useHistory();
		const styles = {
			marginTop: "20px",
			maxWidth: "90%",
			marginLeft: "auto",
			marginRight: "auto"
		}

		const constructArrayOfId = (array) => {
			if(array === undefined || array.length === 0){
				return ''
			}
			let s = '['
			for(let elt of array){
				if(elt && elt.id) {
					s += elt.id + ', '
				}
			}
			s = s.substring(0, s.lastIndexOf(','))
			s += ']'
			return s;
		}

		useEffect(() => {
			console.log('mount it!');
			if(!isLoading){ //Prevent loading when there's already an action (create, update, delete) occuring
				onLoad()
			}
	}, []);

		const handleUpdate = (rowData) => {
			history.push({
				pathname: '/Update<%-typeName%>',
				state: rowData

			})
		}

		const handleCreate = () => {
			history.push({
				pathname: '/Create<%-typeName%>',
				state: { id : <%-typeNameLowerPlural%>.length+1}

			})
		}

		return (
			<div style={styles}>
			<Button variant="contained" onClick={handleCreate} color="primary">Create <%-typeName%></Button>
			<br/>
			<br/>
			<MaterialTable
						columns={[ <%-columns%> ]}
	          data={<%-typeNameLowerPlural%>}
						title="List of <%-typeName%>"
						actions={[
								{
									icon: 'edit',
									tooltip: 'Edit <%-typeName%>',
									onClick: (event, rowData) => {
										handleUpdate(rowData)
									}
								},
								{
									icon: 'delete',
										tooltip: 'Delete <%-typeName%>',
									onClick: (event, rowData) => {
									if(window.confirm('Delete the <%-typeName%> #' + rowData.id + ' ?')){
										onDelete(rowData.id)
										toast("Delete !");
									}
								}
							}
						]}
						options={{
							rowStyle: {
								backgroundColor: '#EEE'
							},
							headerStyle: {
									backgroundColor:'#282c34',
									color: "white"
							}
						}}

	        />
				</div>
		)
	}

	export default <%-typeNamePlural%>List
