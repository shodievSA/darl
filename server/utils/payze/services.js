require("dotenv").config();

async function createPayment(props) {

    const { amount, source } = props;

    const res = await fetch("https://payze.io/v2/api/payment",
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${process.env.PAYZE_API_KEY}:${process.env.PAYZE_API_SECRET}`
            },
            body: JSON.stringify({
                source: source,
                amount: amount,
                currency: "USD",
                hooks: {
                    webhookGateway: "http://localhost:3000/api/v1/payze-webhook-gateway",
                    successRedirectGateway: "http://localhost:3000/payze-payment-success",
                    errorRedirectGateway: "http://localhost:3000/repositories"
                },
                cardPayment: {
                    preauthorize: false
                }
            })
        }
    );

    const paymentDetails = await res.json();
    
    return paymentDetails.data;

}

async function getPayment(props) {

    const { transactionID } = props;

    const res = await fetch(
        `https://payze.io/v2/api/payment/query/token-based?$filter=TransactionId eq '${transactionID}'`,
        {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `${process.env.PAYZE_API_KEY}:${process.env.PAYZE_API_SECRET}`
            },
        }
    );

    const data = await res.json();

    return data.data.value[0];

}

const payzeServices = {
    createPayment,
    getPayment
}

module.exports = payzeServices;