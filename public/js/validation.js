function validationSignup() {
  const username = document.getElementById("username").value;
  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const mobile = document.getElementById("mobile").value;
  const password = document.getElementById("password").value;
  const cpassword = document.getElementById("cpassword").value;

  // clear previous errors
  document.getElementById("username-error").textContent = "";
  document.getElementById("firstname-error").textContent = "";
  document.getElementById("lastname-error").textContent = "";
  document.getElementById("email-error").textContent = "";
  document.getElementById("mobile-error").textContent = "";
  document.getElementById("password-error").textContent = "";
  document.getElementById("cpassword-mismatch").textContent = "";

  let isValid = true;
  const textRegex = /^[a-zA-Z][a-zA-Z0-9\s\,\''\-]*$/;

  if (!username) {
    document.getElementById("username-error").textContent =
      "Username Field is required";
    isValid = false;
  } else if (!textRegex.test(username)) {
    document.getElementById("username-error").textContent =
      "Username should contain only alphabets";
    isValid = false;
  }

  if (!firstname.trim()) {
    document.getElementById("firstname-error").textContent =
      "First name Field is required";
    isValid = false;
  } else if (!textRegex.test(firstname)) {
    document.getElementById("firstname-error").textContent =
      "First name should contain only alphabets";
    isValid = false;
  }

  if (!lastname) {
    document.getElementById("lastname-error").textContent =
      "Last Name Field is required";
    isValid = false;
  } else if (!textRegex.test(firstname)) {
    document.getElementById("lastname-error").textContent =
      "Last name should contain only alphabets";
    isValid = false;
  }

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  if (!email || !emailRegex.test(email)) {
    document.getElementById("email-error").textContent =
      "Please enter a valid email address. (eg: example@gmail.com)";
    isValid = false;
  }

  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobile || !mobileRegex.test(mobile)) {
    document.getElementById("mobile-error").textContent =
      "Mobile number should be a 10-digit valid number";
    isValid = false;
  }

  if (new Set(mobile).size === 1) {
    document.getElementById("mobile-error").textContent =
      "Mobile number should not consist of the same digit.";
    isValid = false;
  }

  const passwordRegex = /^(?=.*[!@#$%^&*]).{6,}$/;
  if (!password || !passwordRegex.test(password)) {
    document.getElementById("password-error").textContent =
      "Password must be at least 6 characters and contain a special character.";
    isValid = false;
  }

  if (password !== cpassword) {
    document.getElementById("cpassword-mismatch").textContent =
      "Passwords do not match. Please try again.";
    isValid = false;
  }

  return isValid;
}
function validationprofile() {
  const username = document.getElementById("username").value;
  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const mobile = document.getElementById("mobile").value;

  // clear previous errors
  document.getElementById("username-error").textContent = "";
  document.getElementById("firstname-error").textContent = "";
  document.getElementById("lastname-error").textContent = "";
  document.getElementById("mobile-error").textContent = "";

  let isValid = true;
  const textRegex = /^[a-zA-Z][a-zA-Z0-9\s\,\''\-]*$/;


  if (!username) {
    document.getElementById("username-error").textContent =
      "Username Field is required";
    isValid = false;
  } else if (!textRegex.test(username)) {
    document.getElementById("username-error").textContent =
      "First name should contain only alphabets";
    isValid = false;
  }

  if (!firstname) {
    document.getElementById("firstname-error").textContent =
      "First name Field is required";
    isValid = false;
  } else if (!textRegex.test(firstname)) {
    document.getElementById("firstname-error").textContent =
      "First name should contain only alphabets";
    isValid = false;
  }

  if (!lastname) {
    document.getElementById("lastname-error").textContent =
      "Last Name Field is required";
    isValid = false;
  } else if (!textRegex.test(lastname)) {
    document.getElementById("lastname-error").textContent =
      "Last name should contain only alphabets";
    isValid = false;
  }

  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobile || !mobileRegex.test(mobile)) {
    document.getElementById("mobile-error").textContent =
      "Mobile number should be a 10-digit valid number";
    isValid = false;
  }

  if (new Set(mobile).size === 1) {
    document.getElementById("mobile-error").textContent =
      "Mobile number should not consist of the same digit.";
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

    document.getElementById("password-error").textContent =
      "Password must be at least 6 characters and contain a special character.";
  }

  if (password !== cpassword) {
    isValid = false;
    document.getElementById("cpassword-mismatch").textContent =
      "Passwords do not match. Please try again.";
  }

  return isValid;
}

function validationChangeEmail() {
  alert("dsfasdf");

  const email = document.getElementById("change-email").value;
  document.getElementById("change-email-error").textContent = "";
  let isValid = true;

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  if (!email || !emailRegex.test(email)) {
    document.getElementById("change-email-error").textContent =
      "Please enter a valid email address. (eg: example@gmail.com)";
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

    document.getElementById("newPassword-error").textContent =
      "Password must be at least 6 characters and contain a special character.";
  }

  if (password !== cpassword) {
    isValid = false;
    document.getElementById("confirmNewPassword-error").textContent =
      "Passwords do not match. Please try again.";
  }

  return isValid;
}

function validateChangePassword() {
  let isValid = true;

  const password = document.getElementById("newPassword").value;
  const confirmNewPassword =
    document.getElementById("confirmNewPassword").value;

  const passwordRegex = /^(?=.*[!@#$%^&*]).{6,}$/;

  if (!password || !passwordRegex.test(password)) {
    showErrorAndRemove(
      "newPassword-error",
      "Password must be at least 6 characters and contain a special character."
    );
  }

  if (password !== confirmNewPassword) {
    isValid = false;
    showErrorAndRemove(
      "confirmNewPassword-error",
      "Passwords do not match. Please try again."
    );
  }
}

function validationAddress() {
  const fullname = document.getElementById("fullname").value;

  const mobile = document.getElementById("mobile").value;
  const address = document.getElementById("address").value;
  const locality = document.getElementById("locality").value;
  const zipcode = document.getElementById("zipcode").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;

  // Clear previous errors
  document.getElementById("fullname-error").textContent = "";
  document.getElementById("mobile-error").textContent = "";
  document.getElementById("address-error").textContent = "";
  document.getElementById("locality-error").textContent = "";
  document.getElementById("zipcode-error").textContent = "";
  document.getElementById("city-error").textContent = "";
  document.getElementById("state-error").textContent = "";

  let isValid = true;
  const textRegex = /^[a-zA-Z][a-zA-Z0-9\s\,\''\-]*$/;


  if (!fullname) {
    document.getElementById("fullname-error").textContent =
      "Fullname field is required";
    isValid = false;
  } else if (!textRegex.test(fullname)) {
    document.getElementById("fullname-error").textContent =
      "Fullname should contain only alphabets";
    isValid = false;
  }

  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobile || !mobileRegex.test(mobile)) {
    document.getElementById("mobile-error").textContent =
      "Mobile number should be a 10-digit valid number";
    isValid = false;
  }

  if (new Set(mobile).size === 1) {
    document.getElementById("mobile-error").textContent =
      "Mobile number should not consist of the same digit.";
    isValid = false;
  }

  if (!address) {
    document.getElementById("address-error").textContent =
      "Address field is required";
    isValid = false;
  } else if (!textRegex.test(address)) {
    document.getElementById("address-error").textContent =
      "Address should contain only alphabets";
    isValid = false;
  }

  if (!locality) {
    document.getElementById("locality-error").textContent =
      "Locality field is required";
    isValid = false;
  } else if (!textRegex.test(locality)) {
    document.getElementById("locality-error").textContent =
      "Locality should contain only alphabets";
    isValid = false;
  }

  const zipcodeRegex = /^\d{6}$/;
  if (!zipcode || !zipcodeRegex.test(zipcode)) {
    document.getElementById("zipcode-error").textContent =
      "Zipcode must be 6 digits.";
    isValid = false;
  }

  if (!city) {
    document.getElementById("city-error").textContent =
      "City field is required";
    isValid = false;
  } else if (!textRegex.test(city)) {
    document.getElementById("city-error").textContent =
      "City should contain only alphabets";
    isValid = false;
  }

  if (!state) {
    document.getElementById("state-error").textContent =
      "State field is required";
    isValid = false;
  }

  return isValid;
}

function validationeditAddress(id) {
  const editfullname = document.getElementById(`editfullname${id}`).value;
  const editmobile = document.getElementById(`editmobile${id}`).value;
  const editaddress = document.getElementById(`editaddress${id}`).value;
  const editlocality = document.getElementById(`editlocality${id}`).value;
  const editzipcode = document.getElementById(`editzipcode${id}`).value;
  const editcity = document.getElementById(`editcity${id}`).value;

  // Clear previous errors
  document.getElementById(`editfullname${id}-error`).textContent = "";
  document.getElementById(`editmobile${id}-error`).textContent = "";
  document.getElementById(`editaddress${id}-error`).textContent = "";
  document.getElementById(`editlocality${id}-error`).textContent = "";
  document.getElementById(`editzipcode${id}-error`).textContent = "";
  document.getElementById(`editcity${id}-error`).textContent = "";

  let isValid = true;
  const textRegex = /^[a-zA-Z][a-zA-Z0-9\s\,\''\-]*$/;


  if (!editfullname) {
    document.getElementById(`editfullname${id}-error`).textContent =
      "Fullname field is required";
    isValid = false;
  } else if (!textRegex.test(editfullname)) {
    document.getElementById(`editfullname${id}-error`).textContent =
      "Fullname should contain only alphabets";
    isValid = false;
  }

  const mobileRegex = /^[6-9]\d{9}$/;
  if (!editmobile || !mobileRegex.test(editmobile)) {
    document.getElementById(`editmobile${id}-error`).textContent =
      "Mobile number should be a 10-digit valid number";
    isValid = false;
  }

  if (new Set(editmobile).size === 1) {
    document.getElementById(`editmobile${id}-error`).textContent =
      "Mobile number should not consist of the same digit.";
    isValid = false;
  }

  if (!editaddress.trim()) {
    document.getElementById(`editaddress${id}-error`).textContent =
      "Address field is required";
    isValid = false;
  } else if (!textRegex.test(editaddress)) {
    document.getElementById(`editaddress${id}-error`).textContent =
      "Address should contain only alphabets";
    isValid = false;
  }

  if (!editlocality) {
    document.getElementById(`editlocality${id}-error`).textContent =
      "Locality field is required";
    isValid = false;
  } else if (!textRegex.test(editlocality)) {
    document.getElementById(`editlocality${id}-error`).textContent =
      "Locality should contain only alphabets";
    isValid = false;
  }

  const zipcodeRegex = /^\d{6}$/;
  if (!editzipcode || !zipcodeRegex.test(editzipcode)) {
    document.getElementById(`editzipcode${id}-error`).textContent =
      "Zipcode must be 6 digits.";
    isValid = false;
  }

  if (!editcity) {
    document.getElementById(`editcity${id}-error`).textContent =
      "City field is required";
    isValid = false;
  } else if (!textRegex.test(editcity)) {
    document.getElementById(`editcity${id}-error`).textContent =
      "City should contain only alphabets";
    isValid = false;
  }

  return isValid;
}


function checkoutForm() {
  // Validate radio button selection for payment type
  

  // Validate radio button selection for address
  const selectedAddress = document.querySelector('input[name="selectedAddress"]:checked');
  if (!selectedAddress) {
    Swal.fire({
      icon: 'warning',
      title: 'Please select an address',
      showConfirmButton: false,
      timer: 1500
    });
    return false; // Stop form submission
  }
  const paymentTypeRadios = document.querySelectorAll('input[name="paymentType"]');
  const selectedPaymentType = Array.from(paymentTypeRadios).find(radio => radio.checked);

  if (!selectedPaymentType) {
    Swal.fire({
      icon: 'warning',
      title: 'Please select a payment type',
      showConfirmButton: false,
      timer: 1500
    });
    return false; // Stop form submission
  }

  // Continue with other form submission logic if needed
  return true;
}
function addresscheckout() {
  // Validate radio button selection for payment type
  

  // Validate radio button selection for address
  const selectedAddress = document.querySelector('input[name="selectedAddress"]:checked');
  if (!selectedAddress) {
    Swal.fire({
      icon: 'warning',
      title: 'Please select an address',
      showConfirmButton: false,
      timer: 1500
    });
    document.getElementById("address-radio-btn").disabled = true;

    return false; // Stop form submission
  }
  document.getElementById("address-radio-btn").disabled = false;
  return true;
}

function paymentcheckout() {
 
  const paymentTypeRadios = document.querySelectorAll('input[name="paymentType"]');
  const selectedPaymentType = Array.from(paymentTypeRadios).find(radio => radio.checked);

  if (!selectedPaymentType) {
    Swal.fire({
      icon: 'warning',
      title: 'Please select a payment type',
      showConfirmButton: false,
      timer: 1500
    });
    document.getElementById("payment-radio-btn").disabled = true;
    
    return false; // Stop form submission
  }
  document.getElementById("payment-radio-btn").disabled = false;

  // Continue with other form submission logic if needed
  return true;
}