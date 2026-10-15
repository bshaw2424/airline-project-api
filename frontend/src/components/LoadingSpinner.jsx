export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center py-5"
      style={{ minHeight: "250px" }}
      role="status"
      aria-live="polite"
    >
      <div
        className="spinner-border text-primary mb-3"
        style={{ width: "2.5rem", height: "2.5rem" }}
        aria-hidden="true"
      />

      <p className="text-muted mb-0">{message}</p>
    </div>
  );
}
