import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Text, Box, Icon, Divider, Center, Button, Image, Spinner } from "@chakra-ui/react";
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
import Header from "../../Components/Header/Header";
import { BiCheck, BiRupee } from "react-icons/bi";
import { nanoid } from 'nanoid';
import { useDisclosure } from '@chakra-ui/react';
import Logo from "../../Assets/powerstrip-logo.webp";
import Success from "../../Assets/check.png";

const Subscription = () => {

    //! API_URL variable
    let API_URL;

    //! Set API_URL based on env
            
    if(process.env.NODE_ENV !== 'production') {
        API_URL=process.env.REACT_APP_DEV_API_URL;
    }
    else{
        API_URL=process.env.REACT_APP_PROD_API_URL;
    }

    // ! useParams hook
    const {id} = useParams();

    // ! useNavigate hook
    const navigate = useNavigate();

    // ! useToast
    const toast = useToast();

    // ! useDisclosure hook from chakra UI
    const { isOpen, onOpen, onClose } = useDisclosure();

    // ! variables
    let uniqueId;
    let orderId;
    let finalAmount;

    // ! generate string to use in receipt id
    uniqueId = nanoid();

    // ! states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [btnText, setBtnText] = useState("Subscribe Now");
    const [payment, setPayment] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [disabled, setDisabled] = useState(false);

    // ! initiating payment
    function handleSubscribtionPayment(e) {
        setDisabled(true);
        e.preventDefault();
        setLoading(true);
        setBtnText("Processing...");
        onOpen();
        // ! creating razorpay order
        var myHeaders = new Headers();
        myHeaders.append("customerAuthToken", JSON.parse(localStorage.getItem("powerstrip-user-token")));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "amount": 199,
            "receipt": "receipt_"+uniqueId,
            "transaction_type": 1
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
            // console.log(result);
            if(result.payment_completed === false){
                orderId = result.payment.id;
                finalAmount = result.payment.amount;
                onClose();
                handleRazorpayPayment();
            }
            else if(result.payment_completed === true){
                setPayment(true);
                setLoading(false);
                setBtnText("Confirming Subscription...");
                onOpen();
                subscribe();
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
        // onClose();
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
        // setLoading(true);

        // ! Load razorpay script
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        // ! if razorpay script is not loaded show error
        if (!res) {
            setLoading(true);
            setError("Failed to process payment. Please try again.")
            onOpen();
            return;
        }

        // setLoading(true);
        // onOpen();

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
                // onOpen();
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
                    // console.log("verification");
                    // console.log(result);
                    if(result.status === "success"){
                        // onOpen();
                        setPayment(true);
                        setLoading(false);
                        setBtnText("Confirming Subscription...");
                        onOpen();
                        subscribe();
                        // toast({
                        //     title: 'Payment successfull.',
                        //     description: "Chalo charge karie ⚡",
                        //     position: "top",
                        //     status: 'success',
                        //     duration: 9000,
                        //     isClosable: true,
                        // })
                        // navigate(`/charge-point/${id}/start`);
                    }
                    else{
                        setLoading(false);
                        setError("Payment verification failed.");
                        onOpen();
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    console.log('error', error);
                    setError("An error occured. Please try again.");
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


    // ! registering subscription
    function subscribe() {
        // setPayment(false);
        setSubscribed(true);

        var myHeaders = new Headers();
        myHeaders.append("customerAuthToken", JSON.parse(localStorage.getItem("powerstrip-user-token")));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "subscription_type": "normal",
            "device_id": id
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch(`${API_URL}/subscription/`, requestOptions)
        .then(response => response.json())
        .then((result) => {
            console.log(result);
            setDisabled(false);
            if(result.status === "success"){
                toast({
                title: 'Subscription successfull.',
                description: "Enjoy your charging.",
                position: "top",
                status: 'success',
                duration: 9000,
                isClosable: true,
                })
                navigate(`/charge-point/device/${id}`);
            }
            else {
                setPayment(false);
                setError("Failed to confirm subscription. Please try agin.");
                setSubscribed(false);
                onOpen();
            }
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
            setError("An error occured. Please try again.");
            onOpen();
        });
    }

    return (
        <Container maxW="container.sm">
            <Header ml="-4" />

            <Text color="#ffffff" fontSize="3xl" mt="5">
                Powerstrip Subscription
            </Text>

            <Text color="#ffffff" fontSize="lg" mt="5">Reasons to consider a Powerstrip charge point.</Text>

            <Divider/>

            <Box mt="3" color="#ffffff">
                <Box mt="1" display="flex">
                    <Icon color="#29F3C0" as={BiCheck} w={5} h={5} />
                    <Text>Control from anywhere.</Text>
                </Box>

                <Box mt="1" display="flex">
                    <Icon color="#29F3C0" as={BiCheck} w={5} h={5} />
                    <Text>Electricity theft proof.</Text>
                </Box>

                <Box mt="1" display="flex">
                    <Icon color="#29F3C0" as={BiCheck} w={5} h={5} />
                    <Text>Timer based charging.</Text>
                </Box>

                <Box mt="1" display="flex">
                    <Icon color="#29F3C0" as={BiCheck} w={5} h={5} />
                    <Text>Full safety assurance.</Text>
                </Box>
            </Box>

            {/* <Box my="8" borderWidth="1px" borderColor="#29F3C0" px="2" py="6" borderRadius="10px">
                <Text textAlign="center" color="#ffffff" fontsize="md">
                    Get all these features for just
                </Text>

                <Center  fontSize="4xl">
                <BiRupee color="#29F3C0"/>
                <Text display="flex" color="#29F3C0" fontweight="600">
                    199 
                    <Text ml="1" mt="6" color="#ffffff" fontSize="sm" display="inline">
                    / month
                    </Text>
                </Text>
                </Center>
                <Text color="#ffffff" fontSize="xs" textAlign="center">
                    inclusive of all taxes 
                </Text>
            </Box> */}

            <Box my="8" borderWidth="1px" borderColor="#29F3C0" px="2" py="6" borderRadius="10px">
                <Text textAlign="center" color="#ffffff" fontsize="md">
                    Get all these features for just
                </Text>

                <Center  fontSize="4xl">
                <BiRupee color="#29F3C0"/>
                <Text display="flex" color="#29F3C0" fontweight="600">
                    199 
                    <Text ml="1" mt="6" color="#29F3C0" fontSize="sm" display="inline">
                    / month
                    </Text>
                </Text>
                </Center>
                <Text className="tax-text" color="#ffffff" fontSize="xs" textAlign="center">
                    inclusive of all taxes
                </Text>
            </Box>

            <Button onClick={handleSubscribtionPayment} w="100%" size='lg' color='#ffffff' fontWeight="500"
            colorScheme='#0057FF' bg='#0057FF' disabled={disabled}>
                {btnText}
            </Button>


            <Modal isOpen={isOpen} onClose={onClose} size="xs" isCentered>
            <ModalOverlay />
            <ModalContent py="6">
            {/* <ModalHeader></ModalHeader> */}
            {/* <ModalCloseButton /> */}
            <ModalBody>
                {loading &&
                <Box py="4">
                    <Center>
                        <Spinner color="green.500" />
                    </Center>
                    <Text mt="3" textAlign="center" color="#ffffff">
                        Processing Payment...
                    </Text>
                </Box>}

                {payment &&
                <Box>
                    <Center>
                    <Image
                        boxSize='100px'
                        objectFit='cover'
                        src={Success}
                        alt='Dan Abramov'
                    />
                    </Center>
                    
                    <Text mt="3" fontSize="lg" textAlign="center" color="#ffffff">
                        Payment successfull.
                    </Text>

                    {subscribed &&
                    <Box>
                        <Text mt="3" fontSize="lg" textAlign="center" color="#ffffff">
                            Confirming subscription .....
                        </Text>
                        <Text fontSize="xs" mt="1" textAlign="center" color="#ffffff">
                            Please dont press any other button
                        </Text>
                    </Box>}
                </Box>}

                {error &&
                <Box>
                    {error}
                </Box>}
            </ModalBody>

            {error &&
            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
                </Button>
                {/* <Button variant='ghost'>Secondary Action</Button> */}
            </ModalFooter>}

            </ModalContent>
        </Modal>

        </Container>
    );
}
 
export default Subscription;