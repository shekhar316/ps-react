import { useEffect, useState } from "react";

const usePostUserDetails = (payload) => {

    // ! States
    const [status, setStatus] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

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
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(payload);
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch(`${API_URL}/customer/details`, requestOptions)
        .then(response => response.json())
        .then((result) => {
            if(result.status === "success"){
                setStatus(result.status);
                setError("");
                setLoading(false);
            }
            else{
                setStatus(result.status);
                setError("Failed to save data.");
                setLoading(false);
            }
        })
        .catch((error) => {
            setError("Failed to save data.");
            setLoading(false);
        });

    },[API_URL, payload])

    //  return location
    return {status, error, loading};
}
 
export default usePostUserDetails;