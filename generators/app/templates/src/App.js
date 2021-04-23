import React, {Component} from 'react';
import { connect } from 'react-redux'
import { Route, Redirect, BrowserRouter as Router } from 'react-router-dom'
import { Button } from '@material-ui/core';
import './index.css';
import { Nav, NavDropdown } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
import Dropdown from "react-bootstrap/Dropdown";
import { clearSession } from './actions/session'
import cognitoUtils from './lib/cognitoUtils'
import Callback from './components/Callback';

<%-routerImports %>


const mapStateToProps = state => {
  return {
    isLoggedIn: state.isLoggedIn
  }
}

const mapDispatchToState = dispatch => {
  return {
    clearSession: () => dispatch(clearSession())
  }
}

const dropDownLinkStyle = {
  background: 'white',
  color: 'black',
};

const PrivateRoute = ({ component: Component, isLoggedIn, ...rest }) => (
  <Route {...rest} render={(props) => (
    isLoggedIn
      ? <Component {...props} />
      : <Redirect to='/' />
  )} />
)

class App extends Component {

  constructor(props) {
    super(props)
    this.clearSession = this.props.clearSession.bind(this)
  }

  handleClick(e) {
    e.preventDefault()
    this.clearSession()
    cognitoUtils.signOutCognitoSession()
  }

  render() {
    return (
      <Router>
        <div className="nav-container">
          <Nav className="justify-content-center" variant="pills" activeKey="1" >
            <Nav.Item>
              <Nav.Link eventKey="2" href="/">
                Home
				</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="2" href="/Tables">
                Tables
				</Nav.Link>
            </Nav.Item>
            <NavDropdown id="nav-dropdown" title="Models">
              <%-linksTypes%>

			</NavDropdown>
      {this.props.isLoggedIn
							? <Button onClick={(e) => this.handleClick(e)} variant="outlined" color="secondary">Log Out</Button>
							: <Button href={cognitoUtils.getCognitoSignInUri()} color="primary" variant="contained">Sign in</Button>
						}
          </Nav>
        </div>

        <div className="route-container">
          <Route exact path="/" component={ConnectHome} />
          <PrivateRoute path="/Tables" isLoggedIn={this.props.isLoggedIn} component={AppHTTP} />
          <Route path="/callback" component={Callback} />

          <%-routesTypes%>
    </div>
      </Router>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToState)(App);

