import React, { Component } from 'react';
import './main.css';
import FullScreen from "react-full-screen";
import MainHeader from "./main-header";
import MainHistory from "./main-history";
import MainEditor from "./main-editor";
import HistoryDropdown from "./main-history/history-dropdown";
import MainFooter from "./main-footer";


export  default class Main extends Component{

    state = {
        isFull: false,
        hisItem:[],
        paramDropdown:{
            visibility: "hidden",
            top: 5,
            left: 500,
            id: '',
            valueItem:''
        },
    }

    setFullscreen = () => {
        this.setState({ isFull: !this.state.isFull });
    }

    componentDidMount() {
        const { login, sublogin } = this.props;
        let hisItem = localStorage.getItem(`hisItem_${login}_${sublogin}`);
        hisItem = hisItem ? JSON.parse(hisItem) : [];
        this.setState({
            hisItem
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        const prevTimestamp = prevProps.editors.toReceive.timestamp;
        const { timestamp, isValid}  = this.props.editors.toReceive;


        const { value, valueText } = this.props.editors.toSend;
        if ((prevTimestamp !== timestamp) && value['action']) {
            this.updateHisItem(timestamp, isValid, value['action'], valueText);
        }
    }

    updateHisItem = (id, isValid, action, value) => {
        const { login, sublogin } = this.props;
        const newHisItem = {
            id,
            isValid,
            action,
            value,
            isSwitchToCopy: false
        }
        this.setState(({hisItem}) => {
            const idx = hisItem.findIndex((el) => el.action===action);
            const newArray = idx === -1     ? [newHisItem, ...hisItem].slice(0, 20)
                                            : [newHisItem, ...hisItem.slice(0, idx), ...hisItem.slice(idx+1)].slice(0, 20)
            localStorage.setItem(`hisItem_${login}_${sublogin}`, JSON.stringify(newArray));
            return {
                hisItem: newArray
            }
        });
    }

    doHisItem = (isExecute, id = this.state.paramDropdown.id) => {
        const idx = this.state.hisItem.findIndex((el) => el.id===id);
        this.props.executeHisItem(isExecute, this.state.hisItem[idx].value);
    }

    deleteHisItem = () => {
        const id = this.state.paramDropdown.id;
        const { login, sublogin } = this.props;

        this.setState(({hisItem}) => {
            const idx = hisItem.findIndex((el) => el.id===id);
            const newArray = [
                ...hisItem.slice(0, idx),
                ...hisItem.slice(idx+1)
            ]
            localStorage.setItem(`hisItem_${login}_${sublogin}`, JSON.stringify(newArray));
            return {
                hisItem: newArray
            }
        })
    }

    statusDropdown = (param) => {
        this.setState({
            paramDropdown: param
        })
    }

    cleanHistory = () => {
        const { login, sublogin } = this.props;
        localStorage.removeItem(`hisItem_${login}_${sublogin}`);
        this.setState({
            hisItem:[]
        })
    }

    setClipboard = () => {

        navigator.clipboard.writeText(this.state.paramDropdown.valueItem)
            .then(() => {
                this.setState(({hisItem})=> {
                    const id = this.state.paramDropdown.id;
                    const newArray = [...hisItem].map((el)=>{
                        return {
                            ...el,
                            isSwitchToCopy: el.id===id
                        }
                    });
                    return {
                        hisItem: newArray
                    }
                })
            })
            .catch(() => {
                this.setState(({hisItem})=> {
                    const newArray = [...hisItem].map((el)=>{
                        return {
                            ...el,
                            isSwitchToCopy: false
                        }
                    });
                    return {
                        hisItem: newArray
                    }
                })
            });



    }


    render() {

        const {isFull, hisItem, paramDropdown } = this.state;
        const { onSendToServer, onChangeValue, editors, onLogout, paramLogin, setFormat} = this.props;

        return (
            <FullScreen
                enabled={isFull}
                onChange={isFull => this.setState({isFull})}
            >
                <div
                    className="main"
                    onClick={()=>{
                        if (paramDropdown.visibility==="visible"){
                            const t = {...paramDropdown, visibility: "hidden"};
                            this.setState({
                                paramDropdown: t
                            })
                        }
                     }}
                >
                    <MainHeader
                        setFullscreen={this.setFullscreen}
                        isFull={isFull}
                        onLogout={onLogout}
                        paramLogin={paramLogin}
                    />
                    <MainHistory
                        hisItem={hisItem}
                        statusDropdown={this.statusDropdown}
                        cleanHistory={this.cleanHistory}
                        doHisItem={this.doHisItem}
                    />
                    <MainEditor
                        onChangeValue={onChangeValue}
                        paramEditors={editors}
                        paramLogin={this.props.paramLogin}
                    />
                    <MainFooter
                        buttonDisabled={!editors.toSend.isValid}
                        onSendToServer={onSendToServer}
                        setFormat={setFormat}
                        mark={{isEmpty: editors.toSend.valueText==='', mark: editors.toReceive.timestamp}}
                    />
                <HistoryDropdown
                    param={paramDropdown}
                    deleteHisItem={this.deleteHisItem}
                    doHisItem={this.doHisItem}
                    setClipboard={this.setClipboard}
                />
                </div>
            </FullScreen>
        )
    }
}