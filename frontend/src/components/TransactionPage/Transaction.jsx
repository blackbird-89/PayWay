import React from "react";

const Transaction = (props) => {

    console.log(props, "props");

    const { contact, className, transaction } = props;

    console.log(transaction.date);
    let date = transaction.date;
    let newdate = date.slice(0, 10)
    console.log(newdate, "news");
    return (
        <div className={className}>
            <div className="symbol-transaction">{className === "incoming" ? `+` : `-`}</div>
            <div className="contacts">
                <p>{contact} </p>
                <p>{newdate}</p>
            </div>
            <div>
                {transaction.amount}
            </div>

        </div>
    );
};

export default Transaction;