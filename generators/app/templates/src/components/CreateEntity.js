import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import Button from "@material-ui/core/Button";
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const directiveResolvers = require('../utils/<%= typeName.toLowerCase() %>DirectiveResolvers')

class Create<%-typeName%> extends Component{
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.location.state.id ? this.props.location.state.id : 0,
    <%- include('../partials/initFieldsState.ejs',{type: currentType, scalars: scalars}) _%>
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onAdd = this.props.onAdd.bind(this);


    }

    getAllFieldNames(){
        return [<% fields.forEach(field => {%> "<%-field.name%>", <%}); %>]
            
        
    }

    onChangeDate(e, name) {
        let change = {}
        change[name] = this.formatDate(e)
        this.setState(change )
    }

    onChangeColor(e, name, type) {
        let change = {}
        switch(type){
            case "HexColorCode":
                change[name] = e.hex
                break
            case "RGB":
            case "RGBA":
                change[name] = e.rgb            
                break
            case "HSL":
            case "HSLA":
                change[name] = e.hsl    
                break
            default:
            break
        }
        this.setState(change)
    }

    handleChange(e){
        let change = {}
        if(<%- include('../partials/checkArrayFields.ejs',{type: currentType, scalars: scalars}) _%>){
            let tmp = this.state[e.target.name]
            const index = tmp.indexOf(e.target.value);
            if(index > -1){
                tmp.splice(index, 1)
            }
            else {
                tmp.push(e.target.value)
            }
            change[e.target.name] = tmp
        }
        else {
            if(<%- include('../partials/checkBooleanFields.ejs',{type: currentType}) _%>){
                change[e.target.name] = e.target.value === 'true';
            }
            else{
                change[e.target.name] = e.target.value
            }
        }
        this.setState(change)
    }

    handleSubmit(e){
        let change = {}
        // TODO
        // CREATE REQUEST
        this.onAdd(this.state)
        change["redirect"] = "/<%-typeNamePlural%>"
        toast("Create !");
        this.setState(change)
    }

    isPresent(name, field){
        if(!this.state[field])
            return false
        return this.state[field].indexOf(name) !== -1
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    <%- include('../partials/initOtherEntities.ejs',{type: currentType, scalars: scalars}) _%>

    
    render() {
        <%- include('../partials/baliseForMultipleSelect.ejs',{type: currentType, scalars: scalars}) _%>

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <div className="form">
            <h1 className="center">New <%-typeName%></h1>
        <ValidatorForm
        ref="form"
        onSubmit={this.handleSubmit}
            >
            
            <%- include('../partials/listOfValidators.ejs',{type: currentType, scalars: scalars, types: types, directives: directives}) _%>
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: 15 }}>Create</Button>
        </ValidatorForm>
        </div>
    );
    }


}

export default Create<%-typeName%>
