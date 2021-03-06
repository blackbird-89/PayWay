import React, { useContext, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, TextInput, Button } from 'react-materialize';
import useLoginForm from "./UseLoginFormHook";
import { UserContext } from '../../AuthUserContext';

import MessageComponent from '../Message/MessageComponent';


const LoginPage = () => {
    //use user from UserContext
    // if user exists in context, app navigates to mainPage
    const { user, keepAuthUser } = useContext(UserContext);
    const [showMessage, setShowMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorText, setErrorText] = useState('');

    const handleMessageUnmount = () => {
        setShowMessage(false);
        setShowErrorMessage(false);
    }

    const onShowErrorMessage = (text) => {
        setShowMessage(true);
        setShowErrorMessage(true);
        setErrorText(text);
    }

    const onLogin = async () => {
        try {
            const login = {
                email: inputs.email,
                password: inputs.password
            }
            const response = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify(login),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = { response: await response.json(), status: response.status };
            if (result.status === 200) {
                keepAuthUser(result.response);
            }
            else {
                if (result.response.errorCode === "wrongPwd") {
                    onShowErrorMessage(result.response.error);
                }
                if (result.response.errorCode === "inactivated") {
                    onShowErrorMessage(result.response.error);
                }
                if (result.response.errorCode === "notFound") {
                    onShowErrorMessage(result.response.error);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const { inputs, handleInputChange, handleSubmit } = useLoginForm(onLogin);

    const onResetPassword = async () => {
        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                body: JSON.stringify({ email: inputs.email }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setShowMessage(true);
            } else {
                onShowErrorMessage(`That didn't work! Are you sure you entered the correct email?`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    return (

        <React.Fragment>
            {user ? <Redirect to='/' /> : null}
            <Row>
                <Col className='content'>
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit} l={12} className="form">
                        <TextInput className="form-control" name="email" onChange={handleInputChange} value={inputs.email} label="Email" email={true} s={12} l={12} required />
                        <TextInput className="form-control" name="password" onChange={handleInputChange} value={inputs.password} label="Password" password={true} s={12} l={12} required />
                        <Button node="button" s={12} l={12} type="button" flat className="forgot-your-pwd" title="Click me to reset password!" onClick={onResetPassword}>Forgot your password?</Button>
                        <Col s={12} l={12} style={{ marginTop: '20px' }}>
                            <Button className="login-btn" waves="light" style={{ width: '100%' }} >
                                login
                        </Button>
                        </Col>

                    </form>
                    <Col s={12} l={12} style={{ marginTop: '20px' }}>
                        <Button flat={true} className="register-link-btn raised-btn" style={{ width: '100%' }} waves="light" >
                            <Link to="/register">Register account</Link>
                        </Button>
                    </Col>
                </Col>
            </Row>
            {showMessage ? <MessageComponent
                success={!showErrorMessage ? true : false}
                text={!showErrorMessage ? [`New password has been send to ${inputs.email}`, `Check your mailbox.`] : [errorText]}
                unmountMe={handleMessageUnmount}
            />
                : null}
        </React.Fragment >
    );
}

export default LoginPage;