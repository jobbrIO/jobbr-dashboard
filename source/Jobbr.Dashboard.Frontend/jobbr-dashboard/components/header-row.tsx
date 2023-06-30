import React from "react";

export default function HeaderRow({ icon, title, rowClasses = "", iconClasses = "" }) {
  const rowClasseName = `row ${rowClasses}`;
  const iconClasseName = `fas fa-${icon} ${iconClasses} mr-2`;
  return (
    <div className={rowClasseName}>
      <div className="col-sm-12">
        <h3>
          <i className={iconClasseName}></i> {title}
        </h3>
      </div>
    </div>
  );
}
