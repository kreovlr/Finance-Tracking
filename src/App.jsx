import {
  BrowserRouter,
  Navigate,
  Routes,
  Route
} from "react-router-dom";


import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";


import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import Budgets from "./pages/Budgets";


import Login from "./pages/Login";
import Register from "./pages/Register";
import UpdatePassword from "./pages/UpdatePassword";
import ProtectedRoute from "./components/ProtectedRoute";



function DashboardLayout(){


  return (

    <div
      className="
      flex
      min-h-screen
      w-full
      bg-slate-50
      text-slate-900
      dark:bg-[#0a0a0a]
      dark:text-white
      "
    >


      <Sidebar />


      <div
        className="
        flex-1
        "
      >


        <Navbar />


        <main
          className="
          p-6
          "
        >


          <Routes>


            <Route path="" element={<Dashboard />} />


            <Route

              path="transactions"

              element={<Transactions />}

            />


            <Route

              path="settings"

              element={<Settings />}

            />

            <Route path="budgets" element={<Budgets />} />


          </Routes>


        </main>


      </div>


    </div>

  )

}





function App(){


  return (

    <BrowserRouter>


      <Routes>


        {/* Authentication pages */}

        <Route

          path="/login"

          element={<Login />}

        />


        <Route

          path="/register"

          element={<Register />}

        />

        <Route path="/update-password" element={<UpdatePassword />} />



        {/* Dashboard */}

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/*" element={<DashboardLayout />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="*" element={<Navigate to="/login" replace />} />


      </Routes>


    </BrowserRouter>

  )

}



export default App;