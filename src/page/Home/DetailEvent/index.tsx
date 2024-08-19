import {
  Box,
  Divider,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./styles.scss";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LazyImage from "src/components/LazyLoadImage";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  backgroundColor: "#FFF",
  transform: "translate(-50%, -50%)",
  borderRadius: 5,
  pt: 2,
  px: 4,
  pb: 3,
};

const DetailEvent: React.FC<{
  open: boolean;
  handleClose: () => void;
  detailImage: {
    bibs: never[];
    image_url: string;
    [key: string]: any;
  };
}> = (props) => {
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <Box sx={{ ...style, width: "650px" }}>
        <Box
          sx={{
            position: "absolute",
            top: "0",
            right: "0",
            padding: "10px",
          }}
        >
          <IconButton onClick={props.handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <LazyImage
            src={props.detailImage.image_url}
            alt="Lazy loaded image"
            defaultSrc="https://fakeimg.pl/228x152?text=Image+Not+Found"
            styleCustom={{
              width: "500px",
              height: "100%",
            }}
          />
        </Box>
        <Stack direction={"row"} flexWrap={"wrap"} alignItems={"center"}>
          {props.detailImage.bibs.map((item, index) => (
            <Stack
              key={index}
              direction={"row"}
              spacing={1}
              alignItems={"center"}
              justifyContent={"center"}
              style={{
                marginRight: "20px",
              }}
            >
              <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
                BIB:
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "rgb(0, 174, 255)",
                }}
              >
                {item}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Modal>
  );
};

export default DetailEvent;
