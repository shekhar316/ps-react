import { Box, Center, Image, Spinner } from '@chakra-ui/react';
import SplashScreenImg from "../../Assets/powerstrip-logo-new.png";

const SplashScreen = () => {
    return (
        <Box position="fixed" zIndex="3" bg="#203E4E" 
        top="0" bottom="0" left="0" right="0">
            <Center>
            <Image mt={["40%", "35%", "10%"]}
                boxSize='300px'
                objectFit='cover'
                src={SplashScreenImg}
                alt='Dan Abramov'
            />
            <Spinner position="fixed" mt={["85%", "70%", "20%"]} color='#ffffff' />
            </Center>
        </Box>
    );
}
 
export default SplashScreen;