import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./Page/Login";
import Manager from "./Page/Manager/Manager";
import Error from "./Page/Error/Error";
import License from "./Layout/Manager/License";
import ParkingLots from "./Layout/Manager/ParkingLots";
import Clients from "./Layout/Manager/Clients";
import TimeLog from "./Layout/Manager/TimeLog";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Manager" element={<Manager />}>
          <Route path="*" element={<Error />}></Route>
          <Route path="License" element={<License />} />
          <Route path="Clients" element={<Clients />} />
          <Route path="TimeLog" element={<TimeLog />} />
          <Route path="Parking" element={<ParkingLots />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
//add
//delete
export default App;
