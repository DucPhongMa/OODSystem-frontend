"use client";
import "./App.css";
import Form from "../../components/admin/register/Form";
import MainNavbar from "../../components/admin/register/MainNavbar"

function App() {
  return (
    <>
      <MainNavbar isLoggedin={false}/>
      <div className="App">
        <Form />
      </div>
    </>
   
  );
}

export default App;
