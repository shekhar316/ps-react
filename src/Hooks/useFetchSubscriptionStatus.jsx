import { useEffect, useState } from "react";

const useFetchSubscriptionStatus = (id) => {

    // ! States
    const [subscription, setSubscription] = useState();
    const [subscriptionValidity, setSubscriptionValidity] = useState("");

    //! API_URL variable
    let API_URL;

    //! Set API_URL based on env
        
    if(process.env.NODE_ENV !== 'production') {
        API_URL=process.env.REACT_APP_DEV_API_URL;
    }
    else{
        API_URL=process.env.REACT_APP_PROD_API_URL;
    }

    // !  useEffect
    
    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("customerAuthToken", JSON.parse(localStorage.getItem("powerstrip-user-token")));
        myHeaders.append("Content-Type", "application/json");
        
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        fetch(`${API_URL}/subscription/${id}`, requestOptions)
        .then(response => response.json())
        .then((result) => {
            // console.log("subscription");
            // console.log(result);
            // ! set subscription
            setSubscription(result.status);
            if(result.subscription) {
                setSubscriptionValidity(result.subscription.valid_till);
            }
        })
        .catch(error => console.log('error', error));

    },[API_URL, id])

    //  return location
    return {subscription, subscriptionValidity};
}
 
export default useFetchSubscriptionStatus;