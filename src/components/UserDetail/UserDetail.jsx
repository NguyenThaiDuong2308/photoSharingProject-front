import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import axios from "axios";
import Loading from "../Loading/Loading";
import { useParams, useSearchParams } from "react-router-dom";
import DescriptionIcon from "@mui/icons-material/Description";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import { Link } from "react-router-dom";
import PreviewIcon from "@mui/icons-material/Preview";
import TopBar from "../TopBar/Topbar";
import Sidebar from "../SideBar/Sidebar";
const baseUrl = process.env.BASE_URL;

const UserDetail = () => {
  let token = localStorage.getItem("token");
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    padding: "30px",
    // minHeight: "100vh",
    height: "auto",
  }));
  const fetchData = async () => {
    token = localStorage.getItem("token");
    setLoading(true);
    await axios
      .get(`${baseUrl}/users/${id}`, {
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
    fetchData();
  }, [id]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
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
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography
                      sx={{
                        fontSize: 20,
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        padding: "15px",
                        color: "#FF5F00",
                      }}
                      color="text.secondary"
                      gutterBottom
                    >
                      <SensorOccupiedIcon style={{ fontSize: "40px" }} />{" "}
                      {user?.first_name + " " + user?.last_name}
                    </Typography>
                    <Divider sx={{ background: "#40A578", height: "2px" }} />
                    <Grid container spacing={2} sx={{ padding: "20px 0" }}>
                      <Grid item xs={6}>
                        <Item
                          style={{
                            backgroundColor: "#03AED2",
                            textAlign: "left",
                            color: "#fff",
                            fontSize: 18,
                            display: "flex",
                            alignItem: "center",
                            gap: "6px",
                          }}
                        >
                          First Name: {user?.first_name}
                        </Item>
                      </Grid>
                      <Grid item xs={6}>
                        <Item
                          style={{
                            backgroundColor: "#03AED2",
                            textAlign: "left",
                            color: "#fff",
                            fontSize: 18,
                            display: "flex",
                            alignItem: "center",
                            gap: "6px",
                          }}
                        >
                          Last Name: {user?.last_name}
                        </Item>
                      </Grid>
                      <Grid item xs={6}>
                        <Item
                          style={{
                            backgroundColor: "#03AED2",
                            textAlign: "left",
                            color: "#fff",
                            fontSize: 18,
                            display: "flex",
                            alignItem: "center",
                            gap: "6px",
                          }}
                        >
                          <WorkIcon /> Occupation: {user?.occupation}
                        </Item>
                      </Grid>
                      <Grid item xs={6}>
                        <Item
                          style={{
                            backgroundColor: "#03AED2",
                            textAlign: "left",
                            color: "#fff",
                            fontSize: 18,
                            display: "flex",
                            alignItem: "center",
                            gap: "6px",
                          }}
                        >
                          <LocationOnIcon /> Location: {user?.location}
                        </Item>
                      </Grid>
                      <Grid item xs={12}>
                        <Item
                          style={{
                            backgroundColor: "#03AED2",
                            textAlign: "left",
                            color: "#fff",
                            fontSize: 18,
                            display: "flex",
                            alignItem: "center",
                            gap: "6px",
                          }}
                        >
                          <DescriptionIcon /> Description: {user?.description}
                        </Item>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions>
                    <Link
                      to={`/users/photos?userId=${user?._id}`}
                      className="btn"
                    >
                      <PreviewIcon /> Show Photos
                    </Link>
                  </CardActions>
                </Card>
              </Item>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default UserDetail;
