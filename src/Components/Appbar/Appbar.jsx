import { Link, useNavigate } from "react-router-dom";
import { Box, Container, Image, IconButton, Button, Divider, Text, Avatar, Spinner } from "@chakra-ui/react";
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
  } from '@chakra-ui/react';
import Logo from "../../Assets/powerstrip-logo.png";
import { HamburgerIcon } from '@chakra-ui/icons';
import { useDisclosure } from '@chakra-ui/react';
import { BsChevronRight } from "react-icons/bs";
import { BiArrowFromLeft } from "react-icons/bi";
import Footer from "../Footer/Footer";
import useFetchWalletMoney from "../../Hooks/useFetchWalletMoney";
import useFetchUserDetails from "../../Hooks/useFetchUserDetails";


const Appbar = () => {

    // get balance
    const { balance, mobileNumber, error, loading } = useFetchWalletMoney();

    // get user details
    const { userData } = useFetchUserDetails();

    // ! useNavigate
    const navigate = useNavigate();

    // ! get current user
    const currentUser = localStorage.getItem("powerstrip-user-token");

    const { isOpen, onOpen, onClose } = useDisclosure();

    function handleRedirectWallet(){
        navigate("/user/add/money/wallet");
        onClose();
    }

    function handleLogout(){
        localStorage.removeItem("powerstrip-user-token");
        navigate("/login");
        onClose();
    }

    return (
        <Container maxW={["container.xl", "container.xl", "container.sm"]}>
            <Box display="flex">
                <Link to="/">
                    <Image
                    src={Logo}
                    w="200px"
                    h="55px"
                    mt="1"
                    />
                </Link>

                {currentUser &&
                <Box ml="auto" mt="2">
                <IconButton onClick={onOpen} aria-label="Search database" icon={<HamburgerIcon w={5} h={5} />} />
                </Box>}
            </Box>

            <Drawer size="xs" placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent bg="#000000">
                <DrawerCloseButton />
                <DrawerBody>
                    
                <Box>
                    <Box mt='14px' display="flex">
                    <Avatar name={userData && userData.name} src='https://bit.ly/tioluwani-kolawole' />
                    <Box ml="3">
                        <Text fontSize="20px" color="#ffffff">
                            {userData &&
                            <>
                            {userData.name}
                            </>
                            }
                        </Text>
                        {mobileNumber &&
                        <Text fontSize="16px" color="#ffffff">
                            {`+91${mobileNumber}`}
                        </Text>}
                    </Box>
                    </Box>

                    <Divider bg="#A3A3A3" mt="13px" color="#ffffff" />

                    <Box display="flex" onClick={handleRedirectWallet}  my="12px">
                        <Box>
                        <Text fontSize="24px" color="#ffffff">Wallet</Text> 
                        <Box fontSize="16px" color="#ffffff">
                        {loading ?
                            <Box display="flex" color="#ffffff">
                                <Spinner color="#ffffff" size='sm' /> 
                                <Text ml="3" fontSize="xs" color="#ffffff">Fetching data ...</Text>
                            </Box>
                            :
                            `Rs ${balance}`
                            } 
                        </Box> 
                        </Box>
                        <Box ml="auto" mr="3">
                            <Text mt="3" fontSize="2xl" fontWeight="600">
                            <BsChevronRight/>
                            </Text>
                        </Box>
                    </Box>

                    <Divider bg="#A3A3A3" mt="13px" color="#ffffff" />

                    <Box  my="12px">
                        <Box color="#ffffff">
                        <Text color="#ffffff" fontSize="24px">Contact Us</Text> 
                        <a href="mailto:support@powerstrip.in">
                        <Text color="#ffffff" mt="1" fontSize="16px">
                            support@powerstrip.in
                            </Text>
                            </a>

                            {/* <a href="tel:+918905336393">
                        <Text color="#ffffff" mt="1" fontSize="16px">+918905336393</Text> 
                        </a>  */}
                        </Box>
                    </Box>
                    <Divider bg="#A3A3A3" mt="13px" color="#ffffff" />
                    </Box>

                    <Button onClick={handleLogout} color="#ffffff" bg='#C53030' 
                    colorScheme='#C53030' w="100%" size='lg' mt="10">
                        Logout
                    </Button>
                </DrawerBody>

                <DrawerFooter>
                    <Footer/>
                </DrawerFooter>

                </DrawerContent>
            </Drawer>

        </Container>
    );
}

export default Appbar;