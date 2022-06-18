import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Button, Text, Input, Spinner } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react';
  import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
  } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import Wallet from "../../Components/Wallet/Wallet";
import { nanoid } from 'nanoid';
import { useDisclosure } from '@chakra-ui/react';
import Logo from "../../Assets/powerstrip.png";
import useFetchJWTStatus from "../../Hooks/useFetchJWTStatus";   
import useFetchPaymentHistory from "../../Hooks/useFetchPaymentHistory";
import useFetchChargingHistory from "../../Hooks/useFetchChargingHistory";
import moment from "moment";
import { BiRupee } from "react-icons/bi";


const AddMoney = () => {

    // ! useNavigate
    const navigate = useNavigate();

    // ! get jwt status
    // const { data } = useFetchJWTStatus();
    // if(localStorage.getItem("powerstrip-user-token") && data) {
    //     if(localStorage.getItem("powerstrip-device-id")) {
    //         let deviceId = localStorage.getItem("powerstrip-device-id");
    //         if(data.customer.charge_session.id !== null) {
    //             navigate(`/charge-point/${deviceId}/session/${data.customer.charge_session_id}`);
    //          }
    //     }
    // }

    // ! get jwt status
    const {payHistory, failure} = useFetchPaymentHistory();

    // ! get jwt status
    const {chargeHistory, fail} = useFetchChargingHistory();

    //! API_URL variable
    let API_URL;

    //! Set API_URL based on env
        
    if(process.env.NODE_ENV !== 'production') {
        API_URL=process.env.REACT_APP_DEV_API_URL;
    }
    else{
        API_URL=process.env.REACT_APP_PROD_API_URL;
    }

    // ! useDisclosure hook from chakra UI
    const { isOpen, onOpen, onClose } = useDisclosure();

    // ! useToast
    const toast = useToast();

    // ! States
    const [amount, setAmount] = useState("");
    const [error, setError] = useState();
    const [loading, setLoading] = useState();
    const [chargeRate, setChargeRate] = useState(0);

    let uniqueId;
    let orderId;
    let finalAmount;

    useEffect(() => {
        // var myHeaders = new Headers();
        // myHeaders.append("Content-Type", "application/json");
        
        // var requestOptions = {
        //   method: 'GET',
        //   headers: myHeaders,
        //   redirect: 'follow'
        // };

        // fetch(`${API_URL}/device/${id}`, requestOptions)
        // .then(response => response.json())
        // .then((result) => {
        //     console.log("get charge rate");
        //     console.log(result);
        //     // ! set charge rate
        //     if(result.device) {
        //         if(result.device.charge_rate) {
        //             setChargeRate(result.device.charge_rate);
        //         }
        //         rate = result.device.charge_rate;
        //     }
        //     console.log("rate " + chargeRate + " " + result.device.charge_rate);
        // })
        // .catch(error => console.log('error', error));
    },[])

    // ! generate string to use in receipt id
    uniqueId = nanoid();

    // ! Function to handleSendDuration
    function handleSendDuration(e){
        e.preventDefault();
        setLoading(true);

        // post request to provide cost and order_id
        var myHeaders = new Headers();
        myHeaders.append("customerAuthToken", JSON.parse(localStorage.getItem("powerstrip-user-token")));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "amount": amount,
            "receipt": "receipt_"+uniqueId,
            "transaction_type": 2
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch(`${API_URL}/payment/pay`, requestOptions)
        .then(response => response.json())
        .then((result) => {
            orderId = result.payment.id;
            finalAmount = result.payment.amount;
            if(result.payment_completed === false){
                handleRazorpayPayment();
            }
            else{
                setLoading(false);
                setError("An error occured please try again.");
                onOpen();
            }
        })
        .catch((error) => {
            setLoading(false);
            console.log('error', error);
            setError("An error occured. Please try again.");
            onOpen();
        });
    }

    // ! Function to load razorpay script
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

    // ! Function to handle payment
    async function handleRazorpayPayment(){

        // ! Load razorpay script
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        // ! if razorpay script is not loaded show error
        if (!res) {
            setLoading(false);
            setError("Failed to process payment. Please try again.")
            onOpen();
            return;
        }

        // ! Getting the order details back

        const options = {
            key: process.env.REACT_APP_RAZORPAY_API_KEY, // ! Enter the Key ID generated from the Dashboard
            amount: finalAmount,
            currency: "INR",
            name: "Powerstrip Technologies",
            description: "",
            image: { Logo },
            order_id: orderId,
            handler: async function (response) {
                const data = {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                };

                var myHeaders = new Headers();
                myHeaders.append("customerAuthToken", JSON.parse(localStorage.getItem("powerstrip-user-token")));
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify(data);

                var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
                };

                fetch(`${API_URL}/payment/razorpay/verify`, requestOptions)
                .then(response => response.json())
                .then((result) => {
                    if(result.status === "success"){
                        setLoading(false);
                        toast({
                            title: 'Money added successfull.',
                            description: "Your can start charging your vehicle.",
                            status: 'success',
                            duration: 9000,
                            isClosable: true,
                        })
                        navigate(-1);
                    }
                    else{
                        setLoading(false);
                        setError("Payment verification failed.");
                        onOpen();
                    }
                })
                .catch((error) => {
                    console.log('error', error);
                    setError("A final error occured. Please try again.");
                    onOpen();
                });

            },
            prefill: {
                name: "",
                email: localStorage.getItem("powerstrip-user-email"),
                contact: localStorage.getItem("powerstrip-user-phone-number"),
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

    // ! reverse
    function getDate(s) {
        let str = s[8] + s[9] + "-" + s[5] + s[6];
        return str;
    }

    // ! get duration
    function getDuration(start, end) {
        let startTime = moment(start, 'HH:mm:ss');
        let endTime = moment(end, 'HH:mm:ss');
        let timeDiff;
        if(startTime > endTime) {
            timeDiff = startTime.diff(endTime, "minutes");
        }
        else {
            timeDiff = endTime.diff(startTime, "minutes");
        }
        return timeDiff;
    }

    // ! get cost
    function getCost(start, end, deviceId) {
        let startTime = moment(start, 'HH:mm:ss');
        let endTime = moment(end, 'HH:mm:ss');
        let timeDiff;
        if(startTime > endTime) {
            timeDiff = startTime.diff(endTime, "seconds");
        }
        else {
            timeDiff = endTime.diff(startTime, "seconds");
        }
        // return timeDiff;
        getChargeRate(deviceId);
        return ((timeDiff*chargeRate)/100).toFixed(0);
    }

    function getChargeRate(deviceId) {
        let rate;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        fetch(`${API_URL}/device/${deviceId}`, requestOptions)
        .then(response => response.json())
        .then((result) => {
            // ! set charge rate
            if(result.device) {
                if(result.device.charge_rate) {
                    setChargeRate(result.device.charge_rate);
                }
            }
        })
        .catch(error => console.log('error', error));
    }

    return (
        <Container maxW="container.sm" mb="10">
            {/* <Header/> */}

            <Box mt='20px'>
            <Wallet/>
            </Box>

            <Text mt="50px" color="#ffffff">Enter amount to add</Text>
            <Input onChange={(e) => setAmount(e.target.value)}
            type="text" color="#ffffff" size='lg' textAlign="center"
            borderColor="#ffffff" placeholder="e.g 500" 
            _placeholder={{ color: '#ffffff' }} />

            <Button onClick={handleSendDuration}
            mt="5" mb="4" type="submit" colorScheme='#0057FF' 
            bg="#0057FF" size='lg' color="#ffffff" w="100%" fontWeight="400">
                Add money
                {loading &&
                    <Spinner ml="4" />
                }
            </Button>

            {chargeHistory &&
            <Box>
            <Table variant='simple'>
                <TableCaption color="#ffffff" placement="top" textAlign="left">
                    Charging History
                </TableCaption>
                <Thead>
                    <Tr>
                    <Th color="#ffffff">Date</Th>
                    <Th color="#ffffff">Cost</Th>
                    <Th color="#ffffff">Time</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {chargeHistory.filter((data, idx) => idx < 5)
                    .map((data, key) => (
                        <Tr>
                            <Td color="#ffffff">{getDate(data.charge_start_time.substring(0,10))}</Td>
                            <Td color="green.300" display="flex">
                                <BiRupee/>
                                {getCost(data.charge_start_time && data.charge_start_time.substring(11), data.charge_end_time && data.charge_end_time.substring(11), data.device_id)}
                            </Td>
                            <Td color="green.300">{getDuration(data.charge_start_time && data.charge_start_time.substring(11), data.charge_end_time && data.charge_end_time.substring(11))} min</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            </Box>}

            <Modal isOpen={isOpen} onClose={onClose} size="xs" isCentered>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Error</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>{error}</Text>
                </ModalBody>

                <ModalFooter>
                    <Button w='100%' colorScheme='#0057FF' bg="#0057FF" 
                    mr={3} color="#ffffff" onClick={onClose}>
                    Close
                    </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>

        </Container>
    );
}
 
export default AddMoney;