
  const isStrongPassword = (password) => {
    // Use a regular expression to check for a strong password:
    // At least 8 characters, including at least one lowercase letter, one uppercase letter, one number, and one special character.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
  };

  document.getElementById("registration-form").addEventListener("submit", function (event) {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");

    // Email validation
    if (!emailInput.checkValidity()) {
      emailError.textContent = "Please enter a valid email address.";
      event.preventDefault();
    } else {
      emailError.textContent = "";
    }

    // Password validation
    if (!isStrongPassword(passwordInput.value)) {
      passwordError.textContent = "Password must be at least 8 characters and include lowercase, uppercase, numbers, and special characters.";
      event.preventDefault();
    } else {
      passwordError.textContent = "";
    }
  });



  