"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux";
import { login } from "@/redux/slices/auth";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import GoogleLoginComponent from "@/components/common/Google";
import theme from "@/theme";
interface propsType {
  onSuccess?: (auth: AuthState) => void;
}
export default function Form({ onSuccess }: propsType) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.jwt);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    active: false,
    message: "",
  });
  const [data, setdata] = useState({
    email: {
      value: "",
      error: false,
      errorMessage: "",
    },
    password: {
      value: "",
      error: false,
      errorMessage: "",
    },
  });
  useEffect(() => {
    if (token) {
      router.push(`/`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (email: string, password: string) => {
    setError({
      active: false,
      message: "",
    });
    setLoading(true);
    dispatch(login({ email, password }))
      .unwrap()
      .then((res: AuthState) => {
        setLoading(false);
        setError({
          active: false,
          message: "",
        });
        if (onSuccess) {
          onSuccess(res);
        } else {
          router.push(`/dashboard`);
        }
      })
      .catch((err) => {
        // toast.error(t("loginFail"));
        console.log(err);
        setLoading(false);
        setError({
          active: true,
          message: err?.response?.data?.message || "Something went wrong",
        });
      });
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (data.email.value === "") {
      setdata((d) => {
        return {
          ...d,
          email: {
            ...d.email,
            error: true,
            errorMessage: "Email cannot be empty",
          },
        };
      });
      return;
    }
    if (data.password.value === "") {
      setdata((d) => {
        return {
          ...d,
          password: {
            ...d.password,
            error: true,
            errorMessage: "Password cannot be empty",
          },
        };
      });
      return;
    }
    handleLogin(data.email.value, data.password.value);
  };
  return (
    <Grid container component='main' sx={{ height: "100vh" }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random?wallpapers)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: "20px",
            height: "100%",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <Box
            component='form'
            noValidate
            onSubmit={handleFormSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
              error={data.email.error}
              helperText={data.email.error ? data.email.errorMessage : ""}
              value={data.email.value}
              onChange={(e) =>
                setdata((d) => {
                  return {
                    ...d,
                    email: {
                      value: e.target.value,
                      error: false,
                      errorMessage: "",
                    },
                  };
                })
              }
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              error={data.password.error}
              helperText={data.password.error ? data.password.errorMessage : ""}
              value={data.password.value}
              onChange={(e) =>
                setdata((d) => {
                  return {
                    ...d,
                    password: {
                      value: e.target.value,
                      error: false,
                      errorMessage: "",
                    },
                  };
                })
              }
            />
            {error.active && (
              <Grid item style={{ marginTop: "1em" }}>
                <Typography
                  variant='subtitle2'
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {" "}
                  <ErrorOutlineIcon
                    style={{ fill: "red", marginRight: "10px" }}
                  />{" "}
                  {error.message}
                </Typography>
              </Grid>
            )}
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2, display: "flex", alignItems: "center" }}
            >
              {loading && (
                <CircularProgress
                  size='0.8rem'
                  sx={{ mr: "10px", color: "#fff", fontSize: "0.8rem" }}
                />
              )}
              Sign In
            </Button>
            <Grid item container justifyContent='center'>
              <Link href='/signup' style={{ textDecoration: "none" }}>
                <Typography
                  variant='body2'
                  align='center'
                  sx={{ color: (theme) => theme.palette.primary.main }}
                >
                  {"Don't have an account? Sign Up"}
                </Typography>
              </Link>
            </Grid>
            <Grid item container sx={{ mt: "15px" }}>
              <GoogleLoginComponent />
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
