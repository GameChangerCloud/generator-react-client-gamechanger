import { connect } from 'react-redux'
import Update<%-typeName%> from '../components/Update<%-typeName%>'
import {<%-typeNameLower%>Update} from '../actions'

const mapStateToProps = state => {
    return {
        <%-stateFieldRelation%>
        // employes: state.Employes
    }
}


const mapDispatchToProps = dispatch => {
    return {
        onUpdate: (<%-typeNameLower%>) => {
            dispatch(<%-typeNameLower%>Update(<%-typeNameLower%>))
        }
    }
}

const ConnectUpdate<%-typeName%> = connect(mapStateToProps, mapDispatchToProps)(Update<%-typeName%>)

export default ConnectUpdate<%-typeName%>
