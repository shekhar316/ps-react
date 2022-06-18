import { useEffect, useState } from "react";

const useFetchPaymentHistory = (id) => {

    // ! States
    const [payHistory, setPayHistory] = useState(null);
    const [message, setMessage] = useState("");
    const [failure, setFailure] = useState("");
    // const [location, setLocation] = useState("");
    // const [chargeRate, setChargeRate] = useState("");

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

        fetch(`${API_URL}/payment/history`, requestOptions)
        .then(response => response.json())
        .then((result) => {
            if(result.payments) {
                setPayHistory(result.payments);
            }
            if(result.status !== "success") {
                setFailure("Failed to fetch transaction history");
            }
        })
        .catch(error => console.log('error', error));

    },[API_URL, id])

    //  return location
    return {payHistory, failure};
}
 
export default useFetchPaymentHistory;