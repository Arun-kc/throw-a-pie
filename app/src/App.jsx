import {ChakraProvider, Box, Text, Button, Input, Stack, Center, CircularProgress, Image, Link} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { ethers } from "ethers";
import './App.css';
import piePortal from "./utils/PiePortal.json"

export default function App() {

/*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  const [allPies, setAllPies] = useState([]);
  const [latestCount, setLastestCount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const [error, setError] = React.useState('')

  const onChange = async(str) => {
    setError('');
    setMessage(str);
  }


  const contractAddress = process.env.CONTRACT_ADDRESS;
  const contractABI = piePortal.abi;
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      
      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

    /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  const getPieCount = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const piePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        const count = await piePortalContract.getTotalPies()
        setLastestCount(count.toNumber())
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }


  /*
   * Create a method that gets all waves from your contract
   */
  const getAllPies = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const piePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const pies = await piePortalContract.getAllPies();

        let piesCleaned = [];
        pies.forEach(pie => {
          piesCleaned.push({
            address: pie.thrower,
            timestamp: new Date(pie.timestamp * 1000),
            message: pie.message
          });
        });

        setAllPies(piesCleaned);

        piePortalContract.on('NewPie', (from, timestamp, message) => {
          console.log('NewPie', from, timestamp, message);

          setAllPies((prevState) => [
            ...prevState,
            {
              address: from,
              timestamp: new Date(timestamp * 1000),
              message: message,
            },
          ]);
        });


      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const pie = async () => {
    try {
      const { ethereum } = window;

      if (ethereum && message) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const piePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await piePortalContract.getTotalPies();
        console.log("Retrieved total pie count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const pieTxn = await piePortalContract.pie(message, {
          gasLimit: 300000,
        });
        setLoading(true);
        console.log("Mining...", pieTxn.hash);

        await pieTxn.wait();
        setLoading(false);
        setMessage('');
        setError('');
        console.log("Mined -- ", pieTxn.hash);

        count = await piePortalContract.getTotalPies();
        console.log("Retrieved total pie count...", count.toNumber());

      } else {
        console.log("Ethereum object doesn't exist!");
        setError('You need to include a message.')
      }
    } catch (error) {
      console.log(error)
      setLoading(false);
      await alert("Don't rush buddy!! Relax for 15 mins 😉");
    }
}

  
  useEffect(() => {
    checkIfWalletIsConnected();
    getPieCount();
  }, [])
  
  return (
    <ChakraProvider>
      <div className="mainContainer">
      {!loading && (
        <div className="dataContainer">
          <Text
            bgGradient='linear(to-l, #f83600, #fe8c00)'
            bgClip='text'
            fontSize='5xl'
            fontWeight='extrabold'
            textAlign = {'center'}
          >
            Lets throw some 🥧!
          </Text>
          <Text
            bgGradient='linear(to-l, #1e7be6, #82e0f0)'
            bgClip='text'
            fontSize='3xl'
            fontWeight='extrabold'
            textAlign = {'center'}
          >
            Total: {latestCount}
          </Text>

          <div className="bio">
          👋 Hi, I'm Arun. I'm a Data Engineer by profession and a Web3 enthusiast by passion. Thats it for my intro and lets jump into the fun part..... lets throw some 🥧 over web3!!
          </div>
          <div className="note">
          You may win some ETH if you send some gifs!!
          <br/>
          You can only send a message every <b>15mins</b>
          </div>

          <div className="bio">
          Connect your Ethereum wallet now and throw some pies!
          </div>

          <Input
          name="message"
          label="Pie Message"
          placeholder="Send a message or a gif link or 🥧"
          value={message}
          m={1}
          isInvalid = {error}
          errorBorderColor='crimson'
          fullWidth
          color="secondary"
          onChange={(e) => {
            onChange(e.target.value)
          }}
          />

          <Box as='button' 
          borderRadius='md' 
          m={5} height='40px'
          fontSize='16px'
          fontWeight='semibold'
          className="css-selector" 
          onClick={pie} >
          Throw a pie!
          </Box>

          <Center>
          <Stack direction='row' align='center'>
            <Button colorScheme='blue' variant='solid' onClick={getPieCount}>
              Whats the count? 
            </Button>

            <Button colorScheme='blue' variant='solid' onClick={getAllPies}>
              Get me all the pies!!
            </Button>
          </Stack>
          </Center>

        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <Box as='button' 
          borderRadius='md' 
          m={5} height='40px'
          fontSize='16px'
          fontWeight='semibold'
          className="connect-button" 
          onClick={connectWallet} >
          Connect Wallet
          </Box>

        )}

        {allPies.slice(0).reverse().map((pie, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {pie.address}</div>
              <div>Time: {pie.timestamp.toString()}</div>
              {
                pie.message.match(/^http.*(gif)$/) ? 
                <div> Message:
                <Center><Image objectFit='cover' src={pie.message}></Image></Center>
                </div> :
                <div>Message: {pie.message}</div>
              }
            </div>)
        })}

        <Box m={5} height='40px'>
          <Center>
            <Stack direction="row" spacing="4" align="center" justify="space-between">
              <Link isExternal href="https://github.com/Arun-kc">
                <FaGithub size={50}/>
              </Link>
              <Link isExternal href="https://www.linkedin.com/in/arun-kc/">
                <FaLinkedin size={50}/>
              </Link>
              <Link isExternal href="https://twitter.com/arunkc97">
                <FaTwitter size={50}/>
              </Link>
            </Stack>
          </Center>
        </Box>
          
        </div>
      )}

    {loading && (
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'column',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            bgGradient='linear(to-l, #f83600, #fe8c00)'
            bgClip='text'
            fontSize='3xl'
            fontWeight='extrabold'
            textAlign = {'center'}
          >
            Pending Transaction
          </Text>
          <CircularProgress isIndeterminate size={50} color='orange.300' />
        </Box>
      )}

      </div>
    </ChakraProvider>
  );
}
