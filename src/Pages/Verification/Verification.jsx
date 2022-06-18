import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Container, 
    Box,  
    Text,
    Input, 
    InputGroup, 
    InputLeftAddon,
    Center, 
    Button,
    PinInput, 
    PinInputField,
    Spinner,
    Badge } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton } from '@chakra-ui/react';
import Footer from '../../Components/Footer/Footer';
import authenticationService from '../../Services/auth.service';
import { useDisclosure } from "@chakra-ui/react";
import { useToast } from '@chakra-ui/react';

const Verification = () => {

    //! API_URL variable
    let API_URL;

    //! Set API_URL based on env
        
    if(process.env.NODE_ENV !== 'production') {
        API_URL=process.env.REACT_APP_DEV_API_URL;
    }
    else{
        API_URL=process.env.REACT_APP_PROD_API_URL;
    }

    // ! useToast from chakra ui
    const toast = useToast();

    // ! UseNavigate hook
    const navigate = useNavigate();

    // ! UseRef hook
    const phoneNumberRef = useRef();

    // ! useDisclosure hook from chakra UI
    const { isOpen, onOpen, onClose } = useDisclosure();

    // ! States
    const [timer, setTimer] = useState("20");
    const [OTP, setOTP] = useState("");
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [userPhoneNumber, setUserPhoneNumber] = useState();

    // ! UseEffect hook
    useEffect(() => {
        setUserPhoneNumber(localStorage.getItem("powerstrip-user-phone-number"));
        setTimeout(function(){
            if(timer > 0){
                setTimer(prevState => prevState - 1);
            }
            else{
                setDisabled(false);
            }
        }, 1000);
    },[timer])

    // ! HandleResendOTP function
    function handleResendOTP(e){
        e.preventDefault();
        // console.log(phoneNumberRef.current.value);
        localStorage.setItem("powerstrip-user-phone-number", phoneNumberRef.current.value);
        postPhoneNumber();
    }

    // ! Post phoneNumber function
    function postPhoneNumber(){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "mobile_number": phoneNumberRef.current.value,
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        
        fetch(`${API_URL}/auth/customer/generate-otp`, requestOptions)
          .then(response => response.json())
          .then(result => {
            toast({
                title: 'OTP sent successfully',
                description: "Please check you phone.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            window.location.reload();
          })
          .catch(error => console.log('error', error));
    }

    // ! Login Function
    function handleLogin(e){
        e.preventDefault();
        setLoading(true);

        if(OTP.length===6){
            authenticationService.login(OTP)
            .then((result) => {
                if(result==="success"){
                    navigate(-2);
                }
                else{
                    onOpen();
                    setLoading(false);
                }
            })
            .catch((err) => {
                setLoading(false);
                console.log("error " + err);
            })
        }
    }

    return (
        <Container maxW={["container.xl", "container.xl", "container.sm"]}>
            
            {userPhoneNumber &&
            <Badge px="2" mr="2" mt="2" bg="#E3FCFF" color="#000000">
                <Text p="0">
                    <i className="fas fa-user header-icon" pr="2"></i> 
                    { userPhoneNumber }
                </Text>
            </Badge>}

            <Box mt="14">
                <Text w="171px" h="37px" ml="15px" color="#ffffff" 
                fontSize="24px" lineHeight="155.87%">
                    Login to charge
                </Text>

                <Box mx="3">
                <InputGroup mt={["13px", "8", "16"]} mx="auto" maxW={["100%", "70%", "80%"]}>
                    <InputLeftAddon h="48px" children="+91" />
                    <Input h="48px" ref={ phoneNumberRef }
                    onChange={(e) => setDisabled(false)}
                    defaultValue={ localStorage.getItem("powerstrip-user-phone-number") } type="tel" 
                    color="#ffffff" placeholder="Enter Mobile Number"  
                    _placeholder={{ color: '#ffffff' }}
                    fontSize="16px" />

                    {/* <Editable pl="3" fontSize="16px" pt="8px" 
                    defaultValue={ localStorage.getItem("powerstrip-user-phone-number") }
                    onChange={(e) => setDisabled(false)}>
                    <EditablePreview />
                    <Input as={EditableInput} ref={ phoneNumberRef }
                    type="tel"
                    color="#ffffff" placeholder="Enter Mobile Number"  
                    _placeholder={{ color: '#ffffff' }}
                    fontSize="16px" />
                    </Editable> */}

                </InputGroup>
                </Box>

                <Center mx="3" display="flex" mt="21px">
                    <PinInput onChange={ (e) => setOTP(e) } otp size="md" borderColor="#ffffff">
                        <PinInputField borderColor="#ffffff" color="#ffffff" w="40px" h="40px" />
                        <PinInputField borderColor="#ffffff" color="#ffffff" w="40px" h="40px" ml="5px" />
                        <PinInputField borderColor="#ffffff" color="#ffffff" w="40px" h="40px" ml="5px" />
                        <PinInputField borderColor="#ffffff" color="#ffffff" w="40px" h="40px" ml="5px" />
                        <PinInputField borderColor="#ffffff" color="#ffffff" w="40px" h="40px" ml="5px" />
                        <PinInputField borderColor="#ffffff" color="#ffffff" w="40px" h="40px" ml="5px"/>
                    </PinInput>

                    <Box ml="5px" mt="1" color="#ffffff">
                        <Text fontSize="20px">{`${timer}`}</Text>
                    </Box>
                </Center>


                {/* <Text onClick={ handleResendOTP } fontSize="12px" cursor="pointer"
                mr={["4", "20"]} mt="16px" float="right" color="#0057FF">
                    Resend OTP
                </Text> */}

                <Button isDisabled={disabled} onClick={ handleResendOTP } colorScheme="#0057FF" 
                variant="ghost" size="sm" float="right" color="#0057FF"
                mr={["4", "20"]} mt="16px">
                    Resend OTP
                </Button>

                <Center mx="4" mt="14">
                <Button onClick={ handleLogin } w={["100%", "70%", "80%"]} color="#ffffff" 
                bg="#0057FF" colorScheme="#0057FF" h="48px" 
                fontSize="20px" fontWeight="normal">
                    Login
                    {loading &&
                    <Spinner ml="3" />
                    }
                </Button>
                </Center>
            </Box>

            <Modal size="xs" isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Verification failed</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Text>Please provide a valid OTP</Text>
            </ModalBody>

            <ModalFooter>
            <Button w='100%' colorScheme='#0057FF' bg="#0057FF" 
            mr={3} color="#ffffff" onClick={onClose}>
            Close
            </Button>
            </ModalFooter>
            </ModalContent>
            </Modal>

            <Box mt="15%">
            <Footer/>
            </Box>
        </Container>
    );
}
 
export default Verification;