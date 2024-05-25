import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "../components/Home/Home";
import NoMatch from "../components/NoMatch/NoMatch";
import UserDetail from "../components/UserDetail/UserDetail";
import PhotoList from "../components/PhotoList/PhotoList";
import PhotoDetail from "../components/PhotoDetail/PhotoDetail";
import Auth from "../components/Auth/Auth";
import Layout from "../components/DefaultLayout/Layout";
import ForgotPassword from "../components/ForgotPasword/ForgotPassword";
import { useState, useEffect } from "react";
const baseUrl = process.env.BASE_URL;
import axios from "axios";

const Router = () => {
  const navigate = useNavigate();
  let token = localStorage.getItem("token");
  const [user, setUser] = useState();
  const fetchProfile = async () => {
    token = localStorage.getItem("token");
    await axios
      .get(`${baseUrl}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data.data);
      })
      .catch((e) => {});
  };
  useEffect(() => {
    fetchProfile();
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/users/:id" element={<UserDetail />}></Route>
      <Route path="/users/photos" element={<PhotoList />}></Route>
      <Route path="/photos/:id" element={<PhotoDetail />}></Route>
      <Route path="/login" element={<Auth />}></Route>
      <Route path="/change-password" element={<ForgotPassword />}></Route>
      <Route path="*" element={<NoMatch />}></Route>
    </Routes>
  );
};

export default Router;
