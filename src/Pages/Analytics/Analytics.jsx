import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Center, Box, Text, Button, Image, Spinner } from "@chakra-ui/react";
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
import Header from '../../Components/Header/Header';
import Timer from "../../Components/Timer/Timer";
import SwipeButton from '../../Components/SwipeButton/SwipeButton';
import IMG from "../../Assets/evcharger.png";
import { useDisclosure } from "@chakra-ui/react";
import useFetchJWTStatus from "../../Hooks/useFetchJWTStatus";
import moment from "moment";   



const Analytics = () => {

    // ! useToast
    const toast = useToast();

    // ! get jwt status
    const jwt = useFetchJWTStatus();

    //! API_URL variable
    let API_URL;

    //! Set API_URL based on env
        
    if(process.env.NODE_ENV !== 'production') {
        API_URL=process.env.REACT_APP_DEV_API_URL;
    }
    else{
        API_URL=process.env.REACT_APP_PROD_API_URL;
    }

    // ! States
    const [spinner, setSpinner] = useState(false);
    const [powerSupplyError, setPowerSupplyError] = useState("");

    // ! useParams
    const {id} = useParams();
    const {param1} = useParams();

    // ! useNavigate hook
    const navigate = useNavigate();

    // ! useDisclosure hook from chakra UI
    const { isOpen, onOpen, onClose } = useDisclosure();

    // ! To store transaction id on stop
    let transactionId;

    const chargeDuration = parseInt(localStorage.getItem("charge-duration"));
    let chargeDurationSec = chargeDuration * 60;

    let startHours = localStorage.getItem("powerstrip-start-hour");
    let startMinutes = localStorage.getItem("powerstrip-start-minute");
    let startSeconds = localStorage.getItem("powerstrip-start-second");

    let startTimeSec = moment(`${startHours}:${startMinutes}:${startSeconds}`, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds');
    let finalTimeSec = startTimeSec+ chargeDurationSec;

    let currentHours = moment().hours();
    let currentMinutes = moment().minutes();
    let currentSeconds = moment().seconds();

    let currentTimeSec = moment(`${currentHours}:${currentMinutes}:${currentSeconds}`, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds');

    chargeDurationSec = finalTimeSec - currentTimeSec;


    // ! useEffect
    useEffect(() => {

        // ! auto stop
        setTimeout(function() {
            localStorage.setItem("powerstrip-refund-amount", 0);
            toast({
                title: 'Charge complete.',
                description: "Charging successfull. Please take a moment to rate your experience.",
                position: "top",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            handleAutomaticStop();
            navigate("/charge/complete");
        }, (chargeDurationSec)*1000);
        // (chargeDuration)*60000

        // ! get ping
        let i=0;
        const getPing = setInterval(() => {

            // ! get device status
            var myHeaders = new Headers();
            myHeaders.append("customerAuthToken", JSON.parse(localStorage.getItem("powerstrip-user-token")));
            myHeaders.append("Content-Type", "application/json");
            
            var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
            };

            fetch(`${API_URL}/device/${id}/status`, requestOptions)
            .then(response => response.json())
            .then((result) => {
                // console.log("device ping");
                // console.log(result);
                if(result.device_status) {
                    if(result.device_status.status === 0 && result.device_status.command === "stop") {
                        clearInterval(getPing);
                        i++;
                    }
                }
                if(i === 1) {
                    handleNoPingStop();
                }
            })
            .catch(error => console.log('error', error));

        }, 10000)

    },[])

    // ! ------------------------------------
    function handleNoPingStop(){
        setSpinner(true);
        toast({
            title: 'Charge complete.',
            description: "Charging stopped due to power failure or MCB turning off. Your refund will be added to your wallet (if applicable).",
            position: "top",
            status: 'success',
            duration: 5000,
            isClosable: true,
        })
        navigate("/charge/complete");
    }

    // ! ----------------------------------------------------------------

        // ! Hit stop before redirecting in automatic stop case
        function handleAutomaticStop(){
            if(JSON.parse(localStorage.getItem("powerstrip-charge-amount")) === 0) {
    
                var myHeaders = new Headers();
                myHeaders.append("customerAuthToken", JSON.parse(localStorage.getItem("powerstrip-user-token")));
                myHeaders.append("Content-Type", "application/json");
    
                var raw = JSON.stringify({
                    "charge_id": param1,
                    "payment_receipt": localStorage.getItem("powerstrip-receipt")
                });
    
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
    
                fetch(`${API_URL}/device/${id}/charge/free?command=stop&charge_id=${param1}`, requestOptions)
                .then(response => response.json())
                .then((result) => {
                    console.log(result);
                })
                .catch((error) => {
                    console.log('error', error);
                });
            }
            else {
                var myHeaders = new Headers();
                myHeaders.append("customerAuthToken", JSON.parse(localStorage.getItem("powerstrip-user-token")));
                myHeaders.append("Content-Type", "application/json");
    
                var raw = JSON.stringify({
                    "charge_id": param1,
                    "payment_receipt": localStorage.getItem("powerstrip-receipt")
                });
    
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
    
                fetch(`${API_URL}/device/${id}/charge?command=stop&charge_id=${param1}`, requestOptions)
                .then(response => response.json())
                .then((result) => {
                    console.log(result);
                })
                .catch((error) => {
                    console.log('error', error);
                });
            }
        }
    
        // // ! Function to handle stop of transaction
        // function handleStoptransaction(){
        //     setSpinner(true);
    
        //     var myHeaders = new Headers();
        //     myHeaders.append("customerAuthToken", JSON.parse(localStorage.getItem("powerstrip-user-token")));
        //     myHeaders.append("Content-Type", "application/json");
    
        //     var raw = JSON.stringify({
        //         "charge_id": param1,
        //         "payment_receipt": localStorage.getItem("powerstrip-receipt")
        //     });
    
        //     var requestOptions = {
        //         method: 'POST',
        //         headers: myHeaders,
        //         body: raw,
        //         redirect: 'follow'
        //     };
    
        //     // setTimeout(() => {
        //         fetch(`${API_URL}/device/${id}/charge?command=stop&charge_id=${param1}`, requestOptions)
        //         .then(response => response.json())
        //         .then((result) => {
        //             // console.log("Stopping");
        //             console.log(result);
        //             // ! store transaction id
        //             // transactionId = result.charge.id;
        //             // console.log("Stopping");
        //             if(result.status==="success"){
        //                 if(result.refund_data) {
        //                     localStorage.setItem("powerstrip-refund-amount", result.refund_data.refund_amount);
        //                 }
        //                 localStorage.removeItem("powerstrip-device-id");
        //                 toast({
        //                     title: 'Charge complete.',
        //                     description: "Hurray your charge was successfull, please take a moment to rate your experience.",
        //                     position: "top",
        //                     status: 'success',
        //                     duration: 10000,
        //                     isClosable: true,
        //                 })
        //                 navigate("/charge/complete");
        //             }
        //             else{
        //                 // console.log("Failed to stop");
        //                 onOpen();
        //                 setSpinner(false);
        //             }
        //         })
        //         .catch((error) => {
        //             console.log('error', error);
        //             onOpen();
        //             setSpinner(false);
        //         });
        //     // },20000)
    
        //     //! abort the fetch
        //     // return () => abortCont.abort();
        // }

    // ! -----------------------------------------------------------------
    // ! Handle stop according to device type
    function handleStop(){
        if(JSON.parse(localStorage.getItem("powerstrip-charge-amount")) === 0) {
            setSpinner(true);

            var myHeaders = new Headers();
            myHeaders.append("customerAuthToken", JSON.parse(localStorage.getItem("powerstrip-user-token")));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "charge_id": param1,
                "payment_receipt": localStorage.getItem("powerstrip-receipt")
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            // setTimeout(() => {
            fetch(`${API_URL}/device/${id}/charge/free?command=stop&charge_id=${param1}`, requestOptions)
            .then(response => response.json())
            .then((result) => {
                // console.log("Stopping");
                console.log(result);
                // ! store transaction id
                // transactionId = result.charge.id;
                // console.log("Stopping");
                if(result.status==="success"){
                    if(result.refund_data) {
                        localStorage.setItem("powerstrip-refund-amount", result.refund_data.refund_amount);
                    }
                    localStorage.removeItem("powerstrip-device-id");
                    toast({
                        title: 'Charge complete.',
                        description: "Charging successfull, your refund (if applicable) will be added to your wallet. Please take a moment to rate your experience.",
                        position: "top",
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    })
                    navigate("/charge/complete");
                }
                else{
                    // console.log("Failed to stop");
                    onOpen();
                    setSpinner(false);
                }
            })
            .catch((error) => {
                console.log('error', error);
                onOpen();
                setSpinner(false);
            });
            // },20000)

            //! abort the fetch
            // return () => abortCont.abort();
        }
        else {
            handleStoptransaction();
        }
    }

    // ! Function to handle stop of transaction
    function handleStoptransaction(){
        setSpinner(true);

        var myHeaders = new Headers();
        myHeaders.append("customerAuthToken", JSON.parse(localStorage.getItem("powerstrip-user-token")));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "charge_id": param1,
            "payment_receipt": localStorage.getItem("powerstrip-receipt")
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        // setTimeout(() => {
            fetch(`${API_URL}/device/${id}/charge?command=stop&charge_id=${param1}`, requestOptions)
            .then(response => response.json())
            .then((result) => {
                // console.log("Stopping");
                console.log(result);
                // ! store transaction id
                // transactionId = result.charge.id;
                // console.log("Stopping");
                if(result.status==="success"){
                    if(result.refund_data) {
                        localStorage.setItem("powerstrip-refund-amount", result.refund_data.refund_amount);
                    }
                    localStorage.removeItem("powerstrip-device-id");
                    toast({
                        title: 'Charge complete.',
                        description: "Hurray your charge was successfull, please take a moment to rate your experience.",
                        position: "top",
                        status: 'success',
                        duration: 10000,
                        isClosable: true,
                    })
                    navigate("/charge/complete");
                }
                else{
                    // console.log("Failed to stop");
                    onOpen();
                    setSpinner(false);
                }
            })
            .catch((error) => {
                console.log('error', error);
                onOpen();
                setSpinner(false);
            });
        // },20000)

        //! abort the fetch
        // return () => abortCont.abort();
    }

    return (
        <Container maxW={["container.xl", "container.xl", "container.sm"]}>

            <Header title=""/>

            <Box mx="4" mt="43px">
                <Timer/>
                <Center mx="4" mt={["5px","30px", "10px"]}>
                <Image mt="60px" w="470" h="150" src={IMG}/>
                </Center>
            </Box>

            <Center mx="4" mt="8%">
                <SwipeButton color='#95130B' text='CONFIRM' onSuccess={handleStop}/>
            </Center>

            <Modal size="xs" isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Failed to Stop.</ModalHeader>
                        <ModalCloseButton />
                    <ModalBody>
                        <Text>Please try again.</Text>
                    </ModalBody>

                    <ModalFooter>
                    <Button w='100%' colorScheme='#0057FF' bg="#0057FF" 
                    mr={3} color="#ffffff" onClick={onClose}>
                    Close
                    </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {spinner &&
            <Box zIndex="5" bg="#000000" position="fixed" 
            top="0" bottom="0" left="0" right="0" opacity="0.89">
            <Spinner
            mt={["70%","40%","20%"]}
            mx={["42%", "45%", "48%"]}
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
            />
            {powerSupplyError &&
            <Text color="#ffffff" textAlign="center">
                {powerSupplyError}
            </Text>}
            <Text color="#ffffff" textAlign="center">We are stopping the power supply.</Text>
            <Text color="#ffffff" mx="8" textAlign="center">You can remove the plug in a moment.</Text>
            </Box>
            }

        </Container>
    );
}
 
export default Analytics;