import React, { Component } from 'react';
import Sendsay from "sendsay-api";
import 'isomorphic-fetch';
import './app.css';
import Login from "../login";
import Main from "../main";
import Cookies from 'universal-cookie';
import { formatJsonString, isJsonString } from '../../service/json-lib'
import SpinnerLoading from "../spinner/spinner-loading";
import ErrorIndicator from "../error-indicator";

export default class App extends Component {

    state = {
        login: {
            status: false,
            login:'',
            sublogin:'',
            isLoginError: false,
            messageError:''
        },
        hasError:false,
        isReady:false,
        editors: {
            toSend:{
                value:{},
                valueText:'',
                isValid: true,
                timestamp:"0"
            },
            toReceive:{
                value:{},
                valueText:'',
                isValid: true,
                timestamp:"0"
            }
        },
        isLoginSpinner: false
    }

    sendsay = new Sendsay();
    cookies = new Cookies();

    setAuth = (loginAuth, subloginAuth, passwd) => {

        this.setState({
            isLoginSpinner: true
        })

        this.sendsay.performRequest({
            action: 'login',
            login: loginAuth,
            sublogin: subloginAuth,
            passwd,
        }).then(({ session, login,  sublogin}) => {
            this.sendsay.setSession(session);
            if (!subloginAuth)  sublogin=null;
            this.cookies.set('sendsay_session', {session, loginSession: login, subloginSession: sublogin});
            this.setState(()=> {
                const newLogin = {
                    status: true,
                    login,
                    sublogin,
                    isLoginError: false,
                    messageError:''
                }
                return {
                    login:newLogin,
                    isReady: true,
                    isLoginSpinner: false
                }
            })
        }).catch(({ id,  explain}) => {
            this.setStatusLoginError(id, explain);
        });
    }

    setStatusLoginError = (id, explain)  => {
        this.setState( ({ login }) => {
            const newLogin = {
                ...login,
                isLoginError: true,
                messageError: `{id:"${id}", explain:"${explain}"}`
            }
            return {
                login: newLogin,
                isLoginSpinner: false
            }
        })
    }

    executeHisItem = (isExecute, valueText) => {
        this.setState(({editors}) => {
            const newEditors = {
                ...editors,
                toSend: {
                    ...editors.toSend,
                    value: JSON.parse(valueText),
                    valueText: formatJsonString(valueText),
                    isValid: true
                }
            };
            return {
                editors: newEditors
            }
        }, ()=>{
            return isExecute ? this.onSendToServer(valueText) : null;
        });
    }

    onSendToServer = (valueText = this.state.editors.toSend.valueText) => {
        if (!valueText) return;
        const value = JSON.parse(valueText);
        this.sendsay.request(value)
            .then((res) => {
                const textRes = formatJsonString(JSON.stringify(res));
                this.updateEditors ('receive', true, textRes, res)
            })
            .catch((e) => {
                const { id, explain } = e;
                if (explain === 'expired') {
                    return this.onLogout(true, `{id:"${id}", explain:"${explain}"}`);
                }
                const textError = e.toString().indexOf('Failed to fetch')===-1
                                                    ? formatJsonString(JSON.stringify(e))
                                                    : e.toString();

                this.updateEditors ('receive', false, textError, e)
            })
    }

    onLogout = (isLoginError= false, messageError = '') => {
        this.sendsay.request(
            {"action" : "logout"}
        ).then(()=> {
            this.cookies.remove('sendsay_session');

            this.setState(() => {
                const newEditors = {
                                    toSend:{
                                        value:{},
                                        isValid: true,
                                        timestamp:"0"
                                    },
                                    toReceive:{
                                        value:{},
                                        isValid: true,
                                        timestamp:"0"
                                    }
                                };
                const newLogin = {
                    status: false,
                    login:'',
                    sublogin:'',
                    isLoginError,
                    messageError
                }
                return {
                    login:newLogin,
                    isError:false,
                    isReady:true,
                    editors: newEditors
                }
            })
        })
    }

    componentDidMount() {
        const { cookies , sendsay } = this;
        const sendaySession = cookies.get('sendsay_session');
        if (sendaySession) {
            const { session, loginSession, subloginSession  } = sendaySession;
            sendsay.setSession(session);
            sendsay.request({
                action: 'sys.settings.get',
                list: ['about.id']
            }).then(()=>{
                this.setState(({login})=> {
                    const newLogin = {
                        ...login,
                        login: loginSession,
                        sublogin: subloginSession,
                        status: true
                    }
                    return {
                        login:newLogin,
                        isReady: true
                    }
                })
            }).catch((e)=>{
                if (e.explain==='expired') {
                    this.setState( ({login}) => {
                        const newLogin = {
                            ...login,
                            isLoginError: true,
                            messageError: `{id:"${e.id}", explain:"${e.explain}"}`
                        }
                        this.cookies.remove('sendsay_session');
                        return {
                            login: newLogin,
                            isReady: true
                        }
                    })
                }
                else {
                    this.setState({
                        hasError: true
                    })
                }
            });
        }
        else {
            this.setState( () => {
                const newLogin = {
                    status: false,
                    login:'',
                    sublogin:'',
                    isLoginError: false,
                    messageError:''

                }
                return {
                    login: newLogin,
                    isReady: true
                }
            })
        }

    }

    onChangeValue = ({ error, plainText }) => {

        if (!plainText || plainText.trim()==='') return this.updateEditors('send',true);
        if (error) {
            this.updateEditors('send', false);
        }
        else {
            const newValue = isJsonString(plainText);
            if (newValue)
                this.updateEditors('send',true, plainText, newValue);
            else
                this.updateEditors('send',false, plainText);
        }
    }

    updateEditors = (type, isValid, valueText= '', value = {}) => {

        const name = type === 'send' ? 'toSend' : 'toReceive'

        const toValue= {
            value,
            valueText,
            isValid,
            timestamp: Date.now().toString()
        }
        const editors = {...this.state.editors, [name]: toValue};
        this.setState({
            editors
        })

    }

    setFormat = () =>{
        this.setState(({editors})=>{
            const newEditors ={
                toSend: {
                    ...editors.toSend,
                    valueText: formatJsonString(editors.toSend.valueText)
                },
                toReceive: {
                    ...editors.toReceive,
                    valueText: formatJsonString(editors.toReceive.valueText)
                }
            }
            return {
                editors: newEditors
            }
        });
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            hasError:true
        });
    }

    render() {
        const { isReady, editors, isLoginSpinner, hasError } = this.state;
        const { status, login, sublogin,  isLoginError, messageError} = this.state.login;

        const formLogin = (!status && isReady) ? <Login
                                                    setAuth={this.setAuth}
                                                    param={{ isLoginError, messageError, isLoginSpinner }}
                                                />
                                            : null;
        const main = (status && isReady) ? <Main
                                                onSendToServer={this.onSendToServer}
                                                onChangeValue={this.onChangeValue}
                                                executeHisItem={this.executeHisItem}
                                                editors={editors}
                                                onLogout={this.onLogout}
                                                paramLogin={{ login, sublogin }}
                                                setFormat={this.setFormat}
                                            />
                                        : null;
        const loading = !isReady && !hasError? <SpinnerLoading />
                                : null;

        const error = hasError? <ErrorIndicator />
                                : null;
        return (
            <React.Fragment>
                { formLogin }
                { main }
                { loading }
                { error }
            </React.Fragment>
        );
    }
}