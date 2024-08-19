import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SearchIcon from "@mui/icons-material/Search";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Pagination,
  Stack,
  styled,
  Tab,
  TextField,
  Typography,
} from "@mui/material";
import { debounce } from "lodash";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import "react-lazy-load-image-component/src/effects/blur.css";
import ExRunner from "src/assets/images/Exrunner.png";
import LazyImage from "src/components/LazyLoadImage";
import { callAPIWithoutToken } from "src/services/axios.config";
import "./styles.scss";
import DetailEvent from "./DetailEvent";

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

const CustomStack = styled(Stack)(({ theme }) => ({
  flexWrap: "wrap",
  margin: `-${theme.spacing(1)}`,
  "& > *": {
    margin: theme.spacing(1),
  },
}));

const HomePage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [imgSrc, setImgSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dataImageBIB, setDataImageBIB] = useState({
    limit: 10,
    data: [],
    next_page: 1,
    total_pages: 0,
  });
  const [detailImage, setDetailImage] = useState({
    bibs: [],
    image_url: "",
  });
  const [value, setValue] = useState("1");
  const [bibText, setBibText] = useState("");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleChangePagination = (event: any, value: number) => {
    setPage(value);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSubmit(e.target.files[0]);
    }
  };

  const handleSearch = useCallback(
    debounce((value) => {
      fetchData(1, value);
    }, 1500),
    []
  );

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBibText(event.target.value);
    handleSearch(event.target.value);
  };

  const fetchData = async (page: number, bib?: string) => {
    try {
      setLoading(true);
      await callAPIWithoutToken({
        url: "/api/event/images/10/all",
        params: {
          page,
          limit: 5,
          bib,
        },
      })
        .then((res) => {
          const { data } = res.data;
          setDataImageBIB({
            limit: res.data.limit,
            data: data,
            next_page: res.data.next_page,
            total_pages: res.data.total_pages,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, bibText);
  }, [page]);

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
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleDetailImage = async (imageId: number) => {
    try {
      await callAPIWithoutToken({
        url: `/api/event/images10/detail/${imageId}`,
      })
        .then((res) => {
          const { data } = res.data;
          setDetailImage(data);
          setOpen(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <Container>
      <Box
        className="banner"
        sx={{
          width: "100%",
        }}
      >
        <img src={ExRunner} alt="" />
      </Box>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Item One" value="1" />
              <Tab label="Item Two" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <TextField
              id="outlined-basic"
              label="Search BIB"
              placeholder="Search BIB"
              variant="outlined"
              value={bibText}
              onChange={handleChangeSearch}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
              sx={{ marginBottom: "10px", width: 400 }}
            />
            {/* {loading && <LoadingInner />} */}
            <CustomStack direction={"row"} sx={{ width: 1220 }}>
              {dataImageBIB.data.map((item: any) => {
                return (
                  <Card key={item.id} sx={{ width: 260 }}>
                    <CardActionArea
                      onClick={() => {
                        handleDetailImage(item.id);
                      }}
                    >
                      <LazyImage
                        src={item.image_url}
                        alt="Lazy loaded image"
                        defaultSrc="https://fakeimg.pl/228x152?text=Image+Not+Found"
                        styleCustom={{ width: "100%", height: "100%" }}
                      />
                    </CardActionArea>
                  </Card>
                );
              })}
            </CustomStack>

            <Pagination
              count={Math.ceil(dataImageBIB.total_pages)}
              page={page}
              onChange={handleChangePagination}
              sx={{ marginTop: 2, justifyContent: "center", display: "flex" }}
            />
            <DetailEvent
              open={open}
              handleClose={() => setOpen(false)}
              detailImage={detailImage}
            />
          </TabPanel>
          <TabPanel value="2">
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
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  marginTop: "20px",
                }}
              />
            )}
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
};

export default HomePage;
