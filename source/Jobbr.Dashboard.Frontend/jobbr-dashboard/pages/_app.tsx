import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/globals.scss";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
