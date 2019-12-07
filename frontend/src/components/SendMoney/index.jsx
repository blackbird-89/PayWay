import React, { useState, useEffect } from 'react';
import MessageComponent from '../Message/MessageComponent';
import { Button} from 'react-materialize';

const SendMoney = (props) => { 
    const [acceptSending, setAcceptSending] = useState(false);
    const [sendMoney, setSendMoney] = useState(false);
    const [stopMoney, setStopMoney] = useState({loading:true, loaded:false, status: null});
    const [recipientPhone, setRecipientPhone] = useState('');
    const [transactionAmount, setTransactionAmount] = useState(0);
    const [transactionMessage, setTransactionMessage] = useState('');

    const [showInvalidRecipientNotice, setShowInvalidRecipientNotice] = useState(false);
    const [showGenericErrorMessage, setShowGenericErrorMessage] = useState(false);

    const [transactionStatus, setTransactionStatus] = useState({ loading: false, loaded: false, error: false, status: null });

    //showMessage state and handleMessageUnmount are added to show and dismiss message
    const [showMMessage, setShowMessage] = useState(false);
    const handleMessageUnmount = () => {
        setShowMessage(false);
    }

    const { history } = props;

    

    // function to handle when form is submitted
    const handleSubmit = async (e) => {

        // prevent page reload on form submission
        e.preventDefault();

        if(acceptSending){
            sendMoney();
        }
        else if(e){
            setStopMoney({loading:false, loaded:false, status: null});
            setAcceptSending(false);
        }
        else {
            console.log('wait for a second')
        }

        // clear error status
        setShowGenericErrorMessage(false);

        // try to send money via API
        try {

            setTransactionStatus({ loading: true, loaded: false, error: false, status: null });

            const body = {
                recipient: recipientPhone || history.location.state.recipientPhone,
                amount: transactionAmount,
                message: transactionMessage,
            };
            // send a request to 'send money' endpoint
           
                
                // 
                const response = setTimeout(() => {
                setSendMoney(true)
                }, 5000);
                if (sendMoney){
            
            
                await fetch('/api/send-money', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                });

            }
            else {
                (setSendMoney(console.log('gatcha')))
            }


            setTransactionStatus({ loading: false, loaded: true, error: false, status: response.status });

            if (response.status === 404) {

                setShowInvalidRecipientNotice(true);

            } else if (response.ok) {

                // REDIRECT TO OR SHOW SUCCESS PAGE HERE
                setShowMessage(true);

            } else {

                setShowGenericErrorMessage(true);
                setAcceptSending(false);

            }

        } catch (error) {

            setTransactionStatus({ loading: false, loaded: true, error: error });

        }

    }
    
    // const [transactionStatusTimeOut, setTransactionStatusTimeOut] = useState(false);

    // useEffect(() =>{
    //     setTimeout(() => {
    //         setTransactionStatusTimeOut(setTransactionStatus);
    //     }, 5000);
    // }, []);

    const preloader = (
        <div className="row">
            <div className="col s12 m6">
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            </div>
        </div>
    );

    const genericErrorMessage = (
        <div className="row">
            <div className="col s12">
                <span>Something went wrong! Make sure that your account has suffiecent funds and try again.</span>
            </div>
        </div>
    );

    const { loading, error } = transactionStatus;

    if (error) {

        return (
            <div>
                Error in send-money: {error.toString()}
            </div>
        );
    }

    // i prefer typing props this way to have a cleaner html
    const recipientInputProps = {
        disabled: loading,
        placeholder: 'Enter phone number...',
        id: 'recipient-phone-number',
        type: 'tel',
        className: `validate${showInvalidRecipientNotice ? ' invalid' : ''}`,
        value: history.location.state ? history.location.state.recipientPhone : recipientPhone,
        onChange: e => {
            setRecipientPhone(e.target.value);

            // when user begins typing, set show invalid user notice to false
            setShowInvalidRecipientNotice(false);
        },
    };

    const amountInputProps = {
        disabled: loading,
        id: 'transaction-amount',
        type: 'number',
        className: 'validate',
        min: 1,
        step: 1,
        value: transactionAmount,
        onChange: e => setTransactionAmount(e.target.value),
    };

    const messageInputProps = {
        disabled: loading,
        id: 'transaction-message',
        className: 'materialize-textarea',
        value: transactionMessage,
        onChange: e => setTransactionMessage(e.target.value),
        maxLength: 50,
    }

    return (

        <div className="row">
            <form className="col" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="input-field col s12">
                        <input {...recipientInputProps} />
                        <label htmlFor="recipient-phone-number" className="active">Recipient</label>
                        {showInvalidRecipientNotice ? 'There is no recipient with this phone number' : ''}
                    </div>
                    <div className="input-field col s12">
                        <input {...amountInputProps} />
                        <label htmlFor="transaction-amount" className="active">Amount</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                        <textarea {...messageInputProps} />
                        <label htlmfor="transaction-message">Message</label>
                    </div>
                </div>

                <div className="row">
                    <div className="col s6">
                        <Button
                            disabled={loading}
                            className="waves-effect waves-light raised-btn btn w100"
                            type="button"
                            onClick={() => history.push('./')}
                        >
                            Cancel
                        </Button>
                    </div>

                    <div className="col s6">
                        <Button disabled={loading} className="btn w100 waves-effect waves-light" type="submit" name="action">Send
                            <i className="material-icons right">send</i>
                        </Button>
                    </div>
                </div>
                <div className="row ab-btn">
                    <div className="col s6 ">
                    <Button
                    disabled={undefined}
                     className="waves-effect waves-light raised-btn btn w100"
                     type="button"
                     onClick={() => setStopMoney()}
                     >
                         Abort
                         </Button>
                    </div>
                </div>
            </form>

            <div className="row">
                <div className="col s12 l3 offset-l4">
                    {loading ? preloader : null}

                    {showGenericErrorMessage ? genericErrorMessage : null}
                </div>
            </div>
            {showMMessage ? <MessageComponent
                success
                redirectTo="/"
                text={[`Congrats! You've just sent ${transactionAmount} coins`, `to recipient with phone number ${recipientPhone}`]}
                unmountMe={handleMessageUnmount}
            />
                : null}
        </div>
    );
}

export default SendMoney;