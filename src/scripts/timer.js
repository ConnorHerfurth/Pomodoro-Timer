let start;
let refreshId;
let running = false;
// Queue for the pomodoro technique
const timerQueue = [25, 5, 25, 5, 25, 5, 25, 15];

function timerHandler() {
  if (!running) {
    startTimer();
    running = true;
  } else {
    endTimer();
    running = false;
  }
}

function startTimer() {
  // Switching button to end timer
  document.getElementById('start-button').innerHTML = 'End Timer';

  start = Date.now();

  // Setting interval to update the timer
  refreshId = setInterval(updateTimer, 500);
  updateTimer();
}

function endTimer() {
  clearInterval(refreshId);

  document.getElementById('timer').innerHTML = null;
  document.getElementById('start-button').innerHTML = 'Start Timer';
}

function updateTimer() {
  const timer = document.getElementById('timer');

  const length = 30000; // 25 minutes in milliseconds

  const change = length - (Date.now() - start);
  const minutes = String(Math.floor((change / 1000) / 60)).padStart(2, '0');
  const seconds = String(Math.floor((change / 1000) % 60)).padStart(2, '0');

  if (minutes <= 0 && seconds <= 0) {
    endTimer();
  } else {
    timer.innerHTML = minutes + ':' + seconds;
  }
}
