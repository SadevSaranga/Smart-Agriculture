// Firebase Configuration
const firebaseConfig = {
  databaseURL: "https://smart-agriculture-system-fe7c6-default-rtdb.firebaseio.com"
};

// Initialize Firebase (if not already initialized)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Get reference to database
const database = firebase.database();

// Moisture threshold update handler
function updateValues() {
  const moisture = parseInt(document.getElementById("moisture").value);
  const productID = document.getElementById("product_ID").value.trim();

  if (!productID || isNaN(moisture)) {
    alert("Please enter both Product ID and valid moisture value.");
    return;
  }

  // Store Product ID locally
  localStorage.setItem('productID', productID);

  // Update threshold in Firebase
  updateMoistureThreshold(productID, moisture);

  // Delay redirect slightly to ensure data is written
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 800);
}

// Function to update moisture threshold in Firebase
function updateMoistureThreshold(productID, threshold) {
  const thresholdRef = database.ref('settings/threshold_' + productID);

  thresholdRef
    .set(threshold)
    .then(() => {
      console.log(`Threshold for ${productID} updated successfully to ${threshold}!`);
    })
    .catch((error) => {
      console.error("Error updating threshold:", error);
      alert("Error updating threshold. Check console for details.");
    });
}
