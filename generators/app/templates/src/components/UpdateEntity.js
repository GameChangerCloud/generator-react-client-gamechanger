import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import { MenuItem } from '@mui/material';
import {ChromePicker} from 'react-color'
import Button from "@material-ui/core/Button";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

class Update<%-typeName%> extends Component{
    constructor(props) {
        super(props)
        this.state = {...this.props.location.state<%- include('../partials/relationFields.ejs',{currentType: currentType, scalars: scalars}) _%>}
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onUpdate = this.props.onUpdate.bind(this)


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
        // UPDATE REQUEST
        <%- include('../partials/resolveForQuery.ejs',{type: currentType, scalars: scalars}) _%>
        this.onUpdate(this.state)
        change["redirect"] = "/<%-typeNamePlural%>"
        toast("Update !");
        this.setState(change)
    }

    handleCancel(e){
        let change = {}
        change["redirect"] = "/<%-typeNamePlural%>"
        toast("Cancelled !");
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
            <h1 className="center">Update <%-typeName%> #{this.state.id}</h1>
        <ValidatorForm
        ref="form"
        onSubmit={this.handleSubmit}
            >
            <%- include('../partials/listOfValidators.ejs',{type: currentType, scalars: scalars, types: types, directives: directives}) _%>

        <Button type="submit" variant="contained" color="primary" style={{ marginTop: 15 }}>Update</Button>
        <Button onClick={(e) => this.handleCancel(e)} color="primary" style={{ marginTop: 15 }}>Cancel</Button>
        </ValidatorForm>
        </div>
    );
    }


}

export default Update<%-typeName%>
