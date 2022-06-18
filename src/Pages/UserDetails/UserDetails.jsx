import { Container } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import DetailsForm from "../../Components/DetailsForm/DetailsForm";
import useFetchJWTStatus from "../../Hooks/useFetchJWTStatus";   


const UserDetails = () => {

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

    return (
        <Container maxW="container.sm">
            
            <DetailsForm/>

        </Container>
    );
}
 
export default UserDetails;