import {BrowserRouter,Routes,Route,Navigate,} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ShoppingList from "./pages/ShoppingList";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import CreateShoppingList from "./pages/CreateShoppingList";
import EditShoppingList from "./pages/EditShoppingList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />}/>
          
          <Route path="/register"element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>

          <Route path="/home" element={<Home />} />
         
          <Route path="/CreateShoppingList" element={<CreateShoppingList />}/>

          <Route path = "/EditShoppingList" element={<EditShoppingList/>}/>

          <Route path="/ShoppingList/:id" element={<ShoppingList />} />

          <Route path="/profile" element={<Profile />} />

        </Route>
         <Route path="*" element={ <Navigate to="/home" replace />} />
         

      </Routes>
    </BrowserRouter>
  );
}

export default App;