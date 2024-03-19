// Management Interface Registration Form
// /admin/register

import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import SignUpInfo from "./SignUpInfo";
import RestaurantInfo from "./RestaurantInfo";
import RestaurantHoursInfo from "./RestaurantHoursInfo";
import RestaurantMenuInfo from "./RestaurantMenuInfo";
import RestaurantThemeInfo from "./RestaurantThemeInfo";
import ConfirmInfo from "./ConfirmInfo";
import { addRestaurant } from "../../../api/restaurant";
import { registerBusiness } from "@/app/api/auth";
import { selectedFileAtom } from "../../../../../store";
import { selectedLogoAtom } from "../../../../../store";
import { useAtom } from "jotai";

function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
  // Check for minimum length
  if (password.length < 8) {
    return false;
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // Check for digit
  if (!/[0-9]/.test(password)) {
    return false;
  }

  // Check for special character
  if (!/[!@#$%^&*]/.test(password)) {
    return false;
  }

  // If all conditions are met
  return true;
}

function Form() {
  let alertMsg = "";
  const FormTitles = [
    "Sign Up",
    "Restaurant Info",
    "Restaurant Hours Info",
    "Restaurant Theme Info",
    "Restaurant Menu Info",
    "Confirm Info",
  ];

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [selectedFile, setSelectedFile] = useAtom(selectedFileAtom);
  const [selectedLogo, setSelectedLogo] = useAtom(selectedLogoAtom);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",

    name: "",
    route: "",

    restaurant_contact: {
      phone: "",
      address: "",
      provinceOrState: "",
      city: "",
      postalCode: "",
    },

    restaurant_description: {
      aboutDescription: "",
    },

    restaurantTheme: { id: 1, name: "Classic" },

    categories: [],

    hours: {
      monday: { open: "", close: "" },
      tuesday: { open: "", close: "" },
      wednesday: { open: "", close: "" },
      thursday: { open: "", close: "" },
      friday: { open: "", close: "" },
      saturday: { open: "", close: "" },
      sunday: { open: "", close: "" },
    },
  });

  const handleClose = () => {
    setOpen(false);
    window.location.href = "https://ood-system-frontend.vercel.app/admin/login";
  };

  const handleLogin = () => {
    window.location.href = "https://ood-system-frontend.vercel.app/admin/login";
  };

  const handleRestaurant = () => {
    window.location.href = `https://ood-system-frontend.vercel.app/${formData.route}`;
  };

  const PageDisplay = () => {
    if (page === 0) {
      return <SignUpInfo formData={formData} setFormData={setFormData} />;
    } else if (page === 1) {
      return (
        <>
          <RestaurantInfo formData={formData} setFormData={setFormData} />
          {selectedLogo && <p>Selected Logo: {selectedLogo.name}</p>}
          {selectedFile && <p>Selected file: {selectedFile.name}</p>}
        </>
      );
    } else if (page === 2) {
      return (
        <RestaurantHoursInfo formData={formData} setFormData={setFormData} />
      );
    } else if (page === 3) {
      return (
        <RestaurantThemeInfo formData={formData} setFormData={setFormData} />
      );
    } else if (page === 4) {
      return (
        <RestaurantMenuInfo formData={formData} setFormData={setFormData} />
      );
    } else {
      return <ConfirmInfo formData={formData} setFormData={setFormData} />;
    }
  };

  const validateForm = () => {
    if (page === 0) {
      // Sign Up page must have email and password
      if (!formData.email || !formData.password) {
        alertMsg = "Please fill in all required fields.";
        return false;
      }

      // Sign Up page email must be valid
      if (!validateEmail(formData.email)) {
        alertMsg = "Invalid email.";
        return false;
      }

      // Sign Up page passwords must match
      if (formData.password !== formData.confirmPassword) {
        alertMsg = "Passwords do not match.";
        return false;
      }

      // Sign Up page password must be a valid password
      if (!validatePassword(formData.password)) {
        alertMsg =
          "Passwords must be\nAt least 8 characters long\nContains at least one uppercase letter\nContains at least one lowercase letter\nContains at least one digit\nContains at least one special character";
        return false;
      }
    } else if (page === 1 && (!formData.name || !formData.route)) {
      // Restaurant Info page must have name and route
      alertMsg = "Please fill in all required fields.";
      return false;
    }

    return true;
  };

  return (
    <div className="form">
      <div className="progressbar">
        <div
          style={{
            width:
              page === 0
                ? "16.67%"
                : page == 1
                  ? "33.33%"
                  : page == 2
                    ? "50%"
                    : page == 3
                      ? "66.67%"
                      : page == 4
                        ? "83.33%"
                        : "100%",
          }}
        ></div>
      </div>
      <div className="form-container">
        <div className="header">
          <h1>{FormTitles[page]}</h1>
        </div>
        <div className="body">{PageDisplay()}</div>
        <div className="footer">
          <button
            disabled={page == 0}
            onClick={() => {
              setPage((currPage) => currPage - 1);
            }}
          >
            Prev
          </button>
          <button
            onClick={async () => {
              if (page === FormTitles.length - 1) {
                // When user clicks the Submit button to submit the registration form
                alert("FORM SUBMITTED");

                try {
                  // Get an array of just category names
                  let categoryNames = formData.categories.map(
                    (category) => category.name
                  );

                  console.log(categoryNames);
                  await registerBusiness(
                    formData.email,
                    formData.confirmPassword
                  );

                  //===========================Upload Logo============================
                  const formData3 = new FormData();
                  formData3.append("file", selectedLogo);
                  formData3.append("upload_preset", "my-uploads");

                  const logoData = await fetch(
                    "https://api.cloudinary.com/v1_1/dyu1deqdg/image/upload",
                    {
                      method: "POST",
                      body: formData3,
                    }
                  ).then((r) => r.json());
                  console.log("data", logoData);
                  console.log("image_url", logoData.secure_url);

                  const uploadLogo = logoData.secure_url;
                  if (!uploadLogo) {
                    console.error("Image upload failed.");
                    return;
                  }

                  //console.log("Cloudinary: ", uploadLogo);
                  //============================================================================

                  //===========================Upload Images============================
                  const formData2 = new FormData();
                  formData2.append("file", selectedFile);
                  formData2.append("upload_preset", "my-uploads");

                  const data = await fetch(
                    "https://api.cloudinary.com/v1_1/dyu1deqdg/image/upload",
                    {
                      method: "POST",
                      body: formData2,
                    }
                  ).then((r) => r.json());
                  console.log("data", data);
                  console.log("image_url", data.secure_url);

                  const uploadImage = data.secure_url;
                  if (!uploadImage) {
                    console.error("Image upload failed.");
                    return;
                  }

                  //console.log("Cloudinary: ", uploadImage);
                  //============================================================================
                  // Get an array containing a list of all items from all categories
                  let allItems = formData.categories.flatMap(
                    (category, index) =>
                      category.items.map((item) => ({
                        category_id: index,
                        name: item.name,
                        price: item.price,
                        description: item.description,
                        imageURL: item.imageName,
                      }))
                  );

                  const restaurantData = await addRestaurant(
                    formData.name,
                    formData.route,
                    formData.restaurant_contact,
                    formData.restaurant_description,
                    categoryNames,
                    allItems,
                    formData.hours,
                    formData.restaurantTheme,
                    formData.email,
                    uploadImage,
                    uploadLogo
                  );

                  console.log(formData);
                  console.log(restaurantData);

                  // Open the dialog window
                  setOpen(true);
                } catch (error) {
                  // handle route unique error error
                  alert(error);
                }
              } else {
                if (validateForm()) {
                  setPage((currPage) => currPage + 1);
                } else {
                  alert(alertMsg);
                }
              }
            }}
          >
            {page === FormTitles.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Account Created"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Username: {formData.email}
            <br />
            Restaurant URL: https://ood-system-frontend.vercel.app/
            {formData.route}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogin} color="primary">
            Go to login page
          </Button>
          <Button onClick={handleRestaurant} color="primary" autoFocus>
            Go to restaurant website
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Form;
