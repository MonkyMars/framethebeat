"use client"
import React from "react";
import "./styles.scss";

const Tours = () => {
  const [state] = React.useState<boolean>(false);
  if (!state) {
    return (
      <div className="comingsoon">
        <h1>Coming Soon</h1>
      </div>
    );
  }
  return (
    <main>
      <h1>Tours</h1>
    </main>
  );
}

export default Tours;