import Layout from "@/components/Layout";
import SnackBar from "@/components/MySnackBar";
import { store } from "@/store";
import "@/styles/globals.css";
import { theme } from "@/utils/theme";
import { ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
            <SnackBar />
          </Layout>
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  );
}
