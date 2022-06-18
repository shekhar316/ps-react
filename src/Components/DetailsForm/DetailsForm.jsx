import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Container, Box, Text, Input, Button, Spinner, Select } from "@chakra-ui/react";
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
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
  } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import JSONMODELDATA from "../../ev-models.json";
import JSONOEMDATA from "../../oem-models.json";

const DetailsForm = () => {

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
    const {transactionId} = useParams();

    // ! useNavigate hook
    const navigate = useNavigate();

    // ! useToast from chakra UI
    const toast = useToast();

    // ! useDisclosure hook from chakra UI
    const { isOpen, onOpen, onClose } = useDisclosure();

    // ! States
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [modelName, setModelName] = useState("");
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    // const [searchTerm, setSearchTerm] = useState("");
    const [oemModel, setOemModel] = useState("");
    // const [modelValue, setModelValue] = useState("");

    // ! Function to submit data
    function handleSubmit(e){
        setLoading(true);
        e.preventDefault();
        // console.log(name);
        // console.log(email);
        // console.log(modelName);
        // console.log(registrationNumber);

        var myHeaders = new Headers();
        myHeaders.append("customerAuthToken", JSON.parse(localStorage.getItem("powerstrip-user-token")));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "name": name,
            "email": email,
            "ev_model": modelName,
            "registration_number": registrationNumber
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch(`${API_URL}/customer/details`, requestOptions)
        .then(response => response.json())
        .then((result) => {
            // console.log(result);
            if(result.status === "success"){
                setLoading(false);
                toast({
                    title: 'Data saved successfully.',
                    description: "We've saved your data. Thank you for providing the details.",
                    position: "top",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                })
                navigate(`/charge-point/${id}/session/${transactionId}`);
            }
            else{
                setError(result.message);
                setLoading(false);
                onOpen();
            }
        })
        .catch((error) => {
            setError("Failed to save. please try again");
            console.log('error', error);
            setLoading(false);
            onOpen();
        });
    }

    // ! Search EV Models



    return (
        <Container maxW="container.xl">
            <Link to={`/charge-point/${id}/session/${transactionId}`}>
                <Text mt="11px" as='ins' color="#0057FF" fontSize="16px">
                    Skip
                </Text>
            </Link>
            <Box mt="30px">
                <form onSubmit={handleSubmit}>
                    <Text mt="20px" color="#ffffff">Name *</Text>
                    <Input onChange={(e) => setName(e.target.value)}
                    type="text" color="#ffffff" size='lg' 
                    borderColor="#ffffff" required/>

                    <Text mt="20px" color="#ffffff">Email *</Text>
                    <Input onChange={(e) => setEmail(e.target.value)} 
                    type="email" color="#ffffff" size='lg' 
                    borderColor="#ffffff" required />

                    <Text mt="20px" color="#ffffff">EV Model Name</Text>
                    <Select borderColor="#ffffff" size='lg'
                    onChange={(e) => {setOemModel(e.target.value)}} 
                    mb="4" placeholder='Select OEM Model'>
                    {JSONOEMDATA.map((value, key) => {
                        return <option key={key} value={value.oem}>
                            {value.oem}
                        </option>
                    })}
                    </Select>

                    <Select borderColor="#ffffff" size='lg'
                    onChange={(e) => {setModelName(e.target.value)}} 
                    mb="4" placeholder='Select Model'>
                    {JSONMODELDATA.filter((val) => {
                        if(val.oem === oemModel) {
                            return val.model;
                        }
                    }).map((val, key) => {
                        return <option key={key} value={val.model}>
                            {val.model}
                        </option>
                        })}
                    </Select>

                    <Text mt="20px" color="#ffffff">Registration Number</Text>
                    <Input onChange={(e) => setRegistrationNumber(e.target.value)} 
                    type="text" color="#ffffff" size='lg' 
                    borderColor="#ffffff" />

                    <Button type="submit" mt="14%" colorScheme='#0057FF' bg="#0057FF" 
                    size='lg' color="#ffffff" w="100%" fontWeight="400">
                        Save
                        {loading &&
                        <Spinner ml="4" />
                        }
                    </Button>
                </form>
            </Box>

            <Modal size="xs" isOpen={isOpen} onClose={onClose} 
            scrollBehavior="inside" isCentered>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Search EV models</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {error}
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
 
export default DetailsForm;