import React from 'react';
import './history-dropdown.css';

const HistoryDropdown = ({ param, deleteHisItem, doHisItem, setClipboard }) => {

    return (
        <div className="history__dropdown" style={param}>
            <ul className="list-group">
                <li
                    className="list-item list-item_color_blue"
                    onClick={()=>doHisItem(true)}
                >
                    <span>Выполнить</span>
                </li>
                <li
                    className="list-item list-item_color_blue"
                    onClick={setClipboard}
                ><span>Скопировать</span></li>
                <li className="list-separator"></li>
                <li
                    className="list-item list-item_color_red"
                    onClick={deleteHisItem}
                ><span>Удалить</span></li>
            </ul>
        </div>
    )
}

export default HistoryDropdown;