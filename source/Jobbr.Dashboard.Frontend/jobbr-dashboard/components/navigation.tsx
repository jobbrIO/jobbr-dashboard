import React from "react";
import format from "date-fns/format";
import { utcToZonedTime } from "date-fns-tz";
import Clock from "./clock";
import Link from "next/link";

export default function Layout(routes) {
  const now = format(utcToZonedTime(new Date(), "UTC"), "dd.MM.yyyy HH:mm");

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
      <img src="images/logo/Jobbr-Light.png" height="36" className="mr-2" />
      <button
        className="navbar-toggler collapsed"
        type="button"
        data-toggle="collapse"
        data-target="#navbar"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="navbar-collapse collapse" id="navbar">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item" key="dashboard">
            <Link className="nav-link" href="/">
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </Link>
          </li>
          <li className="nav-item" key="jobs">
            <Link className="nav-link" href="/jobs">
              <i className="far fa-calendar-alt"></i> Jobs
            </Link>
          </li>
          <li className="nav-item" key="runs">
            <Link className="nav-link" href="/runs">
              <i className="fas fa-flag-checkered"></i> Runs
            </Link>
          </li>
        </ul>
        <div className="text-light">
          <i className="far fa-clock"></i> UTC: <Clock />
        </div>
      </div>
    </nav>
  );
}
