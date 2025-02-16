import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { useLoading } from "../context/LoadingContext";

const Loader = () => {
  const { loading } = useLoading();

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loader;
