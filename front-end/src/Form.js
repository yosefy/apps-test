import React, { useState, Fragment } from "react";
// import ReactDOM from "react-dom";

// import "bootstrap/dist/css/bootstrap.css";

const FormPage = () => {
  const [inputFields, setInputFields] = useState([
    { fieldValue: "", type: "" },
  ]);
  const [reply, setReply] = useState([""]);

  const handleAddFields = () => {
    const values = [...inputFields];
    values.push({ fieldValue: "", type: "" });
    setInputFields(values);
  };

  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  const isPhone = (phone) => {
    let re = /^\+\d{7}\d*$/;
    return re.test(phone);
  };

  const validateEmail = (email) => {
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleInputChange = (index, event) => {
    const values = [...inputFields];
    values[index].fieldValue = event.target.value;
    if (validateEmail(event.target.value)) {
      values[index].type = "email";
    } else if (isPhone(event.target.value)) {
      values[index].type = "phone";
    } else {
      values[index].type = "";
    }

    setInputFields(values);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:8081/hi", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(inputFields),
    })
      .then((response) => response.json())
      .then((data) => setReply(data))
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  const resetForm = (e) => setInputFields([{ fieldValue: "" }]);

  return (
    <>
      <h1>Search By email or phone</h1>
      <p>phone must include country code like +972 for Israel</p>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="form-row justify-content-center">
          {inputFields.map((inputField, index) => (
            <Fragment key={`${inputField}~${index}`}>
              <div className="form-group col-sm-6">
                <label htmlFor="fieldValue">
                  enter email or phone in the line below
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="fieldValue"
                  name="fieldValue"
                  value={inputField.fieldValue}
                  onChange={(event) => handleInputChange(index, event)}
                />
              </div>
              <div className="form-group col-sm-1">
                <button
                  className="btn btn-link"
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleRemoveFields(index)}
                >
                  -
                </button>
                <button
                  className="btn btn-link"
                  type="button"
                  onClick={() => handleAddFields()}
                >
                  +
                </button>
              </div>
            </Fragment>
          ))}
        </div>
        <div className="submit-button">
          <button
            className="btn btn-primary mr-2"
            type="submit"
            onSubmit={handleSubmit}
            disabled={inputFields.find((t) => t.type === "")}
          >
            Send to Server
          </button>
          <button
            className="btn btn-secondary mr-2"
            type="reset"
            onClick={resetForm}
          >
            Reset Form
          </button>
        </div>
        <br />
        <h3 className="left">Request</h3>
        <pre className="left">{JSON.stringify(inputFields, null, 4)}</pre>
        <h3 className="left">Last Enreached Reply From Server</h3>
        <pre className="left">{JSON.stringify(reply, null, 4)}</pre>
      </form>
    </>
  );
};

export default FormPage;
