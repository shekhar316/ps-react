import './App.css';
import { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { Box } from "@chakra-ui/react";
import PrivateRoute from "./Pages/PrivateRoute";
import Appbar from './Components/Appbar/Appbar';
import Dashboard from './Pages/Dashboard/Dashboard';
import Analytics from './Pages/Analytics/Analytics';
import Payment from './Pages/Payment/Payment';
import LoginPage from './Pages/LoginPage/LoginPage';
import Verification from './Pages/Verification/Verification';
import Scanner from './Pages/Scanner/Scanner';
import authenticationService from './Services/auth.service';
import EventBus from "./Common/EventBus";
import FreePayment from './Pages/FreePayment/FreePayment';
import DetailsPrompt from './Pages/DetailsPrompt/DetailsPrompt';
import ProfileDetails from './Pages/ProfileDetails/ProfileDetails';
import ChargeTime from './Pages/ChargeTime/ChargeTime';
import Redirect from './Pages/Redirect/Redirect';
import UserDetails from './Pages/UserDetails/UserDetails';
import AddMoney from './Pages/AddMoney/AddMoney';
import Subscription from './Pages/Subscription/Subscription';
import InstallButton from './Components/InstallButton/InstallButton';

function App() {

  useEffect(() => {
    EventBus.on("logout", () => {
      authenticationService.logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  },[])

  return (
    <Box>
      <Router>
      <Fragment>
      <Appbar/>

      <Routes>

      <Route exact path="/login" element={<LoginPage/>}/>
      <Route exact path="/verification" element={<Verification/>}/>

      {/* uncomment these routes use the app without logging in */}
      {/* <Route exact path='/' element={<Scanner/>}/>
      <Route exact path="/charge-point/:id" element={<Dashboard/>}/>
      <Route exact path="/charge-point/session/:id" element={<Analytics/>}/>
      <Route exact path="/payment/:id" element={<FreePayment/>}/> */}
      {/* <Route exact path="/payment/:id" element={<Payment/>}/> */}

      {/* Private routes */}

      <Route exact path='/' element={
        <PrivateRoute>
          <Scanner />
        </PrivateRoute>
      }/>

      <Route exact path='/charge-point/:id' element={
        <PrivateRoute>
          <Redirect />
        </PrivateRoute>
      }/>

      <Route exact path='/subscription/:id' element={
        <PrivateRoute>
          <Subscription />
        </PrivateRoute>
      }/>

      <Route exact path='/charge-point/device/:id' element={
        <PrivateRoute>
          <ChargeTime />
        </PrivateRoute>
      }/>

      <Route exact path='/user/add/money/wallet' element={
        <PrivateRoute>
          <AddMoney />
        </PrivateRoute>
      }/>

      <Route exact path='/details/request/:id/:transactionId' element={
        <PrivateRoute>
          <DetailsPrompt />
        </PrivateRoute>
      }/>

      <Route exact path='/details/user/:id/:transactionId' element={
        <PrivateRoute>
          <ProfileDetails />
        </PrivateRoute>
      }/>

      <Route exact path='/charge-point/:id/start' element={
        <PrivateRoute>
          <Dashboard/>
        </PrivateRoute>
      }/>

      <Route exact path='/charge-point/:id/session/:param1' element={
        <PrivateRoute>
          <Analytics/>
        </PrivateRoute>
      }/>

      <Route exact path='/charge/complete' element={
        <PrivateRoute>
          <FreePayment/>
        </PrivateRoute>
      }/>

      <Route exact path='/payment/user/details' element={
        <PrivateRoute>
          <UserDetails/>
        </PrivateRoute>
      }/>

      </Routes>
      {/* <InstallButton/> */}
      </Fragment>
      </Router>
    </Box>
  );
}

export default App;

