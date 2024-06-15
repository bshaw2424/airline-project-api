import { NavLink } from "react-router-dom";

export default function FilterListButtons({ btnName, className, listData }) {
  return (
    <>
      <NavLink
        className={`btn btn-outline-${className} filter-buttons me-3`}
        onClick={listData}
      >
        {btnName}
      </NavLink>
    </>
  );
}
