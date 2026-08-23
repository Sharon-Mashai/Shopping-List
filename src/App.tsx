import {BrowserRouter,Routes,Route,Navigate,} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ShoppingList from "./pages/ShoppingList";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/" element={<Navigate to="/login" />}
        />

        <Route
          path="/login" element={<Login />}
        />

        <Route
          path="/register" element={<Register />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/home" element={<Home />}
          />

          <Route
            path="/shopping-list/:id" element={<ShoppingList />}
          />

          <Route
            path="/profile" element={<Profile />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;