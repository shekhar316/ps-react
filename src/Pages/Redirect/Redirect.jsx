import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import SplashScreen from "../../Components/SplashScreen/SplashScreen";
import useFetchLocation from "../../Hooks/useFetchLocation";

const Redirect = () => {

    const navigate = useNavigate();

    const {id} = useParams();

    const [splashScreen, setSplashScreen] = useState(true);
    const [device, setDevice] = useState("");

    // !Using custom hook to fetch location and charge rate
    // const { location } = useFetchLocation(id);

    //! API_URL variable
    let API_URL;

    //! Set API_URL based on env
            
    if(process.env.NODE_ENV !== 'production') {
        API_URL=process.env.REACT_APP_DEV_API_URL;
    }
    else{
        API_URL=process.env.REACT_APP_PROD_API_URL;
    }


    useEffect(() => {
        setTimeout(() => {
            setSplashScreen(false);
        },3000);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        fetch(`${API_URL}/device/device-id/${id}`, requestOptions)
        .then(response => response.json())
        .then((result) => {
            // console.log(result);
            // ! set charge rate
            if(result.device) {
                navigate(`/charge-point/device/${result.device.id}`);
                // setDevice(result.device.id);
            }
        })
        .catch(error => console.log('error', error));

        // navigate(`/charge-point/device/${device}`);
    },[])

    return (
        <Box>
            {splashScreen &&
            <SplashScreen/>
            }
        </Box>
    );
}
 
export default Redirect;