import React, { useEffect } from 'react';
import './main-editor.css';
import { Icon } from "react-icons-kit";
import { ic_more_vert } from "react-icons-kit/md";

const editResize = React.createRef();

let paramResize = null;

const MainEditor = ({ onChangeValue, paramEditors, paramLogin }) => {

    const { login, sublogin } = paramLogin;

    useEffect(() => {
        const ratio = localStorage.getItem(`ratio_${login}_${sublogin}`);
        editResize.current.style.flexBasis = ratio || "50%"
    },[login, sublogin]);

    const { toSend, toReceive } = paramEditors;

    const classEditorToSend = toSend.isValid ? "editor__area"
                                            : "editor__area editor__area_error";
    const classEditorToReceive = toReceive.isValid ? "editor__area"
                                                    : "editor__area editor__area_error";
    const classLabelToSend = toSend.isValid ? "editor__label"
                                            : "editor__label editor__label_error";
    const classLabelToReceive = toReceive.isValid ? "editor__label"
                                            : "editor__label editor__label_error";
    return (
        <div className="editor">
            <div
                className="editor__fields"
                onMouseMove={(e) => resizeListener(e)}
                onMouseUp={() => setRatio(login, sublogin)}
            >
                <div className="editor__block editor__send" ref={editResize}>
                    <span className={classLabelToSend}>Запрос:</span>
                    <textarea
                        onChange={(e)=>onChangeValue({error: null, plainText: e.target.value})}
                        value={toSend.valueText}
                        className={classEditorToSend}
                    />
                </div>
                <div
                    className="editor__resize"
                    onMouseDown={(e)=> {
                        const flexBasis = parseInt(getComputedStyle(document.getElementsByClassName("editor__send")[0]).flexBasis);
                        paramResize = flexBasis/e.pageX;
                    }}
                >
                    <Icon
                        className="icon-points icon-points_cursor_resize"
                        icon={ic_more_vert}
                        size={30}
                    />
                </div>
                <div className="editor__block editor__reсeive">
                    <span className={classLabelToReceive}>Ответ:</span>
                    <textarea
                        className={classEditorToReceive}
                        value={toReceive.valueText}
                        readOnly
                    />
                </div>
            </div>
        </div>
    );
}

const resizeListener = (e) => {
    if (paramResize) {
        const newFlexBasis = e.pageX * paramResize;
        if (newFlexBasis>10 && newFlexBasis<90)
            editResize.current.style.flexBasis = `${newFlexBasis}%`;
    }
}

const setRatio = (login, sublogin) => {
    const ratio = getComputedStyle(document.getElementsByClassName("editor__send")[0]).flexBasis;
    localStorage.setItem(`ratio_${login}_${sublogin}`, ratio);
    paramResize = null;
}

export default MainEditor;