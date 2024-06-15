import React from "react";
// style={{ background: "hsla(226, 100%, 70%, 1)" }}
export default function Footer() {
  return (
    <footer className="py-4" style={{ backgroundColor: "#333" }}>
      <div className="text-center text-white">
        &copy; {new Date().getFullYear()} - All Rights Reserved / Flight in
        Range
      </div>
    </footer>
  );
}
