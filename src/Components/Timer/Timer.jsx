import { useEffect } from "react";
import { Box, Text, Center } from "@chakra-ui/react";
import { useStopwatch } from 'react-timer-hook';
import moment from "moment";

const Timer = () => {

    // ! useStopwatch hook from react-timer-hook
    let {seconds, minutes, hours} = useStopwatch({ autoStart: true });

    let currentHours = moment().hours();
    let currentMinutes = moment().minutes();
    let currentSeconds = moment().seconds();

    let startHours = localStorage.getItem("powerstrip-start-hour");
    let startMinutes = localStorage.getItem("powerstrip-start-minute");
    let startSeconds = localStorage.getItem("powerstrip-start-second");

    // ! start time and end time
    var startTime = moment(`${startHours}:${startMinutes}:${startSeconds}`, 'HH:mm:ss');
    var currentTime = moment(`${currentHours}:${currentMinutes}:${currentSeconds}`, 'HH:mm:ss');

    let duration = moment.duration(currentTime.diff(startTime));

    //! duration in hours
    hours = parseInt(duration.asHours());

    //! duration in minutes
    minutes = parseInt(duration.asMinutes()) % 60;

    //! duration in seconds
    seconds = parseInt(duration.asSeconds())%60;

    useEffect(() => {
        localStorage.setItem("powerstrip-seconds",seconds);
        localStorage.setItem("powerstrip-minutes",minutes);
        localStorage.setItem("powerstrip-hours",hours);
    },[seconds, minutes, hours])

    return (
        <Box mt="40px"> 
            <Box display="flex" justifyContent="space-evenly">
                <Box>
                    <Text textAlign="center" mt="3" color="#FFA800" fontSize="24px" fontWeight="400">
                    Time charged
                    </Text>
                    <Center textAlign="center" fontSize="60px" mr="3" color="#ffffff">
                        <Box color="#ffffff" display="flex">
                            <Text>
                            {hours > 0 ? 
                            hours < 10 ?
                            `${hours}`
                            : 
                            `${hours}`
                            : 
                            ""}
                            </Text>
                            {hours > 0 ?
                            <Text ml="2px" mt="40px" fontSize="2xl">
                                hr
                            </Text>
                            :
                            <Text></Text>}
                        </Box>
                        <Box color="#ffffff" display="flex">
                            <Text ml="3">
                            {minutes > 0 ? 
                            minutes < 10 ?
                            `${minutes}`
                            : 
                            `${minutes}`
                            : 
                            ""}
                            </Text>
                            {minutes > 0 ?
                            <Text mt="40px" fontSize="2xl">
                                min
                            </Text>
                            :
                            <Text ml="2px" mt="40px" fontSize="2xl">
                            </Text>}
                        </Box>
                        <Box color="#ffffff" display="flex">
                            <Text ml="3">
                            {seconds < 10 ?
                            `${seconds}`
                            :
                            `${seconds}`}
                            </Text>
                            {seconds >= 0 ?
                            <Text ml="2px" mt="40px" fontSize="2xl">
                                sec
                            </Text>
                            :
                            <Text></Text>}
                        </Box>
                    </Center>
                </Box>
            </Box>
        </Box>
    );
}
 
export default Timer;