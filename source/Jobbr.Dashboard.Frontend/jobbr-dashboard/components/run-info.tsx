import React from "react";
import { formatDistanceStrict } from "date-fns";

const timeSince = (actualStartUtc: string, plannedStartUtc: string) => {
  const actualStart = new Date(actualStartUtc);
  const plannedStart = new Date(plannedStartUtc);
  return formatDistanceStrict(actualStart, plannedStart, { addSuffix: false });
};

export default function RunInfo({ actualStartUtc, plannedStartUtc }) {
  if (!actualStartUtc || !plannedStartUtc) {
    return <></>;
  }

  const timeDiff = timeSince(actualStartUtc, plannedStartUtc);

  return <>{timeDiff} later</>;
}
