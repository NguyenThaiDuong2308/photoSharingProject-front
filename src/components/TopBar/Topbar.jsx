import "./Topbar.css";
import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import { Link } from "react-router-dom";
const baseUrl = process.env.BASE_URL;
import LinkedCameraIcon from "@mui/icons-material/LinkedCamera";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { IoPersonSharp } from "react-icons/io5";
import Loading from "../Loading/Loading";

const TopBar = () => {
  let token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState();
  // const [token, setToken] = useState(localStorage.getItem("token"));

  const fetchProfile = async () => {
    setLoading(true);
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
      .catch((e) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLogout = async () => {
    setLoading(true);
    const body = {
      msg: "inactive",
    };
    await axios
      .post(`${baseUrl}/auth/logout`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success("Logout success");
        navigate("/login");
      })
      .catch((e) => {
        toast.error(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{ textAlign: "left" }}>
            <Toolbar>
              <div
                className="header-bar"
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div>
                  <Link to={"/"}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                      >
                        <LinkedCameraIcon />
                      </IconButton>
                      <Typography
                        variant="h6"
                        component="div"
                        style={{ marginLeft: "-15px" }}
                      >
                        Photo Sharing
                      </Typography>
                    </div>
                  </Link>
                </div>
                <div>
                  {user ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                      }}
                    >
                      <Typography variant="h6" component="p">
                        Hi, {user?.username}
                      </Typography>
                      <button
                        onClick={handleLogout}
                        className="btn"
                        color="inherit"
                      >
                        <IoIosLogOut style={{ fontSize: "20px" }} /> Logout
                      </button>
                    </div>
                  ) : (
                    <Link to={"/login"} className="btn" color="inherit">
                      <IoPersonSharp /> Login
                    </Link>
                  )}
                </div>
              </div>
            </Toolbar>
          </AppBar>
        </Box>
      )}
    </>
  );
};

export default TopBar;
