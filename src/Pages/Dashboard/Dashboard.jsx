import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Text, Image, Center, Button, Box, Badge, OrderedList, ListItem, Spinner } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react';
import IMG from "../../Assets/evcharger.svg";
import { useDisclosure } from "@chakra-ui/react";
import moment from "moment";
import useFetchUserDetails from "../../Hooks/useFetchUserDetails";
import useFetchJWTStatus from "../../Hooks/useFetchJWTStatus";   



const Dashboard = () => {

    // ! useParams hook
    const {id} = useParams();

    localStorage.setItem("powerstrip-device-id",id);

    // ! useNavigate hook
    const navigate = useNavigate();

    // ! get jwt status and get any active charging session
    const { data } = useFetchJWTStatus();
    if(localStorage.getItem("powerstrip-user-token") && data) {
        if(localStorage.getItem("powerstrip-device-id")) {
            let deviceId = localStorage.getItem("powerstrip-device-id");
            if(data.customer.charge_session.id !== null) {
                navigate(`/charge-point/${deviceId}/session/${data.customer.charge_session_id}`);
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

    // ! useDisclosure hook from chakra UI
    const { isOpen, onOpen, onClose } = useDisclosure();

    // ! States
    const [location, setLocation] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [userPhoneNumber, setUserPhoneNumber] = useState();
    const [spinner, setSpinner] = useState(false);
    const [startError, setStartError] = useState("");


    let transactionId;
    let cost;

    // ! useEffect hook
    useEffect(() => {
        console.log(localStorage.getItem("powerstrip-charge-amount"));
        cost = JSON.parse(localStorage.getItem("powerstrip-charge-amount"));
        setUserPhoneNumber(localStorage.getItem("powerstrip-user-phone-number"));
        setLocation(localStorage.getItem("powerstrip-charging-station"));
    },[])

    // ! Fetch user data to check if data is present
    const {userData} = useFetchUserDetails();


    // ! Function to start transaction
    function handleStartTransaction(){
        // localStorage.setItem("powerstrip-start-hour",moment().hours());
        // localStorage.setItem("powerstrip-start-minute",moment().minutes());
        // localStorage.setItem("powerstrip-start-second",moment().seconds());
        if(JSON.parse(localStorage.getItem("powerstrip-charge-amount")) === 0) {
            let freeDuration = localStorage.getItem("charge-duration")*60;
            // console.log("Free");
            // console.log(freeDuration);
            setDisabled(true);
            setSpinner(true);
            // const abortCont = new AbortController();

            var myHeaders = new Headers();
            myHeaders.append("customerAuthToken", JSON.parse(localStorage.getItem("powerstrip-user-token")));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "duration": freeDuration,
                "charge_id": id
                // "payment_receipt": localStorage.getItem("powerstrip-receipt")
            });
            
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            // setTimeout(() => {
                fetch(`${API_URL}/device/${id}/charge/free?command=start`, requestOptions)
                .then(response => response.json())
                .then((result) => {
                    console.log(result);
                    // ! get transaction id
                    transactionId = result.charge.id;
                    if(result.status==="success"){
                        localStorage.setItem("powerstrip-start-hour",moment().hours());
                        localStorage.setItem("powerstrip-start-minute",moment().minutes());
                        localStorage.setItem("powerstrip-start-second",moment().seconds());
                        if(userData){
                            navigate(`/charge-point/${id}/session/${transactionId}`);
                        }
                        else{
                            navigate(`/details/user/${id}/${transactionId}`);
                        }
                    }
                    else{
                        setStartError("result.message");
                        onOpen();
                        setDisabled(false);
                        setSpinner(false);
                    }
                })
                .catch((error) => {
                    console.log('error', error);
                    setStartError("result.message");
                    onOpen();
                    setDisabled(false);
                    setSpinner(false);
                });
            // },20000);

            //! abort the fetch
            // return () => abortCont.abort();
        }
        else {
            // console.log(userData);
            setDisabled(true);
            setSpinner(true);
            // const abortCont = new AbortController();

            var myHeaders = new Headers();
            myHeaders.append("customerAuthToken", JSON.parse(localStorage.getItem("powerstrip-user-token")));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "duration": localStorage.getItem("charge-duration") * 60,
                "payment_receipt": localStorage.getItem("powerstrip-receipt")
            });
            
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            // setTimeout(() => {
                fetch(`${API_URL}/device/${id}/charge?command=start`, requestOptions)
                .then(response => response.json())
                .then((result) => {
                    // console.log(result);
                    // ! get transaction id
                    transactionId = result.charge.id;
                    if(result.status==="success"){
                        localStorage.setItem("powerstrip-start-hour",moment().hours());
                        localStorage.setItem("powerstrip-start-minute",moment().minutes());
                        localStorage.setItem("powerstrip-start-second",moment().seconds());
                        if(userData){
                            navigate(`/charge-point/${id}/session/${transactionId}`);
                        }
                        else{
                            navigate(`/details/user/${id}/${transactionId}`);
                        }
                    }
                    else{
                        setStartError("result.message");
                        onOpen();
                        setDisabled(false);
                        setSpinner(false);
                    }
                })
                .catch((error) => {
                    console.log('error', error);
                    setStartError("result.message");
                    onOpen();
                    setDisabled(false);
                    setSpinner(false);
                });
            // },20000);

            //! abort the fetch
            // return () => abortCont.abort();
        }   
    }

    return (
        <Container maxW={["container.xl", "container.xl", "container.sm"]} pb="14" mt="1%">

            <Box display="flex" flexWrap="wrap" ml="3">
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
            </Box>

            <Text mt="5%" mx="4" fontSize="24px" color="#ffffff"
            fontWeight="normal" lineHeight="155.87%">
            Instructions
            </Text>

            <Box mx="4" color="#ffffff" fontSize="20px">
                <OrderedList>
                    <ListItem>Plug charger in the socket.</ListItem>
                    <ListItem>Press start and continue charging.</ListItem>
                </OrderedList>
            </Box>

            <Center mx="4" mt={["110px","8","150px"]}>
                <Image w="480" h="180" src={IMG}/>
            </Center>

            <Center mt="8%" mx="4">
                <Button disabled={disabled} onClick={ handleStartTransaction } 
                w={["100%", "70%", "80%"]} color="#000000" 
                bg="#97FC95" colorScheme="#97FC95" h="48px" 
                fontSize="20px" fontWeight="normal">
                    Start
                </Button>
            </Center>

            <Modal size="xs" isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Failed to start</ModalHeader>
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
            <Box bg="#000000" position="fixed" 
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
            <Text color="#ffffff" textAlign="center">
                We will begin charging your vehicle in a moment.
            </Text>
            <Text color="#ffffff" textAlign="center">
                Thank you for choosing powerstrip.
            </Text>
            </Box>
            }
        
        </Container>
    );
}
 
export default Dashboard;
