import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Loading from "../Loading/Loading";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TopBar from "../TopBar/Topbar";
import Sidebar from "../SideBar/Sidebar";
import { Link } from "react-router-dom";
const baseUrl = process.env.BASE_URL;
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import toast from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const PhotoList = () => {
  const currentUserId = localStorage.getItem("user_id");
  let token = localStorage.getItem("token");
  const [expanded, setExpanded] = useState(false);
  const [imgIdDelete, setImgIdDelete] = useState();
  const [open, setOpen] = useState(false);
  const [photos, setPhotos] = useState();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  let [searchParams, setSearchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const fetchPhotos = async () => {
    token = localStorage.getItem("token");
    setLoading(true);
    await axios
      .get(`${baseUrl}/photos?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPhotos(res.data.data);
      })
      .catch((e) => {});
    setLoading(false);
  };
  useEffect(() => {
    fetchPhotos();
  }, [userId]);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleClose = () => {
    setOpen(false);
  };

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

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleUpload = async (e) => {
    setLoading(true);
    token = localStorage.getItem("token");
    setFile(e.target.files[0]);
    const formData = new FormData();
    formData.append("file", file);
    await axios
      .post(`${baseUrl}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success(res.data.message);
        fetchPhotos();
      })
      .catch((e) => {
        toast.error("Upload failed. Please try again!");
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    setImgIdDelete(id);
    setOpen(true);
  };

  const deleteImage = async () => {
    setOpen(false);
    await axios
      .delete(`${baseUrl}/upload/${imgIdDelete}`)
      .then((res) => {
        toast.success(res.data.message);
        fetchPhotos();
      })
      .catch((e) => {
        toast.error("delete failed!");
      });
  };

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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {photos?.map((photo, index) => (
                    <Card sx={{ maxWidth: 300, margin: "20px" }} key={index}>
                      <CardHeader
                        avatar={
                          <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
                            R
                          </Avatar>
                        }
                        action={
                          <IconButton aria-label="settings">
                            <MoreVertIcon />
                          </IconButton>
                        }
                        title="Shrimp and Chorizo Paella"
                        subheader="September 14, 2016"
                      />
                      {photo?.img?.includes("https") ? (
                        <Link to={`/photos/${photo._id}`}>
                          <CardMedia
                            component="img"
                            height="194"
                            image={photo.img}
                            alt="Img"
                          />
                        </Link>
                      ) : (
                        <Link to={`/photos/${photo._id}`}>
                          <CardMedia
                            component="img"
                            height="194"
                            image={`${baseUrl}/images/${photo.img}`}
                            alt="Img"
                          />
                        </Link>
                      )}

                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          This impressive paella is a perfect party dish and a
                          fun meal to cook
                        </Typography>
                      </CardContent>
                      <CardActions disableSpacing>
                        <IconButton aria-label="add to favorites">
                          <FavoriteIcon />
                        </IconButton>
                        <IconButton aria-label="share">
                          <ShareIcon />
                        </IconButton>
                        <IconButton
                          aria-label="show more"
                          onClick={handleExpandClick}
                          aria-expanded={expanded}
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                        {currentUserId === photo.user_id ? (
                          <IconButton
                            aria-label="show more"
                            onClick={() => {
                              handleDelete(photo._id);
                            }}
                            aria-expanded={expanded}
                          >
                            <DeleteIcon />
                          </IconButton>
                        ) : (
                          ""
                        )}
                      </CardActions>
                      <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                          <Typography paragraph>Method:</Typography>
                          <Typography paragraph>
                            Heat 1/2 cup of the broth in a pot until simmering,
                            add saffron and set aside for 10 minutes.
                          </Typography>
                          <Typography paragraph>
                            Heat oil in a (14- to 16-inch) paella pan or a
                            large, deep skillet over medium-high heat. Add
                            chicken, shrimp, and chorizo, and cook, stirring
                            occasionally until lightly browned, 6 to 8 minutes.
                            Transfer shrimp to a large plate and set aside,
                            leaving chicken and chorizo in the pan. Add
                            pimentón, bay leaves, garlic, tomatoes, onion, salt,
                            and pepper, and cook, stirring often until thickened
                            and fragrant, about 10 minutes. Add saffron broth
                            and remaining 4 1/2 cups chicken broth; bring to a
                            boil.
                          </Typography>
                          <Typography>
                            Set aside off of the heat to let rest for 10
                            minutes, and then serve.
                          </Typography>
                        </CardContent>
                      </Collapse>
                    </Card>
                  ))}
                  {currentUserId === userId ? (
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload Image
                      <VisuallyHiddenInput
                        type="file"
                        onChange={(e) => handleUpload(e)}
                      />
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
              </Item>
            </Grid>
          </Grid>
        </>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm delete image</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure delete image?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={deleteImage} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PhotoList;
