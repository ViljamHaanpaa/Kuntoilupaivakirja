// Function to start the timer
export const startTimer = (setTimer, setTimerId, pausedTime, setIsPaused) => {
  console.log("Timer resumed");
  const startTime = Date.now() - pausedTime;
  const id = setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");
    setTimer(`${formattedMinutes}:${formattedSeconds}`);
  }, 1000);

  setTimerId(id);
  setIsPaused(false);
};

// Function to stop and reset the timer
export const stopTimer = (setTimer, setTimerId, timerId) => {
  if (timerId) {
    clearInterval(timerId);
    setTimerId(null);
  }
  setTimer(0);
};

// Function to pause the timer
export const pauseTimer = (
  setTimerId,
  setPausedTime,
  setIsPaused,
  timer,
  timerId
) => {
  console.log("Paused");

  if (timerId) {
    clearInterval(timerId);
    setTimerId(null);
    if (timer === 0) {
      console.log(
        "Timer hasnt started yet, this is safe mode to not crash the app cos there is no : in the timer string"
      ); // :DD
      setIsPaused(true);
      return;
    }
    const [minutes, seconds] = timer.split(":");
    const pausedTime = (minutes * 60 + seconds) * 1000;

    setPausedTime(pausedTime);
    setIsPaused(true);
  }
};
