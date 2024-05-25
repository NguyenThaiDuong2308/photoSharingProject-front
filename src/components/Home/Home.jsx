import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import TopBar from "../TopBar/Topbar";
import Sidebar from "../SideBar/Sidebar";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Layout from "../DefaultLayout/Layout";
const baseUrl = process.env.BASE_URL;
import axios from "axios";

const Home = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const fetchProfile = async () => {
    setLoading(true);
    await axios
      .get(`${baseUrl}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data.data);
        localStorage.setItem("user_id", res.data.data._id);
      })
      .catch((e) => {})
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchProfile();
  }, [token]);
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    padding: "30px",
    minHeight: "100vh",
    height: "auto",
  }));

  return (
    <>
      <TopBar />
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Item>{user ? <Sidebar /> : ""}</Item>
        </Grid>
        <Grid item xs={9}>
          <Item>
            <Card
              sx={{
                minWidth: 275,
                textAlign: "center",
                background:
                  "linear-gradient(to right, rgb(242, 112, 156), rgb(255, 148, 114))",
                padding: "30px 0",
              }}
            >
              <CardContent>
                <Typography
                  sx={{ fontSize: 25, color: "#fff" }}
                  color="text.secondary"
                  gutterBottom
                >
                  {user ? "Please choose user!" : "Login to show user"}
                </Typography>
                <Typography
                  sx={{ fontSize: 20, color: "#fff" }}
                  color="text.secondary"
                  gutterBottom
                >
                  <KeyboardReturnIcon />
                </Typography>
              </CardContent>
            </Card>
          </Item>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
