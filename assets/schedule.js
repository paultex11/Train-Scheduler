//Needs to pull up train times using firebase
//Somehow get actual train times and display thier arrival in real time


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDggxZYI-R9l9FPAncQfXh5_46pBmJHrqw",
    authDomain: "train-scheduler-7bb1d.firebaseapp.com",
    databaseURL: "https://train-scheduler-7bb1d.firebaseio.com",
    projectId: "train-scheduler-7bb1d",
    storageBucket: "train-scheduler-7bb1d.appspot.com",
    messagingSenderId: "57585790914"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// Setup global varibles
var trainName = "";
var destination = "";
var firstTrain = "";
var frequency = "";
var nextArrival = "";
var minAway = "";

  
//When the submit button is pushed
$("#add-Train").on('click', function(event) {
  
  event.preventDefault();
  
  //This grabs these values in this format when information is pushed 
  trainName = $("#trainNameInput").val().trim();
  destination = $("#destinationInput").val().trim();
  firstTrain = moment($("#firstTrainInput").val().trim(), "HH:mm Military Time").format("LT");
  frequency = $("#frequencyInput").val().trim();

  // Makes sure all inputs have a value beore submitting to table
  if (trainName === ""){
    alert("Enter train name");
    return false;
  }
  if (destination === ""){
    alert("Enter destination");
    return false;
  }
  if (firstTrain === ""){
    alert("Enter first train time");
    return false;
  }
  if (frequency === ""){
    alert("Enter a frequency");
    return false;
  }

  //Create a var to keep track of current time and control its format
  var currentTime = moment().format("HH:mm");

  //Create a var that does the math between 
  //Subtract the first train time back a year to make sure it's before current time.
  var firstTrianConversion = moment().subtract(firstTrain, "minutes");


  // % = Modulus (Remainder)
  var remainder = firstTrianConversion % frequency;

  //Time math to get minuites until the next train
  var minUntilTrain = frequency - remainder; 
  var nextTrain = moment().add(minUntilTrain, "minutes").format("HH:mm");

  //Keep track of all vars to make sure they are being read correctly
  console.log(trainName);
  console.log(destination);
  console.log(firstTrain);
  console.log(frequency);  
  console.log(currentTime);
  console.log(firstTrianConversion);
  console.log(remainder);
  console.log(minUntilTrain);
  console.log(nextTrain);


//push info to firebase
  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency,
    currentTime: currentTime,
    nextArrival: nextTrain,
    minAway: minUntilTrain,
    
    });

});

//Needed to make input in military time
function checkTime() {
  var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test($("#startTime").val());
  if (isValid) {
      $("#startTime").addClass("bg-success")
      setTimeout(function () {
          $("#startTime").removeClass("bg-success")
      }, 2000);
  } else {
      $("#startTime").addClass("bg-danger");
      setTimeout(function () {
          $("#startTime").removeClass("bg-danger")
      }, 750);
  }
  return isValid;
};

// Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
database.ref().on("child_added", function(snapshot){

  //Create var to shorthand snapshot value
  var sv = snapshot.val();

  //Track that all informatin is being read correctly
  console.log(sv.trainName);
  console.log(sv.destination);
  console.log(sv.firstTrain);
  console.log(sv.frequency);
  console.log(sv.firstTrain);
  console.log(sv.minAway);
 
  $("#train-table").append("<tr class='train-info-row'>" + 
  "<td class='train-info-name'>" + sv.trainName + "</td>" +
  "<td class='train-info-destination'>" + sv.destination + "</td>" + 
  "<td class='train-info-frequency'>" + sv.frequency + " min" + "</td>" + 
  "<td class='train-info-next'>" + sv.nextArrival + "</td>" + 
  "<td class='train-info-away'>" + sv.minAway +"</td>" + "</tr>");

  //Lets you know that error has occured and what it is if firebase call messes up
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});