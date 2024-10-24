document.addEventListener('DOMContentLoaded', () => {
  // Hive Adoption Tracker
  const progressBar = document.getElementById('progress-bar');
  const hivesAdopted = document.getElementById('hives-adopted');
  let adopted = 45;

  // Update progress bar function
  const updateProgress = () => {
    const percentage = (adopted / 100) * 100;
    progressBar.style.width = `${percentage}%`;
  };

  document.querySelector('.adopt-btn').addEventListener('click', () => {
    if (adopted < 100) {
      adopted++;
      hivesAdopted.textContent = adopted;
      updateProgress();
    }
  });

  updateProgress();

  // Firebase Configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAPc-la1kYUlWFNJ_VL8Q_kDuKXmNCMXrI",
    authDomain: "martins-x.firebaseapp.com",
    databaseURL: "https://martins-x-default-rtdb.firebaseio.com",
    projectId: "martins-x",
    storageBucket: "martins-x.appspot.com",
    messagingSenderId: "472986106817",
    appId: "1:472986106817:web:333360f3dd83c744898d40",
    measurementId: "G-WJNMRKS9TL"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = firebase.firestore();

  // Example function to add hive adoption data to Firestore
  function addAdoptionData(user, hiveCount) {
    db.collection("adoptions").add({
      user: user,
      hiveCount: hiveCount,
      date: new Date()
    })
    .then(() => {
      console.log("Hive adoption data successfully added!");
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }

  // Example function to fetch data and update the progress bar
  function fetchAdoptionData() {
    db.collection("adoptions").get().then((querySnapshot) => {
      let totalHives = 0;
      querySnapshot.forEach((doc) => {
        totalHives += doc.data().hiveCount;
      });

      // Update progress bar based on totalHives value
      const progressBar = document.querySelector('.progress');
      const adoptionGoal = 100; // Example goal for total hives adopted
      const percentage = (totalHives / adoptionGoal) * 100;
      progressBar.style.width = percentage + '%';
    });
  }

  // Call fetchAdoptionData when the page loads
  window.onload = function() {
    fetchAdoptionData();
  };

  // Example function to handle form submission for adopting a hive
  function adoptHive() {
    const userName = document.querySelector("#userName").value;
    const hiveCount = parseInt(document.querySelector("#hiveCount").value);

    if (userName && hiveCount) {
      addAdoptionData(userName, hiveCount);
      fetchAdoptionData(); // Refresh the progress after adding new data
    } else {
      alert("Please fill in both fields.");
    }
  }

  // Create a style element for the overlay
  const style = document.createElement('style');
  style.innerHTML = `
    .hero {
      position: relative; /* Ensure .hero has relative positioning */
    }
    .hero::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(244, 235, 235, 0.595);  
      z-index: 1;
    }
  `;

  // Append the style to the head
  document.head.appendChild(style);
});

document.getElementById('adopt-bee-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const beehiveName = document.getElementById('beehive-name').value;

  // Send the data to the server
  fetch('http://localhost:3000/api/adoptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, beehiveName }),
  })
  .then(response => response.json())
  .then(data => {
    console.log("Adopted Bee Details:", data);
    alert("Thank you for adopting a bee!");
    this.reset(); // Clear the form
  })
  .catch((error) => {
    console.error("Error:", error);
    alert("There was an error adopting the bee. Please try again.");
  });
});

