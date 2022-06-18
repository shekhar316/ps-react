import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Center } from "@chakra-ui/react";
import {
    Alert,
    AlertIcon,
    AlertTitle
  } from '@chakra-ui/react';
import QrReader from "react-qr-reader";
import useFetchJWTStatus from "../../Hooks/useFetchJWTStatus";   
import axios from "axios";
import { ArrowRightIcon} from "@chakra-ui/icons";




const Scanner = () => {
    const navigate = useNavigate();
    // !check if there is any active charging session
    const { data } = useFetchJWTStatus();
    if(localStorage.getItem("powerstrip-user-token") && data) {
        if(localStorage.getItem("powerstrip-device-id")) {
            let deviceId = localStorage.getItem("powerstrip-device-id");
            if(data.customer) {
                if(data.customer.charge_session) {
                    if(data.customer.charge_session.id !== null) {
                        navigate(`/charge-point/${deviceId}/session/${data.customer.charge_session.id}`);
                    }
                }
            }
        }
    }

    // ! States
    const [instructions, setInstructions] = useState("Please scan a powerstrip QR code or Enter device ID to continue.");
    const [codeError, setCodeError] = useState();
    const [error, setError] = useState(false);


    // ! Function to handle scan
    function handleScan(data){
        if (data) {
            if(data.includes("app.powerstrip.in")){
                setInstructions("");
                window.location.replace(data);
            }
            else{
                setInstructions("");
                setCodeError("Please provide a powerstrip QR code and Try again"); 
                window.location.reload();
            }
        }
    }

    // ! Function to handle error while scanning
    function handleError(err){
        // console.log(err + "Failed to scan");
        setInstructions("");
        setError(true);
    }
    // const [link,setLink]=useState('app.powerstrip.com/charge-point/:')
    const [link,setLink]=useState('')

    
    const handleChange=(e) =>{
        //setLink('https://reqres.in/api/users?page='+e.target.value);
        setLink('https://app.powerstrip.in/charge-point/'+e.target.value);
    }

    const submit =async (e)=>{
        e.preventDefault();console.log("submit fnc.");
        console.log(link,"link is here")
        const res=await axios.get(link); setBpr(1);
        console.log(res.data,"res")
        
        
    }
      
    
    const [bpr,setBpr]=useState(0);
  



    return (
        <div ><Container  >
        {instructions &&
            <Alert px="auto" status='success' variant='left-accent' mt="10">
            <AlertTitle mx="auto">
                { instructions }
            </AlertTitle>
            </Alert>}

  <form onSubmit={(e)=>submit(e)}  >
  <Center mt={["5", "0", "0"]}>
  <input style={{"position":"flex","marginTop":"1rem","padding-left":"1rem", "minHeight":"2rem", "width":"14rem" ,"backgroundColor":"inherit", "color":"white", "border-bottom":"2px solid", "border-top":"2px solid" , "border-right":"2px solid" , "border-left":"3.2px solid #399e68"}} onChange={(e=>handleChange(e))} placeholder="Enter Device ID "/> {link.length>48 ? (  <a style={{"marginTop":"1rem","paddingLeft":"0.9rem", "minHeight":"2rem",  "backgroundColor":"inherit", "color":"white", "borderBlockColor":"white","margin-top":"23px"}} href={link} > <ArrowRightIcon />  </a>):("")}   </Center>
</form >

       
        
<Center mt={["20", "20", "0"]}>
      
            <QrReader
            delay={300}
            onError={ handleError }
            onScan={ handleScan }
            style={{ width: '69%' }}

            
            />
            
            </Center>
            

           
            {codeError &&
            <Alert px="auto" status='error' variant='left-accent' mt="10">
            <AlertTitle mx="auto">
                { codeError }
            </AlertTitle>
            </Alert>}

            {error &&
            <Alert px="auto" status='error' variant='left-accent'>
            <AlertIcon />
            <AlertTitle>
                Failed to scan please check camera permission.
            </AlertTitle>
            </Alert>}
 
        </Container>
     

        </div>
    );
}
 
export default Scanner;


