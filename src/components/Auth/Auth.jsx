import { useState } from "react";
import "./Auth.css";
import toast from "react-hot-toast";
import axios from "axios";
const baseUrl = process.env.BASE_URL;
import { useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
import { Link } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const fetchProfile = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
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
  const handleSignup = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("password and confirm password is different!");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      return;
    }
    const body = {
      username: username,
      password: password,
      confirmPassword: confirmPassword,
    };
    await axios
      .post(`${baseUrl}/auth/signup`, body)
      .then((res) => {
        toast.success("register success");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const body = {
      username: username,
      password: password,
    };
    await axios
      .post(`${baseUrl}/auth/login`, body)
      .then(async (res) => {
        const { access_token: token } = res.data;
        localStorage.setItem("token", token);
        if (localStorage.getItem("token")) {
          await fetchProfile();
          if (user) {
            navigate(`/users/${user._id}`);
          }
        }
      })
      .catch((e) => {
        toast.error("username or password is incorrect!");
      });
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="auth-block">
          <div className="auth">
            <input type="checkbox" id="chk" aria-hidden="true" />
            <div className="signup">
              <form
                onSubmit={(e) => {
                  handleSignup(e);
                }}
              >
                <label htmlFor="chk" aria-hidden="true">
                  Sign up
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  required
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <input
                  type="password"
                  placeholder="Confirm password"
                  required
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
                <button type="submit">Sign up</button>
              </form>
            </div>
            <div className="login">
              <form
                onSubmit={(e) => {
                  handleLogin(e);
                }}
              >
                <label htmlFor="chk" aria-hidden="true">
                  Login
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  required
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <Link
                  to={"/change-password"}
                  style={{
                    textDecoration: "underline",
                    fontSize: "14px",
                    color: "blue",
                    cursor: "pointer",
                  }}
                >
                  Forgot password?
                </Link>
                <button>Login</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Auth;
