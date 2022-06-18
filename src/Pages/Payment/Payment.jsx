import { useEffect } from "react";
import { useState } from '@hookstate/core';
import { useParams } from "react-router-dom";
import { Container, Text, Box, Button, Center } from "@chakra-ui/react";
import { Alert, AlertIcon } from '@chakra-ui/react';
import Footer from "../../Components/Footer/Footer";
import Header from '../../Components/Header/Header';
import Logo from "../../Assets/powerstrip.png";

const Payment = () => {

    // ! useParams hook
    const { id } = useParams("");

    // ! States
    const duration = useState(0);
    const inactivity = useState(0);
    const time = useState(0);
    const cost = useState(0);
    const paymentError = useState();

    const costPerSecond = 0.011111111111;

    // ! Environment variables
    const token = process.env.REACT_APP_TOKEN;
    const baseUrl = process.env.REACT_APP_BASE_URL;

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    // ! useEffect hook
    useEffect(() => {
        fetch(`${baseUrl}/v1/api/transactions/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            duration.set(result.stop.totalDurationSecs);
            inactivity.set(result.stop.totalInactivitySecs);
            time.set(duration.get());
            cost.set(duration.get()*costPerSecond);
            console.log(cost.get());
        })
        .catch((err) => {
            console.log(err);
        })
    },[])

    // ! Razorpay payment

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    async function displayRazorpay() {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            paymentError.set("Razorpay SDK failed to load. Are you online?");
            return;
        }

        // ! creating a new order
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          redirect: 'follow'
        };

        const result = await fetch("http://api.powerstrip.in/v1/api/powerstrip/payment/order", requestOptions);

        if (!result) {
            paymentError.set("Server error. Are you online?");
            return;
        }

        // ! Getting the order details back
        const { amount, id: order_id, currency } = result.data;

        const options = {
            key: "rzp_test_r6FiJfddJh76SI", // ! Enter the Key ID generated from the Dashboard
            amount: amount.toString(),
            currency: currency,
            name: "Powerstrip Technologies",
            description: "",
            image: { Logo },
            order_id: order_id,
            handler: async function (response) {
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                };

                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                
                var payData = {
                  method: 'POST',
                  headers: myHeaders,
                  body: data,
                  redirect: 'follow'
                };

                const result = await fetch("http://api.powerstrip.in/v1/api/powerstrip/payment/success", payData)

                // alert(result.data.msg);
            },
            prefill: {
                name: "",
                email: "",
                contact: "",
            },
            notes: {
                address: "",
            },
            theme: {
                color: "#61dafb",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }

    return (
        <Container maxW="container.xl" pb="4">

            <Header title="Make Payment"/>

            <Text ml="4" mt="22px" fontSize="24px" fontWeight="normal">
            Time : {Math.floor(time.get()/3600) + "hr" + " " + Math.floor((time.get()%3600)/60) + "min" + " " + ((time.get()%3600)%60)%60 + "sec"}
            </Text>

            <Text ml="4" fontSize="24px" fontWeight="normal">
            Pay INR {Math.round(cost.get() * 100) / 100}
            </Text>

            <Center mx="4" mt="14px">
            <Button onClick={ displayRazorpay } 
            w="100%" h="48px" bg="#0057FF" borderRadius="md"
            colorScheme="#0057FF" color="#FFFFFF">
                <Text fontSize="20px" mr="29px">
                    Continue to Payment
                </Text>
                <Box w="69px" h="20px" pt="0.5" px="1" 
                fontSize="12px" bg="#E3FCFF" color="#000000"
                borderRadius="4px">
                    Razorpay
                </Box>
            </Button>
            </Center>

            { paymentError.get() &&
            <Alert mt="10" status='error'>
            <AlertIcon />
            There was an error processing your request
            </Alert>}

            <Box position="fixed" bottom="37px">
            <Footer/>
            </Box>

        </Container>
    );
}
 
export default Payment;