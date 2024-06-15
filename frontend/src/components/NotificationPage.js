import React from "react";

export default function NotificationPage({ destinationType }) {
  return (
    <div className="mb-4">
      <h1 className="text-center">{destinationType}</h1>
      <img
        className="mx-auto d-block"
        src="/no-destination-image.jpg"
        height="500px"
        alt="no destinations"
      />
    </div>
  );
}
