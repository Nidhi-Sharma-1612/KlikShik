import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Tooltip,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"];

const UploadUI = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [xhrInstances, setXhrInstances] = useState({});
  const [buttonState, setButtonState] = useState("Upload Files");

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files).filter(
      (file) =>
        ALLOWED_FILE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE
    );

    const newFiles = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      id: uuidv4(),
      uploadedBytes: 0,
      totalBytes: file.size,
      progress: 0,
    }));

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const uploadFile = (file, id, startByte = 0) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const uploadedBytes = startByte + event.loaded;
          const progress = (uploadedBytes / file.size) * 100;

          setSelectedFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.id === id ? { ...f, uploadedBytes, progress } : f
            )
          );
        }
      });

      xhr.upload.addEventListener("load", () => resolve());
      xhr.addEventListener("error", () => reject(new Error("Upload failed")));
      xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

      const formData = new FormData();
      const blob = file.slice(startByte);
      formData.append("file", blob, file.name);

      xhr.open("POST", "http://localhost:5000/upload", true);
      xhr.setRequestHeader(
        "Content-Range",
        `bytes ${startByte}-${file.size - 1}/${file.size}`
      );
      xhr.send(formData);

      setXhrInstances((prev) => ({ ...prev, [id]: xhr }));
    });
  };

  const handleUpload = async () => {
    if (buttonState === "Pause") {
      Object.values(xhrInstances).forEach((xhr) => xhr.abort());
      setButtonState("Resume");
    } else if (buttonState === "Resume") {
      setButtonState("Pause");
      try {
        for (const { file, id, uploadedBytes, previewUrl } of selectedFiles) {
          await uploadFile(file, id, uploadedBytes);
          setUploadedFiles((prev) => [
            ...prev,
            { id, name: file.name, previewUrl },
          ]);
          setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
        }
        setButtonState("Upload Files");
      } catch {
        console.error("Upload failed");
      }
    } else {
      setButtonState("Pause");
      try {
        for (const { file, id, previewUrl } of selectedFiles) {
          await uploadFile(file, id);
          setUploadedFiles((prev) => [
            ...prev,
            { id, name: file.name, previewUrl },
          ]);
          setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
        }
        setButtonState("Upload Files");
      } catch {
        console.error("Upload failed");
      }
    }
  };

  const handleDeleteFile = (id) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const handleDeleteUpload = (id) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const getButtonColor = () => {
    switch (buttonState) {
      case "Upload Files":
        return "#1976d2";
      case "Pause":
        return "#ff9800";
      case "Resume":
        return "#4caf50";
      default:
        return "#1976d2";
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 900,
        margin: "auto",
        mt: 5,
        p: 3,
        backgroundColor:
          theme.palette.mode === "dark" ? "grey.900" : "grey.100",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant={isSmallScreen ? "h5" : "h4"} // Adjust heading size
        sx={{ mb: 3, textAlign: "center" }}
      >
        Upload and Preview Images
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            px: 4,
            py: 2,
            borderRadius: 3,
            "&:hover": { backgroundColor: "#155a9c" },
          }}
        >
          Select Files
          <input type="file" hidden multiple onChange={handleFileSelect} />
        </Button>
      </Box>

      {selectedFiles.length > 0 && (
        <Grid container spacing={2} justifyContent="center">
          {selectedFiles.map(({ id, previewUrl, progress }) => (
            <Grid item xs={12} sm={6} md={4} key={id}>
              <Card
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  margin: "auto", // Center cards horizontally
                  maxWidth: isSmallScreen ? 300 : "auto",
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={previewUrl}
                  alt="File Preview"
                  sx={{ objectFit: "cover" }}
                />
                <Tooltip title="Delete">
                  <IconButton
                    onClick={() => handleDeleteFile(id)}
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      color: "white",
                      "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ width: "100%", height: 10 }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedFiles.length > 0 && (
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleUpload}
            sx={{
              backgroundColor: getButtonColor(),
              color: "white",
              borderRadius: 3,
              px: 5,
              "&:hover": { opacity: 0.9 },
            }}
          >
            {buttonState}
          </Button>
        </Box>
      )}

      <Typography
        variant={isSmallScreen ? "h6" : "h5"} // Adjust heading size
        sx={{ mt: 4, mb: 2 }}
      >
        Uploaded Files Gallery:
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center", // Center uploaded cards
          gap: 2,
          mt: 2,
        }}
      >
        {uploadedFiles.map((file) => (
          <Card key={file.id} sx={{ width: 200, borderRadius: 3 }}>
            <CardMedia
              component="img"
              height="140"
              image={file.previewUrl}
              alt={file.name}
              sx={{ objectFit: "cover" }}
            />
            <CardContent>
              <Typography noWrap>{file.name}</Typography>
              <Tooltip title="Delete">
                <IconButton onClick={() => handleDeleteUpload(file.id)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default UploadUI;
