import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./Page/Login";
import Manager from "./Page/Manager/Manager";
import Error from "./Page/Error/Error";
import License from "./Layout/Manager/License";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Manager" element={<Manager />}>
          <Route path="*" element={<Error />}></Route>
          <Route path="License" element={<License />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
//add
//delete
export default App;
{
  /* <Route path="/Home" element={<ClientsPage />}>
  <Route path="*" element={<ErrorPage></ErrorPage>}></Route>
  <Route path="License" element={<LicenseManage Client={Client} />} />
  <Route path="Parking" element={<Parking Parkings={Parkings} />}></Route>
  <Route path="Client" element={<ClientManage Client={Client} />}>
    <Route path="Update" element={<Update />}></Route>
  </Route>
  <Route path="TimeLog" element={<TimeInOut TimeLog={TimeLog} />} />
</Route>; */
}
