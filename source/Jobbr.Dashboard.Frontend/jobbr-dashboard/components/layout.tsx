import React from "react";
import Head from "next/head";
import Navigation from "./navigation";

const name = "Your Name";
export const siteTitle = "Dashboard";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Dashboard of Jobbr a .NET Job Server" />
        <meta name="og:title" content={siteTitle} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <header>
        <Navigation />
      </header>
      <main role="main" className="container-fluid">
        {children}
      </main>
    </>
  );
}
