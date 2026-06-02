import React from "react";

const Skeleton = ({ width, height = "1rem", borderRadius = "4px", style }) => {
  return (
    <div
      className="skeleton"
      style={{
        width: width || "100%",
        height,
        borderRadius,
        ...style,
      }}
    />
  );
};

export const SkeletonCard = () => (
  <div className="card skeleton-card">
    <Skeleton width="60%" height="1.5rem" style={{ marginBottom: "1rem" }} />
    <Skeleton height="1rem" style={{ marginBottom: "0.5rem" }} />
    <Skeleton width="90%" height="1rem" style={{ marginBottom: "0.5rem" }} />
    <Skeleton width="75%" height="1rem" />
  </div>
);

export const SkeletonForm = () => (
  <div className="card skeleton-card">
    <Skeleton width="40%" height="1.5rem" style={{ marginBottom: "2rem" }} />
    <Skeleton height="2.5rem" style={{ marginBottom: "1rem" }} />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
      <Skeleton height="2.5rem" />
      <Skeleton height="2.5rem" />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
      <Skeleton height="2.5rem" />
      <Skeleton height="2.5rem" />
    </div>
    <Skeleton width="200px" height="2.5rem" borderRadius="4px" />
  </div>
);

export default Skeleton;
