var start;
var refreshId;
var running = false;
var timer_queue = [25, 5, 25, 5, 25, 5, 25, 15]; // Queue for the pomodoro technique

function timerHandler() {
  if(!running) {
    startTimer();
    running = true;
  }
  else {
    endTimer();
    running = false;
  }
}

function startTimer() {
  // Switching button to end timer
  document.getElementById("start-button").innerHTML = "End Timer";
  
  start = Date.now();

  // Setting interval to update the timer
  refreshId = setInterval(updateTimer, 1000);
}

function endTimer() {
  clearInterval(refreshId);

  document.getElementById("timer").innerHTML = null;
  document.getElementById("start-button").innerHTML = "Start Timer";
}

function updateTimer() {
  let timer = document.getElementById("timer");

  let length = 30000; // 25 minutes in milliseconds
  
  let change = length - (Date.now() - start);
  let minutes = Math.floor((change / 1000) / 60);
  let seconds = Math.floor((change / 1000) % 60);

  if(minutes <= 0 && seconds <= 0) {
    endTimer();
  }
  else {
    let output = String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
    timer.innerHTML = output;
  }
}