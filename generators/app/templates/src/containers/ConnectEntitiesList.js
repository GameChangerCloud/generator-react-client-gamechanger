import { connect } from 'react-redux'
import <%-typeNamePlural%>List from '../components/<%-typeNamePlural%>List'
import { <%-typeNameLower%>Delete, <%-typeNameLower%>Load } from '../actions'

// mapStateToProps : used to descripbe how to transform the current Redux store state into the props to pass to the presentional component
const mapStateToProps = state => {
  return {
    <%-typeNameLowerPlural%>: state.<%-typeNamePlural%>
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLoad: (id) => {
      dispatch(<%-typeNameLower%>Load(id))
  },
      onDelete: (id) => {
          dispatch(<%-typeNameLower%>Delete(id))
      }
  }
}

const ConnectEmployesList = connect(mapStateToProps, mapDispatchToProps)(<%-typeNamePlural%>List)

export default ConnectEmployesList