import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Text, Box, Image, Center, Button, Textarea, Spinner } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
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
  } from '@chakra-ui/react'
import EvScooterRider from "../../Assets/freecharging.svg";
import RatingOne from "../../Assets/rate-one.svg";
import RatingTwo from "../../Assets/rate-two.svg";
import RatingThree from "../../Assets/rate-three.svg";
import RatingFour from "../../Assets/rate-four.svg";
import RatingFive from "../../Assets/rate-five.svg";
import celebrate from "../../Assets/confetti.png"
import DetailsForm from "../../Components/DetailsForm/DetailsForm";
import { useToast } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import useFetchJWTStatus from "../../Hooks/useFetchJWTStatus";
import useFetchWalletMoney from "../../Hooks/useFetchWalletMoney";



const FreePayment = () => {

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

    // ! Get wallet balance
    const { balance, mobileNumber, error, loading } = useFetchWalletMoney();

    //! API_URL variable
    let API_URL;

    //! Set API_URL based on env
        
    if(process.env.NODE_ENV !== 'production') {
        API_URL=process.env.REACT_APP_DEV_API_URL;
    }
    else{
        API_URL=process.env.REACT_APP_PROD_API_URL;
    }

    // ! useToast from chakra UI
    const toast = useToast();

    // ! useDisclosure hook from chakra UI
    const { isOpen, onOpen, onClose } = useDisclosure();

    // ! States
    // const [chargeSuccessMsg, setChargeSuccessMessage] = useState(false);
    // const [loading, setLoading] = useState();
    const [totalAmount, setTotalAmount] = useState(0);
    const [refundAmount, setRefundAmount] = useState(0);
    const [spinner, setSpinner] = useState(false);
    const [rating, setRating] = useState(-1);
    const [review, setReview] = useState("");
    const [rateOne, setRateOne] = useState(8);
    const [rateTwo, setRateTwo] = useState(8);
    const [rateThree, setRateThree] = useState(8);
    const [rateFour, setRateFour] = useState(8);
    const [rateFive, setRateFive] = useState(8);

    const hours = localStorage.getItem("powerstrip-hours");
    const minutes = localStorage.getItem("powerstrip-minutes");
    const seconds = localStorage.getItem("powerstrip-seconds");
    const cost = (parseInt((3600*hours)) + parseInt((60*minutes)) + parseInt(seconds)) * 0.005;
    const totalCost = cost.toFixed(2);

    let leftHourInMin = hours * 60;
    let leftMinutesInMin = minutes;
    let leftSecondsInMin = (seconds * 1/60).toFixed(2);

    let totalLeftOutTime = parseInt(leftHourInMin) + parseInt(leftMinutesInMin) + parseInt(leftSecondsInMin);
    const [couponMessage, setCouponMessage] = useState("");


    // ! useEffect
    useEffect(() => {

        if(localStorage.getItem("powerstrip-refund-amount")) {
            let refundMoney = parseFloat(localStorage.getItem("powerstrip-refund-amount"));
            setRefundAmount(refundMoney.toFixed(1));
        }

        let amount = localStorage.getItem("powerstrip-charge-amount");
        let refund = localStorage.getItem("powerstrip-refund-amount");
        setTotalAmount(amount - refund);
        // removing the receipt id from localstorage
        localStorage.removeItem("powerstrip-receipt");
        localStorage.removeItem("powerstrip-start-hour");
        localStorage.removeItem("powerstrip-start-minute");
        localStorage.removeItem("powerstrip-start-second");

        // onOpen();

        // if(totalLeftOutTime < localStorage.getItem("charge-duration")){
        //     setCouponMessage(`You have ${totalLeftOutTime} minutes of charging left in your wallet`);
        //     onOpen();
        // }

        // !get charge details
        // var myHeaders = new Headers();
        // myHeaders.append("customerAuthToken", JSON.parse(localStorage.getItem("powerstrip-user-token")));
        // myHeaders.append("Content-Type", "application/json");

        // var requestOptions = {
        //   method: 'GET',
        //   headers: myHeaders,
        //   redirect: 'follow'
        // };

        // fetch(`${API_URL}/charge/b9a0dbba75844028a4c2bad751d877d7`, requestOptions)
        // .then(response => response.json())
        // .then((result) => {
        //     console.log("Charge details");
        //     console.log(result);
        // })
        // .catch(error => console.log('error', error));
        // !get charge details

    },[])

    function handleSizeOne(){
        setRateOne(10);
        setRateTwo(8);
        setRateThree(8)
        setRateFour(8);
        setRateFive(8);
    }

    function handleSizeTwo(){
        setRateOne(8);
        setRateTwo(10);
        setRateThree(8)
        setRateFour(8);
        setRateFive(8);
    }

    function handleSizeThree(){
        setRateOne(8);
        setRateTwo(8);
        setRateThree(10)
        setRateFour(8);
        setRateFive(8);
    }

    function handleSizeFour(){
        setRateOne(8);
        setRateTwo(8);
        setRateThree(8)
        setRateFour(10);
        setRateFive(8);
    }

    function handleSizeFive(){
        setRateOne(8);
        setRateTwo(8);
        setRateThree(8)
        setRateFour(8);
        setRateFive(10);
    }

    function handleSubmit(e){
        setSpinner(true);
        e.preventDefault();
        console.log(rating);
        console.log(review);

        var myHeaders = new Headers();
        myHeaders.append("customerAuthToken", JSON.parse(localStorage.getItem("powerstrip-user-token")));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "rating": rating,
            "review": review
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch(`${API_URL}/customer/review`, requestOptions)
        .then(response => response.json())
        .then((result) => {
            if(result.status === "success"){
                setSpinner(false);
                toast({
                    title: 'Review saved successfully.',
                    description: "Thank you for reviewing. It will help us make our service better.",
                    position: "top",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                })
            }
            else{
                setSpinner(false);
                toast({
                    title: "Error",
                    description: "Failed to save. Please try again",
                    position: "top",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                })
            }
        })
        .catch((error) => {
            console.log('error', error);
            setSpinner(false);
            toast({
                title: "Error",
                description: "Failed to save. Please try again",
                position: "top",
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        });
    }


    return (
        <Container maxW={["container.xl", "container.xl", "container.sm"]}>

        <Table mt="3" variant='simple'>
        <TableCaption color="#ffffff" mb="3" placement="top" textAlign="left" fontSize="xl">
            Charging session summary
        </TableCaption>
        <Tbody color="#ffffff" borderColor="#ffffff">
            <Tr>
                <Td>Charge Time</Td>
                <Td>
                {`
                    ${hours > 0 ?
                        `${hours} hr`
                        :
                        ""
                    }
                    ${minutes > 0 ?
                        `${minutes} min`
                        :
                        ""
                    }
                    ${seconds > 0 ?
                        `${seconds} sec`
                        :
                        ""
                    }
                `} 
                </Td>
            </Tr>

            {JSON.parse(localStorage.getItem("powerstrip-charge-amount")) !== 0 ?
            <>
            {refundAmount > 0 ?
            <Tr>
                <Td>Refund Amount</Td>
                <Td>INR {refundAmount}</Td>
            </Tr>
            :
            ""}
            </>
            :
            <></>}

            {JSON.parse(localStorage.getItem("powerstrip-charge-amount")) !== 0 ?
            <Tr>
                <Td>Total Cost</Td>
                <Td>INR {totalAmount.toFixed(1)}</Td>
            </Tr>
            :
            <></>}
        </Tbody>
        </Table>

            {/* here */}
            {/* <Box my="20px" border="1px" borderColor="#ffffff" 
            borderRadius="10px" py="10">
                <Text textAlign="center" fontSize="3xl" fontWeight="400">
                    {refundAmount}
                </Text>
                <Text textAlign="center">
                    remaining in your wallet
                </Text>
                <Text textAlign="center" fontSize="xl" mt="2">
                    INR {totalLeftOutTime * 0.3}
                </Text>
            </Box> */}

            {/* <Center>
                <Image w="303px" h="246px"
                src={EvScooterRider} alt='Dan Abramov' />
            </Center> */}

            <Box mt="30px">
                {/* <Text fontSize="18px" color="#ffffff">
                    Hey, your EV is charged ! (
                    {`
                    ${hours > 0 ?
                        `${hours} hr`
                        :
                        ""
                    }
                    ${minutes > 0 ?
                        `${minutes} min`
                        :
                        ""
                    }
                    ${seconds > 0 ?
                        `${seconds} sec`
                        :
                        ""
                    }
                    `}
                )
                </Text> */}

                <Box>
                    {/* <Text mt="5px" fontSize="18px" color="#ffffff">
                        Charging complete. 
                    </Text> */}
                    {/* <Text fontSize="18px" color="#ffffff">
                    {`
                    ${hours > 0 ?
                        `${hours} hr`
                        :
                        ""
                    }
                    ${minutes > 0 ?
                        `${minutes} min`
                        :
                        ""
                    }
                    `}
                    </Text> */}
                    {/* <Text mt="5px" fontSize="18px" color="#ffffff">
                        Add more details to your profile to win
                        <span className="next-free-charge-text">
                        next charge free!
                        </span>
                    </Text> */}

                    {/* <Link to="/payment/user/details">
                    <Box onClick={onOpen}
                    h="10" mt="3" w="20" ml="1" bg="#0057FF" 
                    borderRadius="3px">
                        <Center color="#ffffff" pt="3">
                        <i className="fas fa-arrow-right"></i>
                        </Center>
                    </Box>
                    </Link> */}

                </Box>

            </Box>

            <Box mt='40px'>
                <form onSubmit={handleSubmit}>
                    <Text fontSize="18px" color="#ffffff">
                        How was your experience ?
                    </Text>

                    <Box display="flex" py="4">
                        <Image onClick={() => {setRating(1); handleSizeOne()}} 
                        mr="19px" src={RatingOne} w={`${rateOne}`}/>

                        <Image onClick={() => {setRating(2); handleSizeTwo()}} 
                        mr="19px" src={RatingTwo} w={`${rateTwo}`}/>

                        <Image onClick={() => {setRating(3); handleSizeThree()}} 
                        mr="19px" src={RatingThree} w={`${rateThree}`}/>

                        <Image onClick={() => {setRating(4); handleSizeFour()}} 
                        mr="19px" src={RatingFour} w={`${rateFour}`}/>
                        
                        <Image onClick={() => {setRating(5); handleSizeFive()}} 
                        mr="19px" src={RatingFive} w={`${rateFive}`}/>
                    </Box>

                    <Textarea 
                    onChange={(e) => setReview(e.target.value)}
                    bg="#ffffff" color="#545454" 
                    placeholder='Add review'
                    _placeholder={{ color: '#545454' }}
                    rows={3}
                    fontSize="16px"
                    size="lg" />

                    <Button mb="4" type="submit" mt="19px" colorScheme='#0057FF' bg="#0057FF" 
                    size='lg' color="#ffffff" w="100%" fontWeight="400">
                        Submit
                        {spinner &&
                        <Spinner ml="4" />
                        }
                    </Button>

                </form>
            </Box>

            <Modal size="xs" isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent py="10">
                <ModalCloseButton />
                <ModalBody>
                    <Center>
                        <Image src={celebrate} boxSize='50px' objectFit='cover' />
                    </Center>
                    <Text mt="3" color="#ffffff" textAlign="center">
                    {/* {couponMessage} */}
                    Hurray! Your charge was successful, 
                    please take a few moment to rate your experience.
                    </Text>
                    <Button mt="2" w='100%' colorScheme='#0057FF' bg="#0057FF" 
                    mr={3} color="#ffffff" onClick={onClose}>
                        OK
                    </Button>
                </ModalBody>
                </ModalContent>
            </Modal>

        </Container>
    );
}
 
export default FreePayment;