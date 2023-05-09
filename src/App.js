import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Add from "./Layout/Manager/Client.feat/Add";
import ClientInfo from "./Layout/Manager/Client.feat/Update";
import Clients from "./Layout/Manager/Clients";
import License from "./Layout/Manager/License";
import ParkingLots from "./Layout/Manager/ParkingLots";
import TimeLog from "./Layout/Manager/TimeLog";
import ClientPage from "./Page/Client/Client";
import Error from "./Page/Error/Error";
import LoginPage from "./Page/Login";
import Manager from "./Page/Manager/Manager";
import Register from "./Page/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Manager/Login" element={<LoginPage role={1} />} />
        <Route path="/Manager" element={<Manager />}>
          <Route path="*" element={<Error />}></Route>
          <Route path="License" element={<License />} />
          <Route path="Clients" element={<Clients />}>
            <Route path="new" element={<Add />} />
          </Route>
          <Route path="Clients/:clientId" element={<ClientInfo />} />
          <Route path="TimeLog" element={<TimeLog />} />
          <Route path="Parking" element={<ParkingLots />} />
        </Route>
        <Route path="/Client/Login" element={<LoginPage role={2} />}></Route>
        <Route path="/Client/Register" element={<Register role={2} />}></Route>
        <Route path="/Client" element={<ClientPage />}>
          <Route path="Profile" element={<Error />} />
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
