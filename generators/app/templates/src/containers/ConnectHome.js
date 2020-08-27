import { connect, } from 'react-redux'
import Home from '../components/Home.js'
import {<%typesName.forEach(typeName => {%><%if(!scalarsName.includes(typeName)){%><%-typeName.toLowerCase()%>Load, <%}%><%})%>} from '../actions'

const mapStateToProps = state => {
  return {
    session: state.session,
    isLoggedIn: state.isLoggedIn
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLoad: () => {
      <%typesName.forEach(typeName => {%><%if(!scalarsName.includes(typeName)){%>
        dispatch(<%-typeName.toLowerCase()%>Load())<%}%><%})%>
    },
   
  }
}

const ConnectHome = connect(mapStateToProps, mapDispatchToProps)(Home)

export default ConnectHome