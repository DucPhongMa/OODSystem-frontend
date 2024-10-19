// pages/register/index.js
"use client";
import "../../styles/AdminRegister.scss";
import Form from "../../components/admin/register/Form";
import MainNavbar from "../../components/admin/register/LandingNavbar";

export default function Register() {
  return (
    <>
      <MainNavbar isLoggedin={false} />
      <div className="RegisterPage">
        <Form />
      </div>
    </>
  );
}
