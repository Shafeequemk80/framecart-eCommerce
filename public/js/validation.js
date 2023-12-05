function validationSignup() {
 
    const username = document.getElementById("username").value;
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    const password = document.getElementById("password").value;
    const cpassword = document.getElementById("cpassword").value;

    // clear previous errors
    document.getElementById("username-error").textContent = '';
    document.getElementById("firstname-error").textContent = '';
    document.getElementById("lastname-error").textContent = '';
    document.getElementById("email-error").textContent = '';
    document.getElementById("mobile-error").textContent = '';
    document.getElementById("password-error").textContent = '';
    document.getElementById("cpassword-mismatch").textContent = '';

    let isValid = true;

    if (!username) {
        document.getElementById("username-error").textContent = "Username Field is required";
        isValid = false;
    }

    if (!firstname) {
        document.getElementById("firstname-error").textContent = "First name Field is required";
        isValid = false;
    }

    if (!lastname) {
        document.getElementById("lastname-error").textContent = "Last Name Field is required";
        isValid = false;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    if (!email || !emailRegex.test(email)) {
        document.getElementById("email-error").textContent = 'Please enter a valid email address. (eg: example@gmail.com)';
        isValid = false;
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobile || !mobileRegex.test(mobile)) {
        document.getElementById("mobile-error").textContent = 'Mobile number should be a 10-digit valid number';
        isValid = false;
    }
    
    if (new Set(mobile).size === 1) {
        document.getElementById("mobile-error").textContent = 'Mobile number should not consist of the same digit.';
        isValid = false;
    }

    const passwordRegex = /^(?=.*[!@#$%^&*]).{6,}$/;
    if (!password || !passwordRegex.test(password)) {
        document.getElementById("password-error").textContent = 'Password must be at least 6 characters and contain a special character.';
        isValid = false;
    }

    if (password !== cpassword) {
        document.getElementById("cpassword-mismatch").textContent = 'Passwords do not match. Please try again.';
        isValid = false;
    }

    return isValid;
}

function validateresetpasword() {
    const password = document.getElementById("password-reset").value;
    const cpassword = document.getElementById("cpassword").value;

    let isValid = true;

    const passwordRegex = /^(?=.*[!@#$%^&*]).{6,}$/;

    if (!password || !passwordRegex.test(password)) {
        isValid = false;
        
        document.getElementById("password-error").textContent = 'Password must be at least 6 characters and contain a special character.';
    }

    if (password !== cpassword) {
        isValid = false;
        document.getElementById("cpassword-mismatch").textContent = 'Passwords do not match. Please try again.';
    }

    return isValid;
}


function validationChangeEmail() {
    alert("dsfasdf")
  
    const email = document.getElementById("change-email").value;
    document.getElementById("change-email-error").textContent = '';
    let isValid = true;
   
  

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    if (!email || !emailRegex.test(email)) {
   
        document.getElementById("change-email-error").textContent = 'Please enter a valid email address. (eg: example@gmail.com)';
        isValid = false;
    }


  
    return isValid;
}

function validatechangepassword() {
    const password = document.getElementById("newPassword").value;
    const cpassword = document.getElementById("confirmNewPassword").value;

    let isValid = true;

    const passwordRegex = /^(?=.*[!@#$%^&*]).{6,}$/;

    if (!password || !passwordRegex.test(password)) {
        isValid = false;
        
        document.getElementById("newPassword-error").textContent = 'Password must be at least 6 characters and contain a special character.';
    }

    if (password !== cpassword) {
        isValid = false;
        document.getElementById("confirmNewPassword-error").textContent = 'Passwords do not match. Please try again.';
    }

    return isValid;
}




function validateChangePassword() {
    let isValid = true;
  
    const password = document.getElementById("newPassword").value;
    const confirmNewPassword = document.getElementById("confirmNewPassword").value;
  
    const passwordRegex = /^(?=.*[!@#$%^&*]).{6,}$/;
  
    if (!password || !passwordRegex.test(password)) {
    
      showErrorAndRemove("newPassword-error", 'Password must be at least 6 characters and contain a special character.');
    }
  
    if (password !== confirmNewPassword) {
      isValid = false;  showErrorAndRemove("confirmNewPassword-error", 'Passwords do not match. Please try again.');
    }
  
   
  }