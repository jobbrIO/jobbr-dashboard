import React from "react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export default function Clock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const formattedTime = format(utcToZonedTime(currentTime, "UTC"), "dd.MM.yyyy HH:mm:ss");

  return <>{formattedTime}</>;
};
