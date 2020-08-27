import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import Button from "@material-ui/core/Button";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import MenuItem from "@material-ui/core/MenuItem";
import {Calendar} from "react-calendar";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ChromePicker } from 'react-color';

class Update<%-typeName%> extends Component{
    constructor(props) {
        super(props)
        this.state = {...this.props.location.state<%-relationsFields%>}
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
        if(<%-checkArrayFields%>){
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
            if(<%-checkBooleanFields%>){
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
        this.onUpdate(this.state)
        change["redirect"] = "/<%-typeNamePlural%>"
        toast("Update !");
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

    <%-initOtherEntities%>


    render() {
        <%-baliseForMultipleSelect%>

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
            <%-listOfValidators%>
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: 15 }}>Update</Button>
        </ValidatorForm>
        </div>
    );
    }


}

export default Update<%-typeName%>
