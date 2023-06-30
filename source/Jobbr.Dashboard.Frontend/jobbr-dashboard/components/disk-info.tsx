import React from "react";

const formatFileSize = (bytes: number) => {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const formattedSize = parseFloat((bytes / Math.pow(1024, i)).toFixed(2));

  return `${formattedSize} ${sizes[i]}`;
};

export default function DiskInfo({ space }) {
  const formattedSize = formatFileSize(space);

  return <>{formattedSize}</>;
}
