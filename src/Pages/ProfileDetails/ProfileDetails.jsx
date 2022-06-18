import { Container } from "@chakra-ui/react";
import DetailsForm from "../../Components/DetailsForm/DetailsForm";
import useFetchJWTStatus from "../../Hooks/useFetchJWTStatus";   


const ProfileDetails = () => {

    // ! get jwt status
    const jwt = useFetchJWTStatus();

    return (
        <Container maxW="container.sm">
            
            <DetailsForm/>

        </Container>
    );
}
 
export default ProfileDetails;