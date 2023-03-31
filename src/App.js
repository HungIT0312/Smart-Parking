import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./Page/Login";
import Manager from "./Page/Manager/Manager";
import Error from "./Page/Error/Error";
import License from "./Layout/Manager/License";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/Manager" element={<Manager />}>
            <Route path="*" element={<Error />}></Route>
            <Route path="License" element={<License />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
//add
//delete
export default App;
