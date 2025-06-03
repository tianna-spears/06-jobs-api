import {
  inputEnabled,
  setDiv,
  message,
  token,
  enableInput,
  setToken,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showJobs } from "./jobs.js";

let registerDiv = null;
let name = null;
let email1 = null;
let password1 = null;
let password2 = null;

export const handleRegister = () => {
  registerDiv = document.getElementById("register-div");
  name = document.getElementById("name");
  email1 = document.getElementById("email1");
  password1 = document.getElementById("password1");
  password2 = document.getElementById("password2");
  const registerButton = document.getElementById("register-button");
  const registerCancel = document.getElementById("register-cancel");

  registerDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === registerButton) {
        if (password1.value != password2.value) {
          message.textContent = "The passwords entered do not match.";
        } else {
          enableInput(false);

          try {
            const response = await fetch("/api/v1/auth/register", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: name.value,
                email: email1.value,
                password: password1.value,
              }),
            });

            const data = await response.json();
            if (response.status === 201) {
              message.textContent = `Registration successful.  Welcome ${data.user.name}`;
              setToken(data.token);

              name.value = "";
              email1.value = "";
              password1.value = "";
              password2.value = "";

              showJobs();
            } else {
              message.textContent = data.msg;
            }
          } catch (err) {
            console.error(err);
            message.textContent = "A communications error occurred.";
          }

          enableInput(true);
        }
      } else if (e.target === registerCancel) {
        name.value = "";
        email1.value = "";
        password1.value = "";
        password2.value = "";
        showLoginRegister();
      }
    }
  });
};

export const showRegister = () => {
  email1.value = null;
  password1.value = null;
  password2.value = null;
  setDiv(registerDiv);
};