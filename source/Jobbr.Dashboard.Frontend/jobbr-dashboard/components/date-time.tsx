import React from "react";
import { format, parse } from "date-fns";

export default function DateTime({ dateTime }) {
  var parsedDate = parse(dateTime, "yyyy-MM-dd'T'HH:mm:ss", new Date());

  if (isNaN(parsedDate.getDate())) {
    var parsedDate = parse(dateTime, "yyyy-MM-dd'T'HH:mm:ss.SSS", new Date());
  }

  if (isNaN(parsedDate.getDate())) {
    return <></>;
  }

  const formattedDateTime = format(parsedDate, "dd.MM.yyyy HH:mm");

  return <>{formattedDateTime}</>;
}
