import { useEffect, useState } from "react";

const useFetchLocation = (id) => {

    // ! States
    const [location, setLocation] = useState("");
    const [chargeRate, setChargeRate] = useState("");
    const [DEVICE_TYPE, setDEVICE_TYPE] = useState("");

    //! API_URL variable
    let API_URL;

    //! Set API_URL based on env
        
    if(process.env.NODE_ENV !== 'production') {
        API_URL=process.env.REACT_APP_DEV_API_URL;
    }
    else{
        API_URL=process.env.REACT_APP_PROD_API_URL;
    }

    // ! useEffect
    
    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        fetch(`${API_URL}/device/${id}`, requestOptions)
        .then(response => response.json())
        .then((result) => {
            // console.log("location");
            // console.log(result);
            // ! set charge rate
            if(result.device) {
                setChargeRate(result.device.charge_rate);
                setDEVICE_TYPE(result.device.type);
            }
            // ! set location
            if(result.device.site || result.device.site_area) {
                setLocation(result.device.site + " " + result.device.site_area);
                localStorage.setItem("powerstrip-charging-station", result.device.site + " " + result.device.site_area);  
            }
        })
        .catch(error => console.log('error', error));

    },[API_URL, id])

    //  return location
    return {location, DEVICE_TYPE};
}
 
export default useFetchLocation;