import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Loading from "../Loading/Loading";
const baseUrl = process.env.BASE_URL;
import Comment from "../Comment/Comment";
import TopBar from "../TopBar/Topbar";
import Sidebar from "../SideBar/Sidebar";

const PhotoDetail = () => {
  let token = localStorage.getItem("token");
  const { id } = useParams();
  const [photo, setPhoto] = useState();
  const [loading, setLoading] = useState(true);
  const zoomImg = useRef();
  const fetchPhoto = async () => {
    token = localStorage.getItem("token");
    setLoading(true);
    await axios
      .get(`${baseUrl}/photos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPhoto(res.data.data);
      })
      .catch((e) => {})
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchPhoto();
  }, [id]);
  return (
    <>
      <TopBar />
      {loading ? (
        <Loading />
      ) : (
        <>
          <Card
            sx={{
              boxShadow: "none",
              textAlign: "center",
              width: "auto",
              marginTop: "30px",
            }}
          >
            {photo?.img.includes("https") ? (
              <CardMedia
                component="img"
                height="auto"
                image={photo.img}
                alt="Img"
                sx={{
                  objectFit: "contain",
                  maxHeight: "450px",
                  borderRadius: "8px",
                }}
              />
            ) : (
              <CardMedia
                component="img"
                height="auto"
                image={`${baseUrl}/images/${photo?.img}`}
                alt="Img"
                sx={{
                  objectFit: "contain",
                  maxHeight: "450px",
                  borderRadius: "8px",
                }}
              />
            )}
          </Card>
          <Comment />
        </>
      )}
    </>
  );
};

export default PhotoDetail;
