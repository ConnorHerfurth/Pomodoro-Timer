// Current start time for the timer
let start;
// The ID of the refresh interval
let refreshId;

// Whether the timer has been started
let started = false;
// Whether the timer has been paused
let paused = false;

// The last time the timer was paused
let pausedTime;

// Millisecond offset from pausing.
let offset = 0;

// Queue for the pomodoro technique
let timerQueue;

function startSession() {
  // Resetting Timer Queue to its original state.
  timerQueue = [25, 5, 25, 5, 25, 5, 25, 15];

  // Enabling buttons
  document.getElementById('session-start').disabled = true;
  document.getElementById('start-button').disabled = false;
  document.getElementById('session-end').disabled = false;

  startSessionTracking();

  timerHandler();
}

function endSession() {
  endTimer(false);

  endSessionTracking();

  document.getElementById('session-start').disabled = false;
  document.getElementById('start-button').disabled = true;
  document.getElementById('session-end').disabled = true;
}

function timerHandler() {
  if (!started) {
    startTimer();
    started = true;
  } else {
    if (paused) {
      resumeTimer();
      paused = false;
    } else {
      pauseTimer();
      paused = true;
    }
  }
}

function startTimer() {
  // Switching button to end timer
  document.getElementById('start-button').innerHTML = 'Pause Timer';

  start = Date.now();

  // Setting interval to update the timer
  refreshId = setInterval(updateTimer, 500);
  updateTimer();

  // Sends notifications based off of what the current timer is,
  // which tells us where in the Pomodoro we are.
  switch (timerQueue[0]) {
    case 25:
      new Notification('Time to Work!', {body: 'Let\'s get focused!',
        silent: true});
      playNotificationSound();
      break;
    case 5:
      new Notification('Time for a break!',
          {body: 'You\'ve focused enough, now let\'s take a short break.',
            silent: true});
      playNotificationSound();
      break;
    case 15:
      new Notification('Time for a long break!',
          {body: 'You\'ve gotten a lot done, now relax for a while!',
            silent: true});
      playNotificationSound();
      break;
  }
}

async function playNotificationSound() {
  window.electronAPI.playNotificationSound();
}

async function startSessionTracking() {
  window.electronAPI.startSessionTracking();
}

async function endSessionTracking() {
  window.electronAPI.endSessionTracking();
}

function pauseTimer() {
  document.getElementById('start-button').innerHTML = 'Resume Timer';

  clearInterval(refreshId);

  pausedTime = Date.now();
}

function resumeTimer() {
  offset += pausedTime - Date.now();

  refreshId = setInterval(updateTimer, 500);
  updateTimer();

  document.getElementById('start-button').innerHTML = 'Pause Timer';
}

function endTimer(ongoing) {
  clearInterval(refreshId);

  document.getElementById('timer').innerHTML = null;
  document.getElementById('start-button').innerHTML = 'Pause Timer';

  offset = 0;
  started = false;
  paused = false;

  if (ongoing) {
    // Updating the queue
    const i = timerQueue.shift();
    timerQueue.push(i);

    startTimer();
    started = true;
  }
}

function updateTimer() {
  const timer = document.getElementById('timer');

  const millisecondsOnTimer = timerQueue[0] * 1000 * 60 - offset;

  const change = millisecondsOnTimer - (Date.now() - start);
  const minutes = String(Math.floor((change / 1000) / 60)).padStart(2, '0');
  const seconds = String(Math.floor((change / 1000) % 60)).padStart(2, '0');

  if (minutes <= 0 && seconds <= 0) {
    endTimer(true);
  } else {
    timer.innerHTML = minutes + ':' + seconds;
  }
}
