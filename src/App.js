import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./Page/Login";
import Manager from "./Page/Manager/Manager";
import Error from "./Page/Error/Error";
import License from "./Layout/Manager/License";
import ParkingLots from "./Layout/Manager/ParkingLots";
import Clients from "./Layout/Manager/Clients";
import TimeLog from "./Layout/Manager/TimeLog";
import ClientInfo from "./Layout/Manager/Client.feat/Update";
import Add from "./Layout/Manager/Client.feat/Add";
import ClientPage from "./Page/Client/Client";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Manager" element={<Manager />}>
          <Route path="*" element={<Error />}></Route>
          <Route path="License" element={<License />} />
          <Route path="Clients" element={<Clients />}>
            <Route path="new" element={<Add />} />
          </Route>
          <Route path="Clients/:clientId" element={<ClientInfo />} />
          <Route path="TimeLog" element={<TimeLog />} />
          {/* <Route path="Clients/:clientId" element={<ClientInfo />} /> */}
          <Route path="Parking" element={<ParkingLots />} />
        </Route>
        <Route path="/Client" element={<ClientPage />}>
          <Route path="*" element={<Error />}></Route>
          <Route path="Parking" element={<ParkingLots />} />
        </Route>

        <Route path="*" element={<Navigate to="/Client" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
//add
//delete
export default App;
