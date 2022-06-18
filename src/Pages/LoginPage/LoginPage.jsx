import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container, 
    Box, 
    Text, 
    Input, 
    InputGroup, 
    InputLeftAddon,
    Center, 
    Button,
    Spinner } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton } from '@chakra-ui/react';
import Footer from '../../Components/Footer/Footer';
import { useToast } from '@chakra-ui/react';
import { useDisclosure } from "@chakra-ui/react";

const LoginPage = () => {

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
    const toast = useToast()

    // ! useNavigate hook 
    const navigate = useNavigate();

    // ! useDisclosure hook from chakra UI
    const { isOpen, onOpen, onClose } = useDisclosure();

    // ! useRef
    const phoneNumberRef = useRef();
    const emailRef = useRef();

    // ! States 
    const [loading, setLoading] = useState(false);

    // ! HandleSendOTP function
    function handleSendOTP(e){
        e.preventDefault();
        setLoading(true);
        // console.log(phoneNumberRef.current.value);
        localStorage.setItem("powerstrip-user-email", emailRef.current.value);
        localStorage.setItem("powerstrip-user-phone-number", phoneNumberRef.current.value);
        postPhoneNumber();
    }

    // ! Post phoneNumber function
    function postPhoneNumber(){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "mobile_number": phoneNumberRef.current.value,
            "device_id": "PS010001"
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
            // console.log(result);
            setLoading(false);
            if(result.status === "success"){
                toast({
                    title: 'OTP sent successfully',
                    description: "Please check you phone.",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
                navigate("/verification");
            }
            else{
                onOpen();
            }
          })
          .catch(error => console.log('error', error));
    }

    return (
        <Container maxW={["container.xl", "container.xl", "container.sm"]}>

            <Box mt="14">
                <Text w="171px" h="37px" ml="15px" color="#ffffff" 
                fontSize="24px" lineHeight="155.87%">
                    Login to charge
                </Text>

                <form onSubmit={ handleSendOTP }>
                <Box mx="4">

                <InputGroup mt={["13px", "8", "16"]} mx="auto" maxW={["100%", "70%", "80%"]}>
                    <InputLeftAddon h="48px" children="Email" />
                    <Input ref={emailRef}
                    h="48px"
                    type="email" color="#ffffff" 
                    placeholder="Enter email"  
                    _placeholder={{ color: '#ffffff' }}
                    fontSize="16px"
                    required/>
                </InputGroup>

                <InputGroup mt={["3", "3", "3"]} mx="auto" maxW={["100%", "70%", "80%"]}>
                    <InputLeftAddon h="48px" children=" + 91" />
                    <Input ref={phoneNumberRef}
                    h="48px"
                    type="tel" color="#ffffff" 
                    placeholder="Enter Mobile Number"  
                    _placeholder={{ color: '#ffffff' }}
                    fontSize="16px"
                    required/>
                </InputGroup>
                </Box>

                <Center mx="3" mt="22px">
                <Button type="submit"
                w={["100%", "70%", "80%"]} color="#ffffff" 
                bg="#0057FF" colorScheme="#0057FF" h="48px" 
                fontSize="20px" fontWeight="normal">
                    Send OTP
                { loading && <Spinner ml="4"/>}
                </Button>
                </Center>
                </form>

            </Box>

            {/* <Box mt={["55%", "40%"]}>
            <Footer/>
            </Box> */}

            <Modal size="xs" isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Failed to send OTP</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Text>An error occured, please try again</Text>
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
 
export default LoginPage;
