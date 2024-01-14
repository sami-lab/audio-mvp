"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { FormEvent, useEffect, useState } from "react";
import { useAppSelector } from "@/redux";
import authService from "@/services/auth-service";
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
interface propsType {
  onSuccess?: () => void;
}
export default function Form({ onSuccess }: propsType) {
  const token = useAppSelector((state) => state.auth.jwt);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    active: false,
    message: "",
  });
  const [data, setdata] = useState({
    name: {
      value: "",
      error: false,
      errorMessage: "",
    },
    userName: {
      value: "",
      error: false,
      errorMessage: "",
    },
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

  const handleSignup = (
    name: string,
    userName: string,
    email: string,
    password: string
  ) => {
    setLoading(true);
    authService
      .signup(name, userName, email, password)
      .then((_res) => {
        // todo: handle success signup
        setLoading(false);
        setError({
          active: false,
          message: "",
        });
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/login`);
        }
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
    if (data.userName.value === "") {
      setdata((d) => {
        return {
          ...d,
          userName: {
            ...d.userName,
            error: true,
            errorMessage: "Username cannot be empty",
          },
        };
      });
      return;
    }
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
    if (
      !/(?:[a-z0-9!#$%&'*/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
        data.email.value
      )
    ) {
      setdata((d) => {
        return {
          ...d,
          email: {
            ...d.email,
            error: true,
            errorMessage: "Invalid Email",
          },
        };
      });
      return;
    }
    const passwordRegex = /^[a-zA-Z0-9]{6,}$/;

    if (
      data.password.value === "" ||
      !passwordRegex.test(data.password.value)
    ) {
      setdata((d) => {
        return {
          ...d,
          password: {
            ...d.password,
            error: true,
            errorMessage:
              "Password must be 6 characters long with digit and alphabets",
          },
        };
      });
      return;
    }
    handleSignup(
      data.name.value,
      data.userName.value,
      data.email.value,
      data.password.value
    );
  };
  return (
    <>
      <Grid container component='main' sx={{ height: "100vh" }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
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
              Register
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
              <TextField
                margin='normal'
                required
                fullWidth
                id='userName'
                label='User name'
                name='User name'
                autoComplete='name'
                error={data.userName.error}
                helperText={
                  data.userName.error ? data.userName.errorMessage : ""
                }
                value={data.userName.value}
                onChange={(e) =>
                  setdata((d) => {
                    return {
                      ...d,
                      userName: {
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
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
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
                helperText={
                  data.password.error ? data.password.errorMessage : ""
                }
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
                      style={{ fill: "red", marginRight: "4px" }}
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
                Sign up
              </Button>
              <Grid item container justifyContent='center'>
                <Link href='/login' style={{ textDecoration: "none" }}>
                  <Typography
                    variant='body2'
                    align='center'
                    sx={{ color: (theme) => theme.palette.primary.main }}
                  >
                    {"Already have an account? Sign In"}
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
    </>
  );
}
