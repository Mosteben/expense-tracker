import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard/index";

function NotFound() {
  return <div style={{ padding: "2rem" }}>404 — Page not found</div>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />
        <Route path="/auth/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route path="/auth/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;