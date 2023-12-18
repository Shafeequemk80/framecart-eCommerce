function addproduct() {


    // Retrieve form input values
    const productname = document.getElementById("product-title").value;
   
    const frameshape = document.getElementById("frameshape").value;
    const brand = document.getElementById("brand").value;
    const stock = document.getElementById("stock").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
   
    // Clear previous errors
    document.getElementById("product-title-error").textContent = '';
    document.getElementById("frameshape-error").textContent = '';
    document.getElementById("brand-error").textContent = '';
    document.getElementById("stock-error").textContent = '';
    document.getElementById("price-error").textContent = '';
    document.getElementById("description-error").textContent = '';
  
    let isValid = true;
   
    if (!productname) {
      
        document.getElementById("product-title-error").textContent = "Product Name is required";
        isValid = false;
    }

    // Validate Frame Shape
    if (!frameshape) {
        document.getElementById("frameshape-error").textContent = "Select Frame Shape is required";
        isValid = false;
    }

    // Validate Brand
    if (!brand) {
        document.getElementById("brand-error").textContent = "Brand Name is required";
        isValid = false;
    }

    // Validate Stock using regex
    const stockRegex = /^[1-9]\d*(\.\d+)?$/;
    if (!stock || !stockRegex.test(stock)) {
        document.getElementById("stock-error").textContent = 'Enter a valid Stock value';
        isValid = false;
    }

    // Validate Price using regex
    const priceRegex = /^[1-9]\d*(\.\d+)?$/;
    if (!price || !priceRegex.test(price)) {
        document.getElementById("price-error").textContent = 'Enter a valid Price amount';
        isValid = false;
    }
    
    // Validate Description
    if (!description) {
        document.getElementById("description-error").textContent = 'Please enter a description';
        isValid = false;
    }
   
    return isValid;
}


function editproduct() {

    alert("sdfbgfd")
    // Retrieve form input values
    const productname = document.getElementById("product-title").value;
   
    const frameshape = document.getElementById("frameshape").value;
    const brand = document.getElementById("brand").value;
    const stock = document.getElementById("stock").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
   
    // Clear previous errors
    document.getElementById("product-title-error").textContent = '';
    document.getElementById("frameshape-error").textContent = '';
    document.getElementById("brand-error").textContent = '';
    document.getElementById("stock-error").textContent = '';
    document.getElementById("price-error").textContent = '';
    document.getElementById("description-error").textContent = '';
  
    let isValid = true;
   
    if (!productname) {
      
        document.getElementById("product-title-error").textContent = "Product Name is required";
        isValid = false;
    }

    // Validate Frame Shape
    if (!frameshape) {
        document.getElementById("frameshape-error").textContent = "Select Frame Shape is required";
        isValid = false;
    }

    // Validate Brand
    if (!brand) {
        document.getElementById("brand-error").textContent = "Brand Name is required";
        isValid = false;
    }

    // Validate Stock using regex
    const stockRegex = /^[1-9]\d*(\.\d+)?$/;
    if (!stock || !stockRegex.test(stock)) {
        document.getElementById("stock-error").textContent = 'Enter a valid Stock value';
        isValid = false;
    }

    // Validate Price using regex
    const priceRegex = /^[1-9]\d*(\.\d+)?$/;
    if (!price || !priceRegex.test(price)) {
        document.getElementById("price-error").textContent = 'Enter a valid Price amount';
        isValid = false;
    }
    
    // Validate Description
    if (!description) {
        document.getElementById("description-error").textContent = 'Please enter a description';
        isValid = false;
    }
   
    return isValid;
}
