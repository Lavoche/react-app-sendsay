import React, { Component } from 'react';
import './login.css';
import Logo from "../logo";
import { email }  from 'is_js';
import { Icon } from "react-icons-kit";
import { mehO } from 'react-icons-kit/fa'
import SpinnerButton from "../spinner/spinner-button";

export default class Login extends Component {

    state = {
        form:{
            login: {
                caption:'Логин',
                type: 'text',
                placeholder: 'iamyourlogin@domain.xyz',
                extra:'',
                value:'',
                validation: {
                    isValid: true,
                    required: true,
                    mask: /^[a-zA-Z0-9@_\\.]+$/
                }
            },
            sublogin: {
                caption:'Сублогин',
                type: 'text',
                placeholder: 'sublogin-could-be-here',
                extra:'Опционально',
                value:'',
                validation: {
                    isValid: true,
                    required: false,
                    mask: /^.+$/
                }
            },
            password: {
                caption:'Пароль',
                type: 'password',
                placeholder: '••••••••••••••••••••••',
                extra:'',
                value:'',
                validation: {
                    isValid: true,
                    required: true,
                    mask: /^[^а-яА-Я]+$/
                }
            }
        }
    }



    submitHandler = (e) => {
        e.preventDefault();
        const { setAuth } = this.props;
        const { login, sublogin, password } = this.state.form;

        if (this.validateControl(login.value, password.value))
            setAuth(login.value, sublogin.value, password.value);
    }

    validateControl(loginCheck, passwordCheck) {

        const isValidLogin = (email(loginCheck) || /^[a-zA-Z0-9_]+$/.test(loginCheck)) && loginCheck!=='';
        const isValidPassword = passwordCheck!=='';
        const isValid = isValidLogin && isValidPassword;
        if (isValid) return true;
        const { login , password } = { ...this.state.form }
        const newForm = {
            ...this.state.form,
            login: {
                ...login,
                validation: {
                    ...login.validation,
                    isValid: isValidLogin
                }
            },
            password: {
                ...password,
                validation: {
                    ...password.validation,
                    isValid: isValidPassword
                }
            }
        }
        this.setState({
            form: newForm
        })
        return false;
    }

    onValueChange = ({target}) => {

        const { name, value } = target;
        const newForm = { ...this.state.form };
        const { mask, required } = newForm[name].validation;
        const isEmpty = value.trimLeft()==='';

        newForm[name] = {
            ...newForm[name],
            value,
            validation: {
                ...newForm[name].validation,
                isValid: !isEmpty || !required
            }
        };
        if (mask.test(value) || isEmpty) {
            this.setState({
                form:newForm
            })
        }
    }

    inputs() {
        return Object.keys(this.state.form).map((name, index) => {
            const { caption, extra, type, placeholder, value, validation} = this.state.form[name];

            const styleInput = validation.isValid   ? "form__input"
                                                    : "form__input form__input_valid_error";

            return (
                <div className='form__frame' key={index}>
                    <label className='form__caption'>
                        {caption}
                    </label>
                    <span className='form__caption form__caption_size_sm'>{extra}</span>
                   <input  className={styleInput}
                           type={type}
                           placeholder={placeholder}
                           name={name}
                           value={value}
                           onChange={this.onValueChange}
                    />
                </div>
            )
        })
    }

    render() {
        const { isLoginError, messageError, isLoginSpinner } = this.props.param;

        const { form } = this.state;

        const { login, sublogin, password } = form;

        const boxError = isLoginError ? (
            <div className="form__boxError">
                <div className="form__blockError">
                    <p><Icon
                        icon={mehO}
                        size={30}
                    /><span className="form__blockError_margin_10">Вход не вышел</span></p>
                    <span className="form__blockError_size_sm">{messageError}</span>
                </div>
            </div>
        ) : null;

        const textButton = isLoginSpinner ? <SpinnerButton /> : <span>Войти</span>
        const buttonDisabled =  !(login.validation.isValid &&
                                sublogin.validation.isValid &&
                                password.validation.isValid);
        return (
            <React.Fragment>
                <Logo
                    place="login"
                />
                <div className="login">
                    <form
                        className="form"
                        onSubmit={this.submitHandler}
                    >
                        <label className="form__label">API-консолька</label>
                        { boxError }

                        { this.inputs() }
                        <div className="form__frame">
                            <button
                                className="form__submit"
                                type="submit"
                                disabled={buttonDisabled}
                            >
                                { textButton }
                            </button>
                        </div>
                    </form>
                    <div className="myLink">
                        <a href="https://github.com/Lavoche" className="footer__link" target="_blank" rel="noopener noreferrer"> github.com/Lavoche </a>
                    </div>
                </div>


            </React.Fragment>
        )
    }
}
