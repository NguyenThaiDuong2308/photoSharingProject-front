import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/Inbox";
import { Person } from "@mui/icons-material";
import DraftsIcon from "@mui/icons-material/Drafts";
import axios from "axios";
import Loading from "../Loading/Loading";
import { Link } from "react-router-dom";
import TopBar from "../TopBar/Topbar";
const baseUrl = process.env.BASE_URL;

const Sidebar = () => {
  let token = localStorage.getItem("token");
  const [selectedIndex, setSelectedIndex] = useState();
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    token = localStorage.getItem("token");
    setLoading(true);
    await axios
      .get(`${baseUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUsers(res.data.data);
        setLoading(false);
      })
      .catch((e) => {})
      .finally(() => {});
  };
  useEffect(() => {
    fetchData();
  }, [token]);

  const handleListItemClick = (e, index) => {
    setSelectedIndex(index);
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            width: "100%",
            maxWidth: 600,
            bgcolor: "background.paper",
          }}
        >
          <List component="nav" aria-label="main mailbox folders">
            {users?.map((user, index) => (
              <Link to={`/users/${user._id}`} key={index}>
                <ListItemButton
                  key={index}
                  selected={selectedIndex === index}
                  onClick={(event) => handleListItemClick(event, index)}
                >
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary={user.first_name + " " + user.last_name}
                    secondary={user.location}
                  />
                </ListItemButton>
              </Link>
            ))}
          </List>
        </Box>
      )}
    </>
  );
};

export default Sidebar;
