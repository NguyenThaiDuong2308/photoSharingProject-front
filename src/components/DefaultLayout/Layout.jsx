import TopBar from "../TopBar/Topbar";
import Sidebar from "../SideBar/Sidebar";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Router from "../../routers/Router";

const Layout = () => {
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
          <Item>
            <Sidebar />
          </Item>
        </Grid>
        <Grid item xs={9}>
          <Item>
            <Router />
          </Item>
        </Grid>
      </Grid>
    </>
  );
};

export default Layout;
