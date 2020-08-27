import { connect } from 'react-redux'
import Create<%-typeName%> from '../components/Create<%-typeName%>'
import { <%-typeNameLower%>Add } from '../actions'

// mapStateToProps : used to descripbe how to transform the current Redux store state into the props to pass to the presentional component
const mapStateToProps = state => {
    return {
        <%-stateFieldRelation%>
        // <%-typeNameLowerPlural%>: state.<%-typeNamePlural%>
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAdd: (<%-typeNameLower%>) => {
            dispatch(<%-typeNameLower%>Add(<%-typeNameLower%>))
        }
    }
}

const ConnectCreate<%-typeName%> = connect(mapStateToProps, mapDispatchToProps)(Create<%-typeName%>)

export default ConnectCreate<%-typeName%>
