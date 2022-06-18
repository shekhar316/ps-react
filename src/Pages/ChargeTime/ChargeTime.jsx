import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Container, Text, Badge, Input, Button, Spinner, Center } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import Footer from "../../Components/Footer/Footer";
import Logo from "../../Assets/powerstrip-logo.webp";
import { useDisclosure } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import useFetchSessionStatus from "../../Hooks/useFetchSessionStatus";
import useFetchChargeTimeJWTStatus from "../../Hooks/useFetchChargeTimeJWTStatus";
import useFetchLocation from "../../Hooks/useFetchLocation";
import SplashScreen from "../../Components/SplashScreen/SplashScreen";
import { FaPlus, FaMinus } from "react-icons/fa";
import { BiRupee, BiCheck } from "react-icons/bi";
import useFetchSubscriptionStatus from "../../Hooks/useFetchSubscriptionStatus";



const ChargeTime = () => {

    // ! useParams hook
    const {id} = useParams();

    // !Using custom hook to fetch location and charge rate
    const { location, DEVICE_TYPE } = useFetchLocation(id);

    // !Using custom hook to fetch subscription status
    const { subscription, subscriptionValidity } = useFetchSubscriptionStatus(id);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // ! useNavigate hook
    const navigate = useNavigate();

    // ! get jwt status
    const { authStatus } = useFetchChargeTimeJWTStatus();

    // ! store device id
    localStorage.setItem("powerstrip-device-id", id);

    // !check if there is any active charging session
    const { data } = useFetchSessionStatus();
    if(localStorage.getItem("powerstrip-user-token") && data) {
        if(localStorage.getItem("powerstrip-device-id")) {
            let deviceId = localStorage.getItem("powerstrip-device-id");
            if(data.customer) {
                if(data.customer.charge_session) {
                    if(data.customer.charge_session.id !== null) {
                        navigate(`/charge-point/${deviceId}/session/${data.customer.charge_session.id}`);
                    }
                }
            }
        }
    }

    //! API_URL variable
    let API_URL;

    //! Set API_URL based on env
        
    if(process.env.NODE_ENV !== 'production') {
        API_URL=process.env.REACT_APP_DEV_API_URL;
    }
    else{
        API_URL=process.env.REACT_APP_PROD_API_URL;
    }

    // ! get current user
    let currentUser;
    if(localStorage.getItem("powerstrip-user-token")) {
        currentUser = authStatus;
    }
    else {
        currentUser = false;
    }

    // ! useToast
    const toast = useToast();

    // ! useDisclosure hook from chakra UI
    const { isOpen, onOpen, onClose } = useDisclosure();

    // ! States
    const [userPhoneNumber, setUserPhoneNumber] = useState("");
    const [duration, setDuration] = useState(60);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [disabledBtn, setDisabledBtn] = useState(true);
    const [amount, setAmount] = useState();
    const [chargeRate, setChargeRate] = useState("");
    const [chargeTimeError, setChargeTimeError] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [splashScreen, setSplashScreen] = useState(true);
    const [demoMode, setDemoMode] = useState(true);
    const [demoBtnText, setDemoBtnText] = useState("");
    const [privateBtnText, setPrivateBtnText] = useState("");
    const [publicBtnText, setPublicBtnText] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [basePrice, setBasePrice] = useState("");

    // ! variables
    let transactionType = 1;
    let cost;
    let uniqueId;
    let orderId;
    let finalAmount;

    // ! generate string to use in receipt id
    uniqueId = nanoid();

    // ! useEffect hook
    // let chargeRate;
    let rate;
    useEffect(() => {
        setDisabled(true);
        // ! proceed according to device type
        if(DEVICE_TYPE === "PUBLIC") {
            setPublicBtnText("Proceed");
        }
        else if(DEVICE_TYPE === "PRIVATE") {
            if(subscription === "error") {
                navigate(`/subscription/${id}`);
            }
            // ! getExpiryDateFormat function call
            getExpiryDateFormat(subscriptionValidity.substring(0,10));
            setPrivateBtnText("Proceed");
        }
        else {
            setDemoBtnText("Proceed");
        }

        // ! to show demo messsage to user only one time
        if(DEVICE_TYPE === "DEALER") {
            if(!localStorage.getItem("powerstrip-demo")) {
                onOpen();
                localStorage.setItem("powerstrip-demo", 1);
            }
        }

        // ! fetch charge rate
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        fetch(`${API_URL}/device/${id}`, requestOptions)
        .then(response => response.json())
        .then((result) => {
            // ! set charge rate
            if(result.device) {
                if(result.device.charge_rate) {
                    setChargeRate(result.device.charge_rate);
                }
                rate = result.device.charge_rate;
                setBasePrice(result.device.charge_rate);
            }
        })
        .catch(error => console.log('error', error));

        // ! fetch charge rate end

        if(duration < 5) {
            setChargeTimeError("Minimum charge time is 5 mins");
            setDisabled(true);
        }
        else if(duration > 600) {
            setChargeTimeError("Maximum charge time is 600 mins");
            setDisabled(true);
        }
        else {
            setChargeTimeError("");
            setDisabled(false);
        }

        setUserPhoneNumber(localStorage.getItem("powerstrip-user-phone-number"));
        if(duration > 60) {
            setAmount((duration * 60 * chargeRate)/100);
        }
        else {
            setAmount((60 * 60 * chargeRate)/100);
        }
        
        setTimeout(() => {
            setSplashScreen(false);
        },2000);

        setDisabled(false);
    },[amount, duration, chargeRate])


    // ! Set expiry date format
    function getExpiryDateFormat(subscriptionValidity) {
        let str = subscriptionValidity.substring(0,10);
        let date, month, year;
        if(str[8] === "0") {
            date = str[9];
        }
        else {
            date = str.substring(8,10);
        }

        if(str[5] === "0") {
            month = months[parseInt(str[6])-1];
        }
        else {
            month = months[parseInt(str.substring(4,6)) - 1];
        }

        year = str.substring(0,4);

        let resultStr = month + ", " + date + " " + year;
        setExpiryDate(resultStr);
    }

    // ! Function to handle duration increment
    function handleDurationSubtract(){
        if(duration > 5) {
            setChargeTimeError("");
            setDisabled(false);
            setDuration(prevState => parseInt(prevState) - 5);
        }
        else {
            setChargeTimeError("Minimum charge time is 5 mins");
            setDisabled(true);
        }
    }

    // ! Function to handle duration increment
    function handleDurationAdd(){
        if(duration < 600) {
            setChargeTimeError("");
            setDisabled(false);
            setDuration(prevState => parseInt(prevState) + 5);
        }
        else {
            setChargeTimeError("Maximum charge time is 600 mins");
            setDisabled(true);
        }
    }


    // ! Function to handleSendDuration
    function handleSendDuration(e){
        localStorage.removeItem("powerstrip-demo");
        setDemoMode(false);
        // ! storing the receipt id in localstorage
        localStorage.setItem("powerstrip-receipt", "receipt_"+uniqueId);
        e.preventDefault();
        localStorage.setItem("charge-duration", duration);
        setLoading(true);
        onOpen();

        // ! redirect to start page for demo devices
        if(DEVICE_TYPE === "DEALER") {
            cost = 0;
            // !storing amount in localStorage
            localStorage.setItem("powerstrip-charge-amount", cost);
            toast({
                title: 'This device is free to use.',
                description: "Plug in the charger and press start.",
                position: "top",
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
            // ! redirecting to start if amount less than or equal to 10
            navigate(`/charge-point/${id}/start`);
        }

        // ! redirect to start page for private devices
        else if(DEVICE_TYPE === "PRIVATE") {
            cost = 0;
            // !storing amount in localStorage
            localStorage.setItem("powerstrip-charge-amount", cost);
            toast({
                title: 'Your subscription is active.',
                description: "Plug in the charger and press start.",
                position: "top",
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
            // ! redirecting to start if amount less than or equal to 10
            navigate(`/charge-point/${id}/start`);
        }

        else {
            // ! use razorpay or wallet for public devices
            // ! storing amount in localStorage
            if(duration > 60) {
                cost = (duration * 60 * chargeRate)/100;
            }
            else {
                cost = (60 * 60 * chargeRate)/100;
            }
            localStorage.setItem("powerstrip-charge-amount", cost);

            // ! post request to provide cost and order_id
            var myHeaders = new Headers();
            myHeaders.append("customerAuthToken", JSON.parse(localStorage.getItem("powerstrip-user-token")));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "amount": cost,
                "receipt": "receipt_"+uniqueId,
                "transaction_type": transactionType
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
                console.log(result);
                if(result.payment_completed === false){
                    orderId = result.payment.id;
                    finalAmount = result.payment.amount;
                    handleRazorpayPayment();
                }
                else if(result.payment_completed === true){
                    setLoading(false);
                    toast({
                        title: 'Payment successfull.',
                        description: "Plug in the charger and press start.",
                        position: "top",
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    })
                    navigate(`/charge-point/${id}/start`);
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
    }

    // ! Function to load razorpay script
    function loadScript(src) {
        onClose();
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
        setLoading(false);

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
                onOpen();
                // console.log(response);
                const data = {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                };
                console.log(data);

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
                    // console.log(result);
                    if(result.status === "success"){
                        setLoading(false);
                        toast({
                            title: 'Payment successfull.',
                            description: "Plug in the charger and press start.",
                            position: "top",
                            status: 'success',
                            duration: 3000,
                            isClosable: true,
                        })
                        navigate(`/charge-point/${id}/start`);
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

    return (
        <Container maxW="container.sm">

            {userPhoneNumber &&
            <Badge px="2" mr="2" mt="2" bg="#E3FCFF" color="#000000">
                <Text p="0">
                    <i className="fas fa-user header-icon" pr="2"></i> 
                    { userPhoneNumber }
                </Text>
            </Badge>}

            { location &&
            <Badge px="2" mr="2" mt="2" bg="#E3FCFF" color="#000000">
                <Text>
                    <i className="fas fa-map-marker-alt header-icon"></i> 
                    { location }
                </Text>
            </Badge>}

            {DEVICE_TYPE === "PRIVATE" ?
            <Box mt="40px" flex='1' textAlign='left' py="2">
                <Box display="flex">
                    <Text color="#ffffff">Subscription Status</Text>
                    {subscription === "success" ?
                    <Box ml="auto" mr="5" w="5rem" borderColor="#29F3C0" borderWidth="1px" 
                    py="0.8px" pl="3.5" borderRadius="50px">
                        <Text ml="1" color="#29F3C0" fontSize="xs" fontWeight="500">
                        ACTIVE
                        </Text>
                    </Box>
                    :
                    <Box ml="auto" mr="5" w="5rem" borderColor="#F72119" borderWidth="1px" 
                    py="0.8px" pl="3.5" borderRadius="50px">
                        <Text color="#F72119" fontSize="xs" fontWeight="500">
                            INACTIVE
                        </Text>
                    </Box>
                    }      
                </Box>
            </Box>
            :
            <Box></Box>
            }

            {(subscription === "success") && (typeof expiryDate !== "undefined") ?
            <Text fontSize="xs" color="#70758F">
            Expiring on {expiryDate}
            </Text>
            :
            <></>
            }
            

            <Box  mt="40px">
                <Text color="#ffffff" fontSize="22px" ml="3" fontWeight="500">
                    Select Duration in minutes
                </Text>

                <Box display="flex" justifyContent="space-evenly" mx="2" mt="23px">
                    {/* <Image src={MinusBtn} onClick={handleDurationSubtract} /> */}
                    <Box onClick={handleDurationSubtract} w="51px" h="51px" bg="#0057FF"
                    borderRadius="16px">
                        <Center mt="3.5" fontSize="2xl">
                           <FaMinus/>
                        </Center>
                    </Box>

                    <Input borderRadius="10px" mx="3" w="168px" h="51px"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        size='lg' 
                        bg="#ffffff" color="#000000"
                        textAlign="center"
                        _placeholder={{ color: '#000000' }} />

                    <Box onClick={handleDurationAdd} w="51px" h="51px" bg="#0057FF"
                    borderRadius="16px">
                        <Center mt="3.5" fontSize="2xl">
                           <FaPlus/>
                        </Center>
                    </Box>
                    {/* <Image src={PlusBtn} onClick={handleDurationAdd} /> */}
                </Box>

                <Box mt="19px" display="flex" justifyContent="space-evenly">
                    <Badge onClick={() => setDuration(30)} px="2" mr="2" mt="2" bg="#E3FCFF" color="#000000">
                        <Text p="0" textAlign="center">
                            30 min
                        </Text>
                    </Badge>

                    <Badge onClick={() => setDuration(60)} px="2" mr="2" mt="2" bg="#E3FCFF" color="#000000">
                        <Text p="0" textAlign="center">
                            60 min
                        </Text>
                    </Badge>

                    <Badge onClick={() => setDuration(120)} px="2" mr="2" mt="2" bg="#E3FCFF" color="#000000">
                        <Text p="0" textAlign="center">
                            120 min
                        </Text>
                    </Badge>

                    <Badge onClick={() => setDuration(240)} px="2" mr="2" mt="2" bg="#E3FCFF" color="#000000">
                        <Text p="0" textAlign="center">
                            240 min
                        </Text>
                    </Badge>
                </Box>

                {DEVICE_TYPE === "PUBLIC" ?
                <Text className="base-price-text" mt="10" mb="-10" textAlign="right">
                    Base price is Rs {(basePrice*3600)/100}
                </Text>
                :
                <></>}

                { !currentUser ?
                <Box></Box>
                :
                <Button disabled={disabled} mt="10" mb="4" type="submit" colorScheme='#0057FF' 
                bg="#0057FF" size='lg' color="#ffffff" w="100%" fontWeight="400"
                onClick={handleSendDuration}>
                    {DEVICE_TYPE === "DEALER" || DEVICE_TYPE === "PRIVATE" ?
                    <>
                    Let's Charge
                    </>
                    :
                    <>
                    Pay Rs {amount ? amount.toFixed(1) : amount}
                    </>
                    }
                    {loading &&
                    <Spinner ml="4" />
                    }
                </Button>
                }

                {chargeTimeError &&
                <Text mt="3px" fontSize="sm" color="red" textAlign="center">
                    {chargeTimeError}
                </Text>
                }

            </Box>


            <Box mt="90px">
                <Footer/>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose} size="xs" isCentered>
                <ModalOverlay />
                <ModalContent>
                {demoMode &&
                <ModalHeader>
                    Demo Mode
                </ModalHeader>}
                <ModalCloseButton />
                <ModalBody>
                    {error &&
                    <Text pt="10">
                        {error}
                    </Text>}

                    {loading &&
                    <Box py="10">
                    <Center>
                    <Spinner thickness='3px' color="green.500" />
                    </Center>
                    <Text mt='2' textAlign="center">
                        Processing your payment
                    </Text>
                    </Box>}


                    {demoMode &&
                    <Box pb="6">
                    <Center>
                    {/* <Spinner thickness='3px' color="green.500" /> */}
                    </Center>
                    <Text mt='2' fontSize="lg" textAlign="justified">
                        Demo mode is available on this device.
                        So, what are you waiting for, plug in the charger and start charging for free.
                    </Text>
                    </Box>}

                </ModalBody>


                {demoMode &&
                <ModalFooter>
                    <Button w='100%' colorScheme='#0057FF' bg="#0057FF" 
                    mr={3} color="#ffffff" onClick={onClose}>
                        OK
                    </Button>
                </ModalFooter>}

                {error && 
                <ModalFooter>
                    <Button w='100%' colorScheme='#0057FF' bg="#0057FF" 
                    mr={3} color="#ffffff" onClick={onClose}>
                    Close
                    </Button>
                </ModalFooter>}
                </ModalContent>
            </Modal>
            
        </Container>
    );
}
 
export default ChargeTime;