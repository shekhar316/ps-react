import { Text, Box, Container, Spinner, Flex } from "@chakra-ui/react";
import {
    Alert,
    AlertIcon
  } from '@chakra-ui/react';
import useFetchWalletMoney from "../../Hooks/useFetchWalletMoney";
import { BiRupee } from "react-icons/bi";

const Wallet = () => {

    // ! Using custom hook to fetch wallet
    const { balance, mobileNumber, error, loading } = useFetchWalletMoney();

    return (
        <Container maxW="container.sm" mt='31px'>
            {error ?
            <Alert status='error'>
            <AlertIcon />
            Failed to fetch wallet data.
            </Alert>
            :
            <Box>
                <Text color="#9A9A9A" fontSize="16px">
                    Total balance
                </Text>

                <Box mt="3">
                    {loading ?
                    <Box display='flex'>
                        <Spinner color="#ffffff" size='sm' /> 
                        <Text ml="3" fontSize="xs" color="#ffffff">Fetching data ...</Text>
                    </Box>
                    :
                    <Box color="#ffffff" fontSize="38px" display="flex">
                        <BiRupee/>
                        <Text mt="-2.5">
                        {balance}
                        </Text>
                    </Box>
                    }
                </Box>
            </Box>}
            

        </Container>
    );
}
 
export default Wallet;