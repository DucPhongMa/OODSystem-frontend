"use client";
import { addImage } from "./api/image";
import { addRestaurant } from "./api/restaurant";
import { useState, useEffect } from "react";
import { registerBusiness, loginBusiness } from "./api/auth";

export default function Home() {
  useEffect(() => {
    registerBusiness({
      username: "Vivy",
      email: "vngvy48@gmail.com",
      password: "password1234.",
    });

    // loginBusiness({
    //   username: "Vivy",
    //   password: "testing",
    // })
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Image Add:
        <input type="file" name="name" onChange={handleImageFile} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
