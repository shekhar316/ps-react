import "./DetailsPrompt.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Container, Center, Image, Box, Text, Button } from '@chakra-ui/react';
import EvScooterRider from "../../Assets/freecharging.svg";
import useFetchJWTStatus from "../../Hooks/useFetchJWTStatus";   


const DetailsPrompt = () => {

    // ! useNavigate
    const navigate = useNavigate();

    // ! get jwt status
    const { data } = useFetchJWTStatus();
    if(localStorage.getItem("powerstrip-user-token") && data) {
        if(localStorage.getItem("powerstrip-device-id")) {
            let deviceId = localStorage.getItem("powerstrip-device-id");
            if(data.customer.charge_session.id !== null) {
                navigate(`/charge-point/${deviceId}/session/${data.customer.charge_session_id}`);
             }
        }
    }

    // ! useParams hook
    const {id} = useParams();
    const {transactionId} = useParams();

    return (
        <Container maxW="container.sm">
            <Center mt="20%">
                <Image w="303px" h="246px"
                src={EvScooterRider} alt='Dan Abramov' />
            </Center>

            <Box mx="12px">
                <Text fontSize="19px" color="#ffffff">
                    Hey, your EV is being charged !
                </Text>

                <Text mt="19px" fontSize="19px" color="#ffffff">
                    Add more details to your profile to win
                    <span className="next-free-charge-text">
                    next charge free !
                    </span>
                </Text>

                <Link to={`/charge-point/${id}/session/${transactionId}`}>
                    <Text mt="11px" as='ins' color="#0057FF" fontSize="16px">
                        Skip
                    </Text>
                </Link>
            </Box>

            <Link to={`/details/user/${id}/${transactionId}`}>
                <Button mt="20%" colorScheme='#0057FF' bg="#0057FF" 
                size='lg' color="#ffffff" w="100%" fontWeight="400">
                    Add details
                </Button>
            </Link>
        </Container>
    );
}
 
export default DetailsPrompt;