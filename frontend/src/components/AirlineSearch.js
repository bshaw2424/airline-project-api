import Form from "../components/Form/Form";
// import Airlines from "./Airlines";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AirlineSearch = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState();

  const airlineSearch = e => {
    setInputValue(e.target.value);

    e.preventDefault();

    return navigate("/airlines");
  };
  const handleOptionChange = e => {
    setInputValue(e.target.value);
  };
  const formChange = e => {};

  return (
    <section>
      <Form
        onSubmit={e => airlineSearch(e)}
        handleOptionChange={e => handleOptionChange(e)}
        formChange={e => formChange(e)}
        formValue={inputValue}
      />
    </section>
  );
};

export default AirlineSearch;
