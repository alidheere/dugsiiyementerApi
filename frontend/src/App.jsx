import { useQuery } from "@tanstack/react-query";
import Task from "./task";
import { Navigate, Routes , Route} from "react-router";
import LoginPage from "./pages/auth/loginPage";
import RegisterPage from "./pages/auth/registerPage";
import DashboardPage from "./pages/dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminPage from "./pages/adminPage";
import AdminProtect from "./components/auth/AdminProtect";


function App() {

  return (
    <>
<Routes>
<Route path='/login' element={<LoginPage/>}/>
<Route path="/register" element={<RegisterPage/>}/>
<Route path="/dashboard" element={ <ProtectedRoute> <DashboardPage/> </ProtectedRoute> }/>
{/* taska add procet */}
<Route path="/" element={<Navigate to ="login" replace/>}/>
<Route path="/admin" element={ <AdminProtect>  <AdminPage/> </AdminProtect>}/>
</Routes>
    </>

  );
}

export default App;