import "./globals.css";

import React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";
import Main from "@/components/main";
import { Metadata } from "next";
import { CssBaseline } from "@mui/material";

export const metadata: Metadata = {
  title: "Audio MVP",
  description: "Audio MVP",
};

// function Main({
//   children,
//   modal,
// }: Record<"children" | "modal", React.ReactNode>) {
//   const [loadingAuth, setLoadingAuth] = useState(true);

//   useEffect(() => {
//     const fetchToken = async () => {
//       let Token = null;
//       try {
//         Token = await localStorage.getItem("campus-guro-jwt");
//       } catch (e) {
//         console.log("Error Fetching jwt Token");
//         setLoadingAuth(false);
//       }

//       if (Token != null) {

//       } else {
//         setLoadingAuth(false);
//       }
//     };
//   }, []);
// }

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Main>{children}</Main>

            {modal && modal}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
