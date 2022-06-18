import { useEffect, useState } from "react";

const useFetchWalletMoney = () => {

    // ! States
    const [balance, setBalance] = useState(0);
    const [mobileNumber, setMobileNumber] = useState();
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
        // console.log(API_URL);
        setLoading(true);
        var myHeaders = new Headers();
        myHeaders.append("customerAuthToken", JSON.parse(localStorage.getItem("powerstrip-user-token")));
        myHeaders.append("Content-Type", "application/json");
        
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        fetch(`${API_URL}/customer/wallet`, requestOptions)
        .then(response => response.json())
        .then((result) => {
            if(result.status === "success"){
                setLoading(false);
                setBalance(result.customer_wallet.balance)
                setMobileNumber(result.customer_wallet.mobile_number);
            }
            else{
                setLoading(false);
                setError("Failed to fetch wallet data.");
            }
            
        })
        .catch((error) => {
            setLoading(false);
            setError("Failed to fetch wallet data.");
        });

    },[API_URL])

    //  return location
    return {balance, mobileNumber, error, loading};
}
 
export default useFetchWalletMoney;