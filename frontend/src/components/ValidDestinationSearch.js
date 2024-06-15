import Error from "./Error";

export default function ValidDestinationSearch({
  searchValue,
  selectMenuValue,
}) {
  return (
    <>
      <Error
        message={`${searchValue}.toUpperCase()} is not a valid ${selectMenuValue}`}
      />
    </>
  );
}
