import {
  Box,
  Button,
  Card,
  Container,
  styled,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ChangeEvent, useState } from "react";
import "./App.scss";
import LoadingInner from "./components/loadingInner";

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
function App() {
  const [imgSrc, setImgSrc] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.files[0]", e);
    if (e.target.files && e.target.files[0]) {
      handleSubmit(e.target.files[0]);
    }
  };

  const beforeUpload = (file: any) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/heic";
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      alert("File cannot be large than 50MB");
      return false;
    }
    if (!isJpgOrPng) {
      alert("The uploaded file must be an image");
      return false;
    }
    return isLt5M && isJpgOrPng;
  };

  const handleUploadImage = async (url: string, imageFile: any) => {
    try {
      const baseUrl = url.split("?")[0];
      const reader: any = new FileReader();
      reader.readAsArrayBuffer(imageFile);
      setLoading(true);
      reader.onload = function (event: any) {
        const binaryData = event.target.result;

        fetch(baseUrl, {
          method: "PUT",
          body: binaryData,
          headers: {
            "Content-Type": "application/octet-stream",
          },
        })
          .then(() => {
            setImgSrc(baseUrl);
          })
          .finally(() => setLoading(false));
      };
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (imageFile: File | null) => {
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      try {
        if (beforeUpload(imageFile)) {
          const response = await fetch(
            "https://api.exrunner.exnodes.vn/api/uploads/get-presinged-url",
            {
              method: "POST",
              body: JSON.stringify({
                file_name: imageFile.name.split(".")[0],
                file_type: imageFile.type.split("/")[1],
                file_size: Math.round(imageFile.size / 1024 / 1024),
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const result = await response.json();
          handleUploadImage(result.data.url, imageFile);
          console.log("Success:", result);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="App">
      <Container maxWidth="sm">
        {loading && <LoadingInner />}

        <Card
          variant="outlined"
          sx={{
            textAlign: "center",
            boxShadow: "0 5px 10px 0 rgba(0, 0, 0, 0.3)",
            height: "260px",
            padding: "10px 30px 40px",
          }}
        >
          <Typography
            sx={{ fontSize: 22, fontWeight: 600, color: "#000" }}
            color="text.secondary"
            gutterBottom
          >
            Upload Files
          </Typography>
          <Box className="drop_box">
            <Typography sx={{ fontSize: 16, color: "#000" }}>
              Select File Here
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                color: "#a3a3a3",
                marginTop: "10px",
                marginBottom: "20px",
              }}
            >
              Files Supported: PNG, SVG, JPEG
            </Typography>

            <label htmlFor="upload-button">
              <input
                type="file"
                hidden
                onChange={handleImageChange}
                accept="image/*"
                id="upload-button"
              />
              <Button
                component="span"
                variant="contained"
                startIcon={<CloudUploadIcon />}
              >
                Upload file
                <VisuallyHiddenInput type="file" />
              </Button>
            </label>
          </Box>
        </Card>
        {imgSrc && (
          <img
            src={imgSrc}
            alt=""
            style={{ maxHeight: "100%", maxWidth: "100%", marginTop: "20px" }}
          />
        )}
      </Container>
    </div>
  );
}

export default App;
