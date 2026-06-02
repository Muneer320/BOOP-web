import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="not-found-page">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
    <div>
      <Link to="/" className="btn btn-primary">Go Home</Link>
      <Link to="/create" className="btn btn-secondary" style={{ marginLeft: "0.5rem" }}>Create Puzzle</Link>
    </div>
  </div>
);

export default NotFound;
