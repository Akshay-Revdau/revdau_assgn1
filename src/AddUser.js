import React, { useState } from "react";
import './signup.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import './AddUser.css'
const AddUser = ({ showModal, closeModal, addUser }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    Fname: "", Lname: "", Phone: "", Designation: "", Email: "", Password: "", role: "user" 
  });

  const handleInputs = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  }

  const PostData = async (e) => {
    e.preventDefault();
    const { Fname, Lname, Phone, Designation, Email, Password, role } = user;

    const res = await fetch('/Signup', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Fname, Lname, Phone, Designation, Email, Password, role
      })
    });

    const data = await res.json();

    if (res.status === 422 || !data) {
      toast.error(data.error || "Invalid registration.");
      console.log("Invalid registration.");
    } else {
      toast.success("Registration successful!");
      console.log("Registration successful.");
      addUser(user);
      closeModal();
    }
  }

  const Validate = () => {
    let returnval = true;
    clearErrors();

    const name = document.forms['myForm']["Fname"].value;
    if (name.length === 0) {
      seterror("Fname-error", "*Length of name cannot be zero!");
      returnval = false;
    } else if (name[0] !== name[0].toUpperCase()) {
      seterror("Fname-error", "*First letter should be in caps");
      returnval = false;
    }

    const email = document.forms['myForm']["Email"].value;
    if (!email.includes('@')) {
      seterror("Email-error", "*Email should contain '@'");
      returnval = false;
    }

    const phone = document.forms['myForm']["Phone"].value;
    if (phone.length !== 10) {
      seterror("Phone-error", "*Phone number should be of 10 digits!");
      returnval = false;
    }

    const password = document.forms['myForm']["Password"].value;
    if (password.length < 6) {
      seterror("Password-error", "*Password should be at least 6 characters long!");
      returnval = false;
    }

    const cpassword = document.forms['myForm']["psw-repeat"].value;
    if (cpassword !== password) {
      seterror("psw-repeat-error", "*Passwords didn't match should match!");
      returnval = false;
    }

    return returnval;
  }

  const seterror = (id, error) => {
    const element = document.getElementById(id);
    element.innerHTML = error;
  }

  const clearErrors = () => {
    const errorElements = document.getElementsByClassName('formerror');
    for (let item of errorElements) {
      item.innerHTML = "";
    }
  }

  return (
    <>
      <div className={`modal-overlay ${showModal ? 'show' : ''}`} onClick={closeModal}></div>
      <div className={`modal ${showModal ? 'show' : ''}`}>
        <ToastContainer />
        <form method="POST" name="myForm" onSubmit={(e) => {
          e.preventDefault();
          if (Validate()) {
            PostData(e);
          }
        }}>
          <div className="container">
            <h1>Sign Up</h1>
            <p>Please fill in this form to create an account.</p>

            <label htmlFor="Fname"><b>First Name</b></label>
            <input type="text" placeholder="First Name" name="Fname" id="Fname" value={user.Fname} onChange={handleInputs} required />
            <span id="Fname-error" className="formerror"></span>

            <label htmlFor="Lname"><b>Last Name</b></label>
            <input type="text" placeholder="Last Name" name="Lname" id="Lname" value={user.Lname} onChange={handleInputs} required />
            <span id="Lname-error" className="formerror"></span>

            <label htmlFor="Phone"><b>Phone</b></label>
            <input type="text" placeholder="Enter Number" name="Phone" id="Phone" size="10" value={user.Phone} onChange={handleInputs} required />
            <span id="Phone-error" className="formerror"></span>

            <label htmlFor="Designation"><b>Designation</b></label>
            <input type="text" placeholder="Enter Designation" name="Designation" id="Designation" value={user.Designation} onChange={handleInputs} required />
            <span id="Designation-error" className="formerror"></span>

            <label htmlFor="Email"><b>Email</b></label>
            <input type="text" placeholder="Enter Email" name="Email" id="Email" value={user.Email} onChange={handleInputs} required />
            <span id="Email-error" className="formerror"></span>

            <label htmlFor="Password"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" name="Password" id="Password" value={user.Password} onChange={handleInputs} required />
            <span id="Password-error" className="formerror"></span>

            <label htmlFor="psw-repeat"><b>Repeat Password</b></label>
            <input type="password" placeholder="Repeat Password" name="psw-repeat" id="psw-repeat" required />
            <span id="psw-repeat-error" className="formerror"></span>

            <label htmlFor="role"><b>Role</b></label>
            <input type="text" placeholder="Enter Role" name="role" id="role" value={user.role} onChange={handleInputs} />
            
            <label>
              <input type="checkbox" name="remember" style={{ marginBottom: "15px" }} /> Remember me
            </label>

            <p>By creating an account you agree to our <a href="/" style={{ color: "blue" }}>Terms & Privacy</a>.</p>

            <div className="clearfix">
              <button type="button" onClick={() => closeModal()} className="cancelbtn">Cancel</button>
              <button type="submit" className="signupbtn">Sign Up</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddUser;
