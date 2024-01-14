"use client";
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  SnackbarCloseReason,
  AlertColor,
} from "@mui/material";
import React, { FormEvent, SyntheticEvent, useEffect, useState } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { updateUser } from "@/redux/slices/auth";
import { useAppDispatch, useAppSelector } from "@/redux";
export default function Account() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    active: false,
    message: "",
  });
  const [showToast, setShowToast] = useState<{
    active: boolean;
    message: String;
    severity: AlertColor | undefined;
  }>({
    active: false,
    message: "",
    severity: undefined,
  });

  const [data, setdata] = useState({
    name: {
      value: "",
      error: false,
      errorMessage: "",
    },
    bio: {
      value: "",
      error: false,
      errorMessage: "",
    },
  });
  useEffect(() => {
    if (auth && auth.user) {
      setdata((d) => {
        return {
          ...d,
          name: { ...d.name, value: auth.user.name },
          bio: { ...d.bio, value: auth.user.bio || "" },
        };
      });
    }
  }, [auth]);
  const handleUpdate = (name: string, bio: string) => {
    setLoading(true);
    dispatch(updateUser({ name, bio }))
      .unwrap()
      .then((_res) => {
        // todo: handle success signup
        setLoading(false);
        setError({
          active: false,
          message: "",
        });
        setShowToast({
          active: true,
          message: "Data Updated Successfully!",
          severity: "success",
        });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError({
          active: true,
          message: err?.response?.data?.message || "Something went wrong",
        });
      });
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (data.name.value === "") {
      setdata((d) => {
        return {
          ...d,
          name: {
            ...d.name,
            error: true,
            errorMessage: "Name cannot be empty",
          },
        };
      });
      return;
    }

    handleUpdate(data.name.value, data.bio.value);
  };

  const handleToastClose = (event: any, reason: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }

    setShowToast({
      active: false,
      message: "",
      severity: undefined,
    });
  };
  return (
    <Grid
      container
      direction='column'
      component={Paper}
      elevation={2}
      sx={{ height: "100%", borderRadius: "16px", p: "40px" }}
    >
      <Snackbar
        open={showToast.active}
        autoHideDuration={4000}
        onClose={handleToastClose}
      >
        <Alert
          onClose={(e) => handleToastClose(e, "clickaway")}
          severity={showToast.severity}
        >
          {showToast.message}
        </Alert>
      </Snackbar>
      <Grid item sx={{ width: "100%" }}>
        <Typography variant='h4'>Account Setting's</Typography>
      </Grid>
      {/* name */}
      <Grid item sx={{ width: "100%", mt: "20px" }}>
        <TextField
          margin='normal'
          required
          fullWidth
          id='name'
          label='Full name'
          name='name'
          autoComplete='name'
          autoFocus
          error={data.name.error}
          helperText={data.name.error ? data.name.errorMessage : ""}
          value={data.name.value}
          onChange={(e) =>
            setdata((d) => {
              return {
                ...d,
                name: {
                  value: e.target.value,
                  error: false,
                  errorMessage: "",
                },
              };
            })
          }
        />
      </Grid>
      {/* bio */}
      <Grid item sx={{ width: "100%", mt: "20px" }}>
        <TextField
          multiline
          minRows={8}
          margin='normal'
          placeholder='Tell us more about Your self'
          required
          fullWidth
          id='bio'
          label='Your bio'
          name='bio'
          error={data.bio.error}
          helperText={data.bio.error ? data.bio.errorMessage : ""}
          value={data.bio.value}
          onChange={(e) =>
            setdata((d) => {
              return {
                ...d,
                bio: {
                  value: e.target.value,
                  error: false,
                  errorMessage: "",
                },
              };
            })
          }
        />
      </Grid>
      {error.active && (
        <Grid item style={{ marginTop: "1em" }}>
          <Typography
            variant='subtitle2'
            style={{ display: "flex", alignItems: "center" }}
          >
            {" "}
            <ErrorOutlineIcon
              style={{ fill: "red", marginRight: "4px" }}
            />{" "}
            {error.message}
          </Typography>
        </Grid>
      )}

      <Grid item sx={{ width: "100%", mt: 3, mb: 2 }}>
        <Grid container alignItems='flex-end'>
          <Grid item sx={{ width: { md: "unset", xs: "100%" } }}>
            <Button
              size='large'
              type='submit'
              variant='contained'
              sx={{
                px: { md: "100px", xs: "20px" },
                width: { md: "unset", xs: "100%" },
                py: "8px",
                display: "flex",
                alignItems: "center",
                fontSize: "18px",
              }}
              onClick={handleFormSubmit}
            >
              {loading && (
                <CircularProgress
                  size='0.8rem'
                  sx={{ mr: "10px", color: "#fff", fontSize: "0.8rem" }}
                />
              )}
              Update
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
