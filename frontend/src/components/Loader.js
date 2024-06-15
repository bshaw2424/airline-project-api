import BarLoader from "react-spinners/BarLoader";

export default function Loader({ loading }) {
  return (
    <div
      className="d-flex align-items-center justify-content-center w-100"
      style={{ minHeight: "100vh" }}
    >
      <BarLoader loading={loading} color="#36d7b7" />
    </div>
  );
}
