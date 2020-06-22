import React from 'react';
import './main-header.css';
import Logo from "../../logo";
import {Icon} from "react-icons-kit";
import {logout} from "react-icons-kit/ikons";
import {ic_fullscreen, ic_fullscreen_exit} from "react-icons-kit/md";

const MainHeader = ({setFullscreen, isFull, onLogout, paramLogin}) => {

    const { login, sublogin } = paramLogin;

    return (
        <div className="header">
            <div className="header__left">
                <Logo
                    place="main"
                />
                <span className="header__label">API-консолька</span>
            </div>

            <div className="header__right">
                <div className="header__info">
                    <span className="header__text">{login} : {sublogin}</span>
                </div>
                <div
                    className="header__action"
                    onClick={()=>onLogout()}
                >
                    <span className="header__text">Выход</span>
                    <Icon
                        icon={logout}
                        size={30}
                    />
                </div>
                <div
                    className="header__action"
                    onClick={setFullscreen}
                >
                <Icon
                    icon={isFull ? ic_fullscreen_exit : ic_fullscreen}
                    size={30}
                />
                </div>
            </div>
        </div>
    )
}

export default MainHeader;