import TextField from "@mui/material/TextField";
import { Divider } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Loading from "../Loading/Loading";
const baseUrl = process.env.BASE_URL;

const Comment = () => {
  const [listComment, setListComment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const [listReply, setListReply] = useState();
  const [replyId, setReplyId] = useState();
  const [description, setDescription] = useState();
  const [isReply, setIsReply] = useState(false);
  let token = localStorage.getItem("token");
  const inputRef = useRef(null);
  const userId = localStorage.getItem("user_id");
  const { id: photoId } = useParams();

  const handleAddComment = async (e, username) => {
    e.preventDefault();
    setLoading(true);
    const newComment = inputRef.current.value;
    const body = {
      user_id: userId,
      username: username,
      photo_id: photoId,
      description: newComment,
      time: new Date(),
    };
    await axios
      .post(`${baseUrl}/comment`, body)
      .then((res) => {
        getComments();
      })
      .catch((e) => {
        toast.error("Add comment failed!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getComments = async () => {
    setLoading(true);
    await axios
      .get(`${baseUrl}/comment/${photoId}`)
      .then((res) => {
        setListComment(res.data.data);
      })
      .catch((e) => {})
      .finally(() => {
        setLoading(false);
      });
  };

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

  const convertTime = (time) => {
    moment.locale("vi");
    const commentTime = moment(time);
    const timeDiff = moment().diff(commentTime, "seconds");
    let timeDiffDisplay;
    if (timeDiff < 60) {
      timeDiffDisplay = `Vừa xong`;
    } else if (timeDiff < 3600) {
      timeDiffDisplay = `${Math.floor(timeDiff / 60)} phút trước`;
    } else if (timeDiff < 86400) {
      timeDiffDisplay = `${Math.floor(timeDiff / 3600)} giờ trước`;
    } else {
      timeDiffDisplay = commentTime.format("HH:mm:ss DD/MM/YYYY");
    }
    return timeDiffDisplay;
  };
  const handleReply = (id) => {
    setIsReply(true);
    setReplyId(id);
  };

  const handleAddReplyComment = async (e, username) => {
    e.preventDefault();
    setIsReply(false);
    const body = {
      user_id: userId,
      username: username,
      description: description,
      time: new Date(),
      reply_to: replyId,
    };
    await axios
      .post(`${baseUrl}/reply`, body)
      .then((res) => {
        getReplyCommnent();
      })
      .catch((e) => {});
  };

  const getReplyCommnent = async () => {
    setLoading(true);
    await axios
      .get(`${baseUrl}/reply`)
      .then((res) => {
        setListReply(res.data.data);
      })
      .catch((e) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getComments();
    getReplyCommnent();
    fetchProfile();
  }, []);

  useEffect(() => {
    getComments();
    getReplyCommnent();
    fetchProfile();
  }, [token]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Divider sx={{ margin: "10px 0", visibility: "hidden" }} />
          <form
            onSubmit={(e) => {
              handleAddComment(e, user?.username);
            }}
            sx={{ textAlign: "left" }}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              inputRef={inputRef}
              sx={{ width: "70%" }}
              placeholder="Enter comment..."
            />
          </form>
          <Divider sx={{ margin: "15px 0" }} />
          <div style={{ width: "70%", margin: "0 auto" }}>
            {listComment && listComment.length > 0 ? (
              listComment.map((comment, index) => (
                <Card key={index}>
                  <Card
                    sx={{
                      border: "none",
                      boxShadow: "none",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CardHeader
                      sx={{ marginRight: "0px" }}
                      avatar={
                        <Avatar
                          sx={{ bgcolor: "red", margin: "0", padding: "0" }}
                          aria-label="recipe"
                        >
                          {comment?.username[0]}
                        </Avatar>
                      }
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        justifyContent: "start",
                        marginLeft: "-10px",
                        textAlign: "left",
                      }}
                    >
                      <p>
                        @{comment?.username}{" "}
                        <span style={{ color: "#ccc" }}>
                          {convertTime(comment.time)}
                        </span>
                      </p>
                      <p>{comment.description}</p>
                      <p
                        style={{
                          marginBottom: "15px",
                          fontWeight: "600",
                          cursor: "pointer",
                          color: "#ccc",
                          fontSize: "15px",
                        }}
                        onClick={() => {
                          handleReply(comment._id);
                        }}
                      >
                        Reply
                      </p>
                      {replyId === comment._id && isReply ? (
                        <form
                          onSubmit={(e) =>
                            handleAddReplyComment(e, user?.username)
                          }
                          sx={{ textAlign: "left" }}
                        >
                          <TextField
                            id="outlined-basic"
                            variant="standard"
                            sx={{ width: "100%" }}
                            onChange={(e) => {
                              setDescription(e.target.value);
                            }}
                            placeholder="Enter comment..."
                          />
                        </form>
                      ) : (
                        ""
                      )}
                    </div>
                  </Card>
                  <div style={{ margin: "15px 25px" }}>
                    {listReply &&
                      listReply.length > 0 &&
                      listReply.map(
                        (reply, index) =>
                          reply.reply_to === comment._id && (
                            <Card
                              key={index}
                              sx={{
                                border: "none",
                                boxShadow: "none",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <CardHeader
                                sx={{ marginRight: "0px" }}
                                avatar={
                                  <Avatar
                                    sx={{
                                      bgcolor: "red",
                                      margin: "0",
                                      padding: "0",
                                    }}
                                    aria-label="recipe"
                                  >
                                    {reply?.username[0]}
                                  </Avatar>
                                }
                              />
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "8px",
                                  justifyContent: "start",
                                  marginLeft: "-10px",
                                  textAlign: "left",
                                }}
                              >
                                <p>
                                  @{reply?.username}{" "}
                                  <span style={{ color: "#ccc" }}>
                                    {convertTime(reply.time)}
                                  </span>
                                </p>
                                <p>{reply.description}</p>
                                {/* <p
                                    style={{
                                      marginBottom: "15px",
                                      fontWeight: "600",
                                      cursor: "pointer",
                                      color: "#ccc",
                                      fontSize: "15px",
                                    }}
                                    onClick={() => {
                                      handleReply(comment._id);
                                    }}
                                  >
                                    Reply
                                  </p> */}
                              </div>
                            </Card>
                          )
                      )}
                  </div>
                </Card>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Comment;
