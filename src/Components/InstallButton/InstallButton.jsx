import { useEffect, useState } from 'react';
import { Container, Center, Box, Text, Button } from '@chakra-ui/react';

const InstallButton = () => {

    let deferredPrompt;

    const [installable, setInstallable] = useState(false);

    useEffect(() => {
        window.addEventListener("beforeinstallprompt", (e) => {
          // Prevent the mini-infobar from appearing on mobile
          e.preventDefault();
          // Stash the event so it can be triggered later.
          deferredPrompt = e;
          // Update UI notify the user they can install the PWA
          setInstallable(true);
        });
    
        window.addEventListener('appinstalled', () => {
          // Log install to analytics
          console.log('INSTALL: Success');
          deferredPrompt = null;
        });
    }, []);

    const handleInstallClick = (e) => {
        // Hide the app provided install promotion
        setInstallable(false);
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
        });
    };

    return (
        <Container bg="#262728" maxW="container.sm" 
        position="fixed" w="100%" bottom="0" left="0" right="0">
            {installable &&
            <Center>
            <Box py="3" display="flex" justifyContent="center" color='#ffffff'>
                <Text mr="3" mt="1">Install Powerstrip Webapp</Text>
                <Button onClick={handleInstallClick}
                px="5" color="#ffffff" colorScheme="#0057FF" 
                bg="#0057FF" size='sm'>
                    Install
                </Button>
            </Box>
            </Center>}
        </Container>
    );
}
 
export default InstallButton;