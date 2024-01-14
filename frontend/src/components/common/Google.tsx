import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

import { CircularProgress, Grid, Typography, Button } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/redux";
import { externalLogin } from "@/redux/slices/auth";

function Google(props: { text?: string }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    active: false,
    message: "",
  });

  const handleLogin = (data: { code: string; method: string }) => {
    setError({
      active: false,
      message: "",
    });
    setLoading(true);
    dispatch(externalLogin({ token: data.code, method: data.method }))
      .unwrap()
      .then((res: AuthState) => {
        router.push(`/dashboard`);

        setLoading(false);
        setError({
          active: false,
          message: "",
        });
      })
      .catch((err) => {
        // toast.error(t("loginFail"));
        console.log(err);
        setLoading(false);
        setError({
          active: false,
          message: err.response?.data?.message || "Something went wrong",
        });
      });
  };

  const onFailure = (err: any) => {
    console.log("failed", err);
    setError({
      active: true,
      message: err.message || "Something went wrong",
    });
  };

  const login = useGoogleLogin({
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    onSuccess: (codeResponse) =>
      handleLogin({ code: codeResponse.code, method: "google" }),
    onError: (err) => onFailure(err),
    flow: "auth-code",
  });

  return (
    <>
      <Button
        fullWidth
        onClick={() => login()}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#344054",
          backgroundColor: "#fff",
          borderRadius: "8px",
          fontWeight: 700,
          textTransform: "none",
          boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
          border: "1px solid #D0D5DD",
          padding: "10px",
          "&:hover": {
            color: "#344054",
            backgroundColor: "#fff",
          },
        }}
      >
        {loading ? (
          <CircularProgress size='10px' sx={{ mr: "10px" }} />
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='18'
            height='19'
            fill='none'
            viewBox='0 0 18 19'
            style={{ marginRight: "10px" }}
          >
            <path
              fill='#4285F4'
              fillRule='evenodd'
              d='M18 9.392c0-.65-.058-1.277-.167-1.878h-8.65v3.552h4.943a4.223 4.223 0 01-1.832 2.772v2.304h2.968C16.998 14.544 18 12.19 18 9.392z'
              clipRule='evenodd'
            ></path>
            <path
              fill='#34A853'
              fillRule='evenodd'
              d='M9.184 18.367c2.479 0 4.558-.822 6.077-2.225l-2.967-2.304c-.823.551-1.875.877-3.11.877-2.392 0-4.417-1.616-5.139-3.787H.977v2.38a9.18 9.18 0 008.207 5.059z'
              clipRule='evenodd'
            ></path>
            <path
              fill='#FBBC05'
              fillRule='evenodd'
              d='M4.045 10.929a5.522 5.522 0 01-.288-1.745c0-.606.104-1.194.288-1.745v-2.38H.977A9.181 9.181 0 000 9.185c0 1.482.355 2.884.977 4.124l3.068-2.38z'
              clipRule='evenodd'
            ></path>
            <path
              fill='#EA4335'
              fillRule='evenodd'
              d='M9.184 3.653c1.348 0 2.559.463 3.51 1.373l2.634-2.634C13.738.91 11.66 0 9.184 0A9.18 9.18 0 00.977 5.06l3.068 2.379c.722-2.171 2.747-3.786 5.139-3.786z'
              clipRule='evenodd'
            ></path>
          </svg>
        )}
        {props.text ? props.text : "Log in with Google"}
      </Button>

      {error.active && (
        <Grid item style={{ marginTop: "1em" }}>
          <Typography
            variant='subtitle2'
            style={{ display: "flex", alignItems: "center" }}
          >
            {" "}
            <ErrorOutline style={{ fill: "red", marginRight: "4px" }} />{" "}
            {error.message}
          </Typography>
        </Grid>
      )}
    </>
  );
}
export default function GoogleLoginComponent() {
  return (
    <GoogleOAuthProvider
      clientId={process.env.GOOGLE_CLIENT_ID as string}
      //clientId='425560696157-nmvjfegittpg46e0ml0akp91qjmhos28.apps.googleusercontent.com'
    >
      <Google />
    </GoogleOAuthProvider>
  );
}
