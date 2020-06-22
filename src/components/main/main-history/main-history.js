import React from 'react';
import './main-history.css';
import { Icon } from "react-icons-kit";
import { ic_more_vert, ic_clear } from "react-icons-kit/md";


const MainHistory = ({hisItem, statusDropdown, cleanHistory, doHisItem}) => {

    const hisBlock = React.createRef();

    const hisListItem = hisItem.map(({isValid, action, id, value, isSwitchToCopy})=> {
        const styleItem = isValid ? "history__status history__status_color_green"
            : "history__status history__status_color_red"
        let styleToast = isSwitchToCopy ? {
            visibility:"visible",
            transition: "1.5s",
            transitionTimingFunction: "ease-in",
            top: "-10px",
            opacity: "0"
        } : null;

        return (
            <li
                className="history__list-item"
                key={id}
                onClick={()=>doHisItem(false,id)}
            >
                <span className={styleItem}/>
                <span className="history__text">{action}</span>
                <Icon
                    className="icon-points"
                    icon={ic_more_vert}
                    size={30}
                    onClick={(e)=>{
                        e.stopPropagation();
                        const X = e.pageX < 140 ? 140 : e.pageX;
                        statusDropdown({
                            visibility: "visible",
                            left: X,
                            top: hisBlock.current.clientHeight,
                            id,
                            valueItem: value
                        });
                    }}
                />
                <span
                    className="history__toast"
                    style={styleToast}
                >
                    Скопировано
                </span>



            </li>
        )
    });

    return (
        <div className="history">

            <ul
                className="history__list-group"
                ref={hisBlock}
                onWheel={(e)=>{
                    const delta = e.deltaY || e.detail || e.wheelDelta;
                    hisBlock.current.scrollLeft += delta*15;
                }}
            >
                {hisListItem}
            </ul>
            <div className="history__gradient"/>
            <div
                className="history__clean"
                onClick={cleanHistory}
                title="Очистить историю"
            >
                <Icon
                    icon={ic_clear}
                    size={35}
                />
            </div>
        </div>
    )
}

export default MainHistory;