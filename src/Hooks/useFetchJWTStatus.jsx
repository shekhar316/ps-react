import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useFetchLocation = () => {

    // ! States
    const [data, setData] = useState();
    // const [activeSession, setActiveSession] = useState(false);

    // ! UseNavigate hook from react-router-dom
    const navigate = useNavigate();

    //! API_URL variable
    let API_URL;

    //! Set API_URL based on env
        
    if(process.env.NODE_ENV !== 'production') {
        API_URL=process.env.REACT_APP_DEV_API_URL;
    }
    else{
        API_URL=process.env.REACT_APP_PROD_API_URL;
    }

    //  useEffect
    
    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("customerAuthToken", JSON.parse(localStorage.getItem("powerstrip-user-token")));
        myHeaders.append("Content-Type", "application/json");
        
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        fetch(`${API_URL}/auth/customer/jwt`, requestOptions)
        .then(response => response.json())
        .then((result) => {
            setData(result);
            if(result.status === "error"){
                localStorage.removeItem("powerstrip-user-token");
                navigate("/login");
            }
        })
        .catch(error => console.log('error', error));

    },[API_URL])

    //  return location
    return {data};
}
 
export default useFetchLocation;