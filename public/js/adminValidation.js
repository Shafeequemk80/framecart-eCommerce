function addproduct() {
  // Retrieve form input values
  const productname = document.getElementById("product-title").value;

  const frameshape = document.getElementById("frameshape").value;
  const brand = document.getElementById("brand").value;
  const stock = document.getElementById("stock").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;

  // Clear previous errors
  document.getElementById("product-title-error").textContent = "";
  document.getElementById("frameshape-error").textContent = "";
  document.getElementById("brand-error").textContent = "";
  document.getElementById("stock-error").textContent = "";
  document.getElementById("price-error").textContent = "";
  document.getElementById("description-error").textContent = "";

  let isValid = true;
  const textRegex = /^[a-zA-Z][a-zA-Z0-9\s\,\''\-]*$/;
  if (!productname) {
    document.getElementById("product-title-error").textContent =
      "Product Name is required";
    isValid = false;
  }else if (!textRegex.test(productname)) {
    document.getElementById("product-title-error").textContent =
      "Product Name should contain only alphabets";
    isValid = false;
  }

  // Validate Frame Shape
  if (!frameshape) {
    document.getElementById("frameshape-error").textContent =
      "Select Frame Shape is required";
    isValid = false;
  }

  // Validate Brand
  if (!brand) {
    document.getElementById("brand-error").textContent =
      "Brand Name is required";
    isValid = false;
  }else if (!textRegex.test(brand)) {
    document.getElementById("brand-error").textContent =
      "Brand Name should contain only alphabets";
    isValid = false;
  }

  // Validate Stock using regex
  const stockRegex = /^[1-9]\d*(\.\d+)?$/;
  if (!stock || !stockRegex.test(stock)) {
    document.getElementById("stock-error").textContent =
      "Enter a valid Stock value";
    isValid = false;
  }

  // Validate Price using regex
  const priceRegex = /^[1-9]\d*(\.\d+)?$/;
  if (!price || !priceRegex.test(price)) {
    document.getElementById("price-error").textContent =
      "Enter a valid Price amount";
    isValid = false;
  }

  // Validate Description
  if (!description) {
    document.getElementById("description-error").textContent =
      "Please enter a description";
    isValid = false;
  }else if (!textRegex.test(description)) {
    document.getElementById("description-error").textContent =
      "description should be start contain only alphabets";
    isValid = false;
  }

  return isValid;
}

function editproduct() {

  // Retrieve form input values
  const productname = document.getElementById("product-title").value;

  const frameshape = document.getElementById("frameshape").value;
  const brand = document.getElementById("brand").value;
  const stock = document.getElementById("stock").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;

  // Clear previous errors
  document.getElementById("product-title-error").textContent = "";
  document.getElementById("frameshape-error").textContent = "";
  document.getElementById("brand-error").textContent = "";
  document.getElementById("stock-error").textContent = "";
  document.getElementById("price-error").textContent = "";
  document.getElementById("description-error").textContent = "";

  let isValid = true;
  const textRegex = /^[a-zA-Z][a-zA-Z0-9\s\,\''\-]*$/;
  if (!productname) {
    document.getElementById("product-title-error").textContent =
      "Product Name is required";
    isValid = false;
  }else if (!textRegex.test(productname)) {
    document.getElementById("product-title-error").textContent =
      "Product Name should contain only alphabets";
    isValid = false;
  }

  // Validate Frame Shape
  if (!frameshape) {
    document.getElementById("frameshape-error").textContent =
      "Select Frame Shape is required";
    isValid = false;
  }

  // Validate Brand
  if (!brand) {
    document.getElementById("brand-error").textContent =
      "Brand Name is required";
    isValid = false;
  }else if (!textRegex.test(brand)) {
    document.getElementById("brand-error").textContent =
      "Brand Name should contain only alphabets";
    isValid = false;
  }


  // Validate Stock using regex
  const stockRegex = /^[1-9]\d*(\.\d+)?$/;
  if (!stock || !stockRegex.test(stock)) {
    document.getElementById("stock-error").textContent =
      "Enter a valid Stock value";
    isValid = false;
  }

  // Validate Price using regex
  const priceRegex = /^[1-9]\d*(\.\d+)?$/;
  if (!price || !priceRegex.test(price)) {
    document.getElementById("price-error").textContent =
      "Enter a valid Price amount";
    isValid = false;
  }

  // Validate Description
  if (!description) {
    document.getElementById("description-error").textContent =
      "Please enter a description";
    isValid = false;
  }else if (!textRegex.test(description)) {
    document.getElementById("description-error").textContent =
      "description should be start contain only alphabets";
    isValid = false;
  }


  return isValid;
}



function addOffer() {
    
    const offername = document.getElementById("offername").value;
    const createdAt = document.getElementById("createdAt").value;
    const updatedAt = document.getElementById("updatedAt").value;
    const percentage = document.getElementById("percentage").value;
  
    document.getElementById("offername-error").textContent = "";
    document.getElementById("createdAt-error").textContent = "";
    document.getElementById("updatedAt-error").textContent = "";
    document.getElementById("percentage-error").textContent = "";
  
    let isValid = true;
    const textRegex = /^[a-zA-Z][a-zA-Z0-9\s\,\''\-]*$/;
    if (!offername) {
      document.getElementById("offername-error").textContent =
        "Offer Name is required";
      isValid = false;
    }else if (!textRegex.test(offername)) {
      document.getElementById("offername-error").textContent =
        "Offer Name should contain only alphabets";
      isValid = false;
    }
  
  
    if (!createdAt) {
      document.getElementById("createdAt-error").textContent =
        "Start Date is required";
      isValid = false;
    }
  
    if (!updatedAt) {
      document.getElementById("updatedAt-error").textContent =
        "Expiry Date is required";
      isValid = false;
    }
    if (updatedAt < createdAt) {
      document.getElementById("updatedAt-error").textContent =
        "Should be an expiry date after the start date";
  
      isValid = false;
    }
  
    const percentageRegex = /^(100(\.0{1,2})?|\d{1,2}(\.\d{1,2})?)$/;
  
    if (!percentage || !percentageRegex.test(percentage)) {
      document.getElementById("percentage-error").textContent =
        "Enter a valid Percentage amount";
      isValid = false;
    }
  
    return isValid;
  }
  
  

function editoffer() {
   
    const offername = document.getElementById("offername").value;
    const createdAt = document.getElementById("createdAt").value;
    const updatedAt = document.getElementById("updatedAt").value;
    const percentage = document.getElementById("percentage").value;
  
    document.getElementById("offername-error").textContent = "";
    document.getElementById("createdAt-error").textContent = "";
    document.getElementById("createdAt-error").textContent = "";
    document.getElementById("percentage-error").textContent = "";
  
    let isValid = true;
    const textRegex = /^[a-zA-Z][a-zA-Z0-9\s\,\''\-]*$/;
    if (!offername) {
      document.getElementById("offername-error").textContent =
        "Offer Name is required";
      isValid = false;
    }else if (!textRegex.test(offername)) {
      document.getElementById("offername-error").textContent =
        "Offer Name should contain only alphabets";
      isValid = false;
    }
  
  
    if (!createdAt) {
      document.getElementById("createdAt-error").textContent =
        "Start Date is required";
      isValid = false;
    }
  
    if (!updatedAt) {
      document.getElementById("updatedAt-error").textContent =
        "Expiry Date is required";
      isValid = false;
    }
    if (updatedAt < createdAt) {
      document.getElementById("updatedAt-error").textContent =
        "Should be an expiry date after the start date";
  
      isValid = false;
    }
  
    const percentageRegex = /^(100(\.0{1,2})?|\d{1,2}(\.\d{1,2})?)$/;
  
    if (!percentage || !percentageRegex.test(percentage)) {
      document.getElementById("percentage-error").textContent =
        "Enter a valid Percentage amount";
      isValid = false;
    }
  
    return isValid;
  }
  