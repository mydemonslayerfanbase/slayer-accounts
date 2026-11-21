
import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

// Main fanbase website
const MAIN_SITE_URL =
  "https://mydemonslayerfanbase.github.io/-My-Demon-Slayer-Fanbase/";

// Elements
const form = document.querySelector("#auth-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const nameInput = document.querySelector("#display-name");

const loginTab = document.querySelector("#login-tab");
const signupTab = document.querySelector("#signup-tab");

const submitButton = document.querySelector("#submit-button");
const forgotButton = document.querySelector("#forgot-button");
const googleButton = document.querySelector("#google-button");

const statusBox = document.querySelector("#status");
const signedInPanel = document.querySelector("#signed-in");
const userDetails = document.querySelector("#user-details");

const continueButton = document.querySelector("#continue-button");
const signoutButton = document.querySelector("#signout-button");

let mode = "login";

// Display current year
document.querySelector("#year").textContent =
  new Date().getFullYear();

// Status messages
function showStatus(message, success = false) {
  statusBox.textContent = message;
  statusBox.classList.toggle("success", success);
}

// Loading state
function setBusy(busy) {
  submitButton.disabled = busy;
  googleButton.disabled = busy;

  submitButton.textContent = busy
    ? "Please wait..."
    : mode === "login"
      ? "Sign in"
      : "Create account";
}

// Switch login/signup
function setMode(nextMode) {
  mode = nextMode;

  const signup = mode === "signup";

  loginTab.classList.toggle("active", !signup);
  signupTab.classList.toggle("active", signup);

  nameInput.classList.toggle("hidden", !signup);
  document.querySelector("#name-label")
    .classList.toggle("hidden", !signup);

  nameInput.required = signup;

  passwordInput.autocomplete = signup
    ? "new-password"
    : "current-password";

  document.querySelector("#mode-label").textContent =
    signup ? "JOIN THE FANBASE" : "WELCOME BACK";

  document.querySelector("#form-title").textContent =
    signup ? "Create account" : "Sign in";

  document.querySelector("#form-description").textContent =
    signup
      ? "Create your Slayer Accounts login."
      : "Enter your account details to continue.";

  forgotButton.classList.toggle("hidden", signup);

  setBusy(false);
  showStatus("");
}

loginTab.addEventListener("click", () => setMode("login"));
signupTab.addEventListener("click", () => setMode("signup"));

// Email authentication
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  showStatus("");
  setBusy(true);

  try {
    if (mode === "signup") {
      const displayName = nameInput.value.trim();

      if (!displayName) {
        throw new Error("Enter a display name.");
      }

      const credential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      await updateProfile(credential.user, {
        displayName
      });

      showStatus("Account created successfully!", true);

    } else {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      showStatus("Welcome back!", true);
    }

  } catch (error) {
    showStatus(getErrorMessage(error));
  } finally {
    setBusy(false);
  }
});

// Password reset
forgotButton.addEventListener("click", async () => {
  const email = emailInput.value.trim();

  if (!email) {
    showStatus("Enter your email address first.");
    emailInput.focus();
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);

    showStatus(
      "If an account exists, a password reset email will be sent.",
      true
    );

  } catch (error) {
    showStatus(getErrorMessage(error));
  }
});

// Google authentication
googleButton.addEventListener("click", async () => {
  showStatus("");
  setBusy(true);

  try {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account"
    });

    await signInWithPopup(auth, provider);

    showStatus("Google sign-in successful!", true);

  } catch (error) {
    showStatus(getErrorMessage(error));
  } finally {
    setBusy(false);
  }
});

// Authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    signedInPanel.classList.remove("hidden");

    form.classList.add("hidden");
    document.querySelector(".tabs").classList.add("hidden");
    document.querySelector(".separator").classList.add("hidden");
    googleButton.classList.add("hidden");

    userDetails.textContent =
      `${user.displayName || "Slayer"} · ${user.email || ""}`;

    showStatus("You are authenticated.", true);

  } else {
    signedInPanel.classList.add("hidden");

    form.classList.remove("hidden");
    document.querySelector(".tabs").classList.remove("hidden");
    document.querySelector(".separator").classList.remove("hidden");
    googleButton.classList.remove("hidden");
  }
});

// Continue to main website
continueButton.addEventListener("click", () => {
  window.location.assign(MAIN_SITE_URL);
});

// Sign out
signoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    showStatus("Successfully signed out.", true);

  } catch (error) {
    showStatus(getErrorMessage(error));
  }
});

// Firebase error messages
function getErrorMessage(error) {
  const messages = {
    "auth/email-already-in-use":
      "That email is already registered.",

    "auth/invalid-email":
      "Enter a valid email address.",

    "auth/weak-password":
      "Your password must be at least 6 characters.",

    "auth/invalid-credential":
      "Incorrect email or password.",

    "auth/user-disabled":
      "This account has been disabled.",

    "auth/popup-closed-by-user":
      "Google sign-in was cancelled.",

    "auth/unauthorized-domain":
      "This domain is not authorized in Firebase."
  };

  return messages[error.code] ||
    error.message ||
    "Something went wrong. Try again.";
}
