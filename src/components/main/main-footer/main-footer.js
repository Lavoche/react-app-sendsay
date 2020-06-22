import React, { useEffect, useState } from 'react';
import './main-footer.css';
import SpinnerButton from "../../spinner/spinner-button";


const MainFooter = ({buttonDisabled, onSendToServer, setFormat, mark}) => {

    const [textButton, setTextButton ] = useState('Отправить');

    useEffect(()=>{
           setTextButton('Отправить');
    },[mark.mark]);

    return (
        <div className="footer">
            <div className="footer__block">
                <button type="button"
                        className="footer__btn"
                        onClick={() => {
                            !mark.isEmpty && setTextButton(<SpinnerButton />);
                            onSendToServer();
                        }}
                        disabled={buttonDisabled}
                >
                    {textButton}
                </button>
            </div>
            <div className="footer__block footer__block_align_center">
                <a href="https://github.com/Lavoche" className="footer__link" target="_blank" rel="noopener noreferrer"> github.com/Lavoche </a>
            </div>
            <div className="footer__block">
                <span
                    className="footer__format"
                    onClick={setFormat}
                >
                    <i className="footer__format-icon"/>
                    <span className="footer__format-text">Форматировать</span>
                </span>
            </div>
        </div>
    )
}

export default MainFooter;