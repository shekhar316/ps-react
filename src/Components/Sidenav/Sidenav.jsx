import { Box, Avatar, Text, Divider, Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from '@chakra-ui/react';
import useFetchWalletMoney from "../../Hooks/useFetchWalletMoney";
import useFetchUserDetails from "../../Hooks/useFetchUserDetails";

const Sidenav = () => {

    // get balance
    const { balance, mobileNumber, error, loading } = useFetchWalletMoney();

    // get user data
    const { userData } = useFetchUserDetails();

    // ! useNavigate
    const navigate = useNavigate();

    const { isOpen, onOpen, onClose } = useDisclosure();

    function handleRedirectWallet(){
        onOpen();
        navigate("/user/add/money/wallet");
        onClose();
    }

    return (
        <Box>

            {/* <Box mt='14px' display="flex">
            <Avatar name='Kola Tioluwani' src='https://bit.ly/tioluwani-kolawole' />
            <Box ml="3">
                {userData &&
                <Text fontSize="20px" color="#ffffff">
                    {userData.name}
                </Text>}
                {mobileNumber &&
                <Text fontSize="16px" color="#ffffff">
                    +91{mobileNumber}
                </Text>}
            </Box>
            </Box>

            <Divider bg="#A3A3A3" mt="13px" color="#ffffff" />

            <Box onClick={handleRedirectWallet}  my="12px">
                <Box>
                   <Text fontSize="24px">Wallet</Text> 
                   <Box fontSize="16px">
                   {loading ?
                    <Box display="flex">
                        <Spinner color="#ffffff" size='sm' /> 
                        <Text ml="3" fontSize="xs" color="#ffffff">Fetching data ...</Text>
                    </Box>
                    :
                    `Rs ${balance}`
                    } 
                    </Box> 
                </Box>
            </Box>

            <Divider bg="#A3A3A3" mt="13px" color="#ffffff" />

            <Box  my="12px">
                <Box>
                   <Text fontSize="24px">Customer Support</Text> 
                   <a href="mailto:help@powerstrip.in">
                   <Text mt="1" fontSize="16px">
                       help@powerstrip.in
                    </Text>
                    </a>

                    <a href="tel:+918905336393">
                   <Text mt="1" fontSize="16px">+918905336393</Text> 
                   </a> 
                </Box>
            </Box>

            <Divider bg="#A3A3A3" mt="13px" color="#ffffff" /> */}

        </Box>
    );
}
 
export default Sidenav;