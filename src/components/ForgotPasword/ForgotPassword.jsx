import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
const baseUrl = process.env.BASE_URL;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      await axios
        .patch(`${baseUrl}/users/${username}`, {
          password: password,
        })
        .then((res) => {
          navigate("/login");
          toast.success("Change password success!");
        })
        .catch((e) => {
          toast.error(e.response.data.message);
        });
    } else {
      toast.error("password and confirm password is different");
    }
  };
  return (
    <Card style={{ maxWidth: "500px", margin: "50px auto" }}>
      <CardContent>
        <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
          Forgot Password
        </Typography>
        <form
          onSubmit={(e) => {
            handleChangePassword(e);
          }}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <TextField
            style={{ marginTop: "12px" }}
            label="Username"
            variant="standard"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            required
          />
          <TextField
            style={{ marginTop: "15px" }}
            label="Password"
            variant="standard"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
          <TextField
            style={{ marginTop: "12px" }}
            label="Confirm password"
            variant="standard"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            required
          />
          <Button
            type="submit"
            variant="contained"
            // className="btn"
            style={{ width: "50%", margin: "25px auto", textAlign: "center" }}
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;
