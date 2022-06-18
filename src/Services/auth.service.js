
//! API_URL variable
let API_URL;

//! Set API_URL based on env
        
if(process.env.NODE_ENV !== 'production') {
    API_URL=process.env.REACT_APP_DEV_API_URL;
}
else{
    API_URL=process.env.REACT_APP_PROD_API_URL;
}

const login = (OTP) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "mobile_number": localStorage.getItem("powerstrip-user-phone-number"),
        "otp": OTP,
        "token": "ea97bfe2a42c4d9995ff097a81ee5065"
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch(`${API_URL}/auth/customer/verify-otp`, requestOptions)
    .then(response => response.json())
    .then((result) => {
        // console.log(result);
        // ! get user jwt token
        if (result.customerAuthToken) {
            localStorage.setItem("powerstrip-user-token", JSON.stringify(result.customerAuthToken));
        }
        return result.status;
    })
    .catch(error => console.log('error', error));
}

const logout = () => {
    localStorage.removeItem("powerstrip-user-token");
};
  
const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("powerstrip-user-token"));
};

const authenticationService = {
    login,
    logout,
    getCurrentUser
};
  
export default authenticationService;