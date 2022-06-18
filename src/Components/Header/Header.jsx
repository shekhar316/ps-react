import "./Header.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Heading, Box, Badge, Text } from "@chakra-ui/react";

const Header = (props) => {

    // ! useParams hook
    const {id} = useParams();

    // ! States
    const [userPhoneNumber, setUserPhoneNumber] = useState();
    const [station, setStation] = useState();

    // ! useEffect hook
    useEffect(() => {
        setUserPhoneNumber(localStorage.getItem("powerstrip-user-phone-number"));
        setStation(localStorage.getItem("powerstrip-charging-station"));
    },[station])

    return (
        <Container maxW={["container.xl", "container.xl", "container.sm"]}>

            <Text fontSize="36px" color="#ffffff">
                {props.title}
            </Text>

            <Box display="flex" flexWrap="wrap" ml="-3">
                {userPhoneNumber &&
                <Badge px="2" mr="2" mt="2" bg="#E3FCFF" color="#000000">
                    <Text p="0">
                        <i className="fas fa-user header-icon" pr="2"></i> 
                        { userPhoneNumber }
                    </Text>
                </Badge>}

                { station &&
                <Badge px="2" mr="2" mt="2" bg="#E3FCFF" color="#000000">
                    <Text>
                        <i className="fas fa-map-marker-alt header-icon"></i> 
                        { station }
                    </Text>
                </Badge>}
            </Box>

        </Container>
    );
}
 
export default Header;
