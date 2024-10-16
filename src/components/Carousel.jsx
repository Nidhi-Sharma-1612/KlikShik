import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Box,
  Paper,
  ImageList,
  ImageListItem,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import "../index.css";

const Carousel = () => {
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          "https://picsum.photos/v2/list?page=1&limit=5"
        );
        const fetchedImages = response.data.map((image) => ({
          id: image.id,
          url: image.download_url,
        }));
        setImages(fetchedImages);
      } catch (error) {
        console.error("Failed to fetch images:", error);
      }
    };

    fetchImages();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setActiveIndex(current),
    nextArrow: null,
    prevArrow: null,
  };

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const handlePrevious = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: isSmallScreen ? "90%" : "60%",
        margin: "auto",
        mt: isSmallScreen ? 8 : 12,
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 2,
          aspectRatio: "16/9",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Slider ref={sliderRef} {...settings}>
          {images.map((image, index) => (
            <Paper
              key={index}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                borderRadius: 2,
                boxShadow: "none",
                margin: 0,
              }}
            >
              <img
                src={image.url}
                alt={`Slide ${index}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Paper>
          ))}
        </Slider>

        <IconButton
          onClick={handlePrevious}
          sx={{
            position: "absolute",
            top: "50%",
            left: isSmallScreen ? "5px" : "-40px",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
          }}
        >
          <ArrowBack />
        </IconButton>
        <IconButton
          onClick={handleNext}
          sx={{
            position: "absolute",
            top: "50%",
            right: isSmallScreen ? "5px" : "-40px",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
          }}
        >
          <ArrowForward />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
        <ImageList
          cols={isSmallScreen ? 3 : isMediumScreen ? 4 : 5}
          rowHeight={isSmallScreen ? 40 : 50}
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "auto",
            marginTop: "10px",
          }}
        >
          {images.map((image, index) => (
            <ImageListItem
              key={index}
              onClick={() => handleThumbnailClick(index)}
              sx={{
                cursor: "pointer",
                border:
                  activeIndex === index
                    ? "2px solid #1976d2"
                    : "2px solid transparent",
                transition: "border 0.3s ease",
                "&:hover": { border: "2px solid #1976d2" },
                borderRadius: 1,
                overflow: "hidden",
                width: isSmallScreen ? 50 : 70,
                height: isSmallScreen ? 40 : 50,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 4px",
                boxShadow: "none",
              }}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${index}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </Box>
  );
};

export default Carousel;
