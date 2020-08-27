import React, { Component } from 'react'
import Button from "@material-ui/core/Button";
import {APIurl} from '../constants'
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Spinner from "react-bootstrap/Spinner";
import { connect } from 'react-redux'

const endpoint = APIurl

const mapStateToProps = state => {
    return {
        session: state.session,
    }
}

class AppHTTP extends Component {

    constructor(props){
        super(props)
        this.session = props.session
    }   

    initTable(session) {
        let xhr = new XMLHttpRequest()
        let t = toast.info(<div>Init tables ... <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </Spinner>
        </div>, {autoClose: false})

        xhr.addEventListener('load', () => {
            toast.update(t, {
                render: xhr.responseText,
                type: toast.TYPE.SUCCESS,
                autoClose: 5000
            });

        })
        xhr.open('POST', endpoint)
        xhr.setRequestHeader("Authorization", session.credentials.idToken)
        xhr.send(JSON.stringify({initTable: "ok"}))
    }

    cleanTable(session) {
        let xhr = new XMLHttpRequest()

        let t = toast.info(<div>Clean tables ... <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </Spinner>
        </div>, {autoClose: false})
        xhr.addEventListener('load', () => {
            toast.update(t, {
                render: xhr.responseText,
                type: toast.TYPE.SUCCESS,
                autoClose: 5000
            });
        })
        xhr.open('POST', endpoint)
        xhr.setRequestHeader("Authorization", session.credentials.idToken)
        xhr.send(JSON.stringify({cleanTables: "ok"}))
    }

    dropTable(session) {
        let xhr = new XMLHttpRequest()
        let t = toast.info(<div>Drop tables ... <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </Spinner>
        </div>, {autoClose: false})
        xhr.addEventListener('load', () => {
            toast.update(t, {
                render: xhr.responseText,
                type: toast.TYPE.SUCCESS,
                autoClose: 5000
            });
        })
        xhr.open('POST', endpoint)
        xhr.setRequestHeader("Authorization", session.credentials.idToken)
        xhr.send(JSON.stringify({dropTables: "ok"}))
    }

    checkTable(session) {
        let xhr = new XMLHttpRequest()
        let t = toast.info(<div>Check tables ... <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </Spinner>
        </div>, {autoClose: false})
        xhr.addEventListener('load', () => {
            toast.update(t, {
                render: xhr.responseText,
                type: toast.TYPE.SUCCESS,
                autoClose: 5000
            });
        })
        xhr.open('POST', endpoint)
        xhr.setRequestHeader("Authorization", session.credentials.idToken)
        xhr.send(JSON.stringify({existTable: "ok"}))
    }

    fillTable(session) {
        let xhr = new XMLHttpRequest()
        let t = toast.info(<div>Fill tables ... <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </Spinner>
        </div>, {autoClose: false})
        xhr.addEventListener('load', () => {
            toast.update(t, {
                render: xhr.responseText,
                type: toast.TYPE.SUCCESS,
                autoClose: 5000
            });
        })
        xhr.open('POST', endpoint)
        xhr.setRequestHeader("Authorization", session.credentials.idToken)
        xhr.send(JSON.stringify({fillTable: "ok"}))
    }

    updateDatabase(session) {
        let xhr = new XMLHttpRequest()
        let t = toast.info(<div>Update tables ... <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </Spinner>
        </div>, {autoClose: false})
        xhr.addEventListener('load', () => {
            toast.update(t, {
                render: xhr.responseText,
                type: toast.TYPE.SUCCESS,
                autoClose: 5000
            });
        })
        xhr.open('POST', endpoint)
        xhr.setRequestHeader("Authorization", session.credentials.idToken)
        xhr.send(JSON.stringify({updateDatabase: "ok"}))
    }


    render() {
        if(!endpoint){

            return (<div className="form">
                <h1>Database management</h1>
                <i>If you see this message you need to put the API endpoint is in file src/components/Tables.js in
                    the endpoint const.</i>
            </div>)
        }
        else {
            return (

                <div class="form">
                    <h1>Database management</h1>
                    <div>
                        <p>You can click here for create tables in the database :</p>
                        <Button variant="contained" onClick={() => this.initTable(this.session)} color="primary">Init tables</Button>
                        <br/>
                        <br/>
                    </div>
                    <div>
                        <p>You can click here for fill tables with 5 fakes data in the database :</p>
                        <Button variant="contained" onClick={() => this.fillTable(this.session)} color="primary">Fill tables</Button>
                        <br/>
                        <br/>
                    </div>
                    <div>
                        <p>You can click here for clean tables :</p>
                        <Button variant="contained" onClick={() => this.cleanTable(this.session)} color="primary">Clean tables</Button>
                        <br/>
                        <br/>
                    </div>
                    <div>
                        <p>You can click here for drop tables :</p>
                        <Button variant="contained" onClick={() => this.dropTable(this.session)} color="primary">Drop tables</Button>
                        <br/>
                        <br/>
                    </div>
                    <div>
                        <p>You can click here for check tables in the database :</p>
                        <Button variant="contained" onClick={() => this.checkTable(this.session)} color="primary">Check tables</Button>
                        <br/>
                        <br/>
                    </div>
                    <div>
                        <p>You can click here for update your database :</p>
                        <Button variant="contained" onClick={() => this.updateDatabase(this.session)} color="primary">Update database</Button>
                        <br/>
                        <br/>
                    </div>

                </div>
            )
        }
    }
}

export default connect(mapStateToProps)(AppHTTP)
