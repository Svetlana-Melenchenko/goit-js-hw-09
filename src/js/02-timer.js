import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Report } from 'notiflix/build/notiflix-report-aio';

const DELAY = 1000;

document.body.style.color = 'black';

let selectedDate = null;
let currentDate = null;
let intervalId = null;

const datatimeInput = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');

const dataDays = document.querySelector('[data-days]');
const dataHours = document.querySelector('[data-hours]');
const dataMinutes = document.querySelector('[data-minutes]');
const dataSeconds = document.querySelector('[data-seconds]');

startBtn.addEventListener('click', onStartTimer);
startBtn.disabled = true;

const authors = ['User123', 'Guest007', 'JohnDoe'];
const greetings = ['МОЇ ВІТАННЯ', 'ПРИВІТ', 'HELLO'];
const styles = ['info', 'success', 'failure'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomAuthor() {
  return getRandomItem(authors);
}

function getRandomGreeting() {
  return getRandomItem(greetings);
}

function getRandomStyle() {
  return getRandomItem(styles);
}

function generateRandomMessage() {
  const author = getRandomAuthor();
  const greeting = getRandomGreeting();
  const style = getRandomStyle();

  Report[style](author, `${greeting} ${author}`, 'Ok');
}

generateRandomMessage();

flatpickr(datatimeInput, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0].getTime() < Date.now()) {
      const author = getRandomAuthor();
      Report.failure(author, 'ОБЕРІТЬ БУДЬ ЛАСКА БУДЬ-ЯКУ МАЙБУТНЮ ДАТУ', 'Ok');
    } else {
      selectedDate = selectedDates[0].getTime();
      startBtn.disabled = false;
      const author = getRandomAuthor();
      Report.success(
        author,
        'ДЛЯ ТОГО, ЩОБ ЗАПУСТИТИ ТАЙМЕР НАТИСНІТЬ КНОПКУ START',
        'Ok'
      );
    }
  },
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = addLeadingZero(Math.floor(ms / day));
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function onStartTimer() {
  timer.start();
}

const timer = {
  start() {
    intervalId = setInterval(() => {
      currentDate = Date.now();
      const timeDifference = selectedDate - currentDate;
      updateTimer(convertMs(timeDifference));
      startBtn.disabled = true;
      datatimeInput.disabled = true;

      if (timeDifference <= 1000) {
        this.stop();
        const author = getRandomAuthor();
        Report.info(
          author,
          'ТАЙМЕР ЗУПИНИВСЯ! ДЛЯ ТОГО, ЩОБ ЗАПУСТИТИ ТАЙМЕР НАТИСНІТЬ КНОПКУ START АБО ПЕРЕЗАВАНТАЖТЕ СТОРІНКУ',
          'Ok'
        );
      }
    }, DELAY);
  },

  stop() {
    startBtn.disabled = true;
    datatimeInput.disabled = false;
    clearInterval(intervalId);
    return;
  },
};

function updateTimer({ days, hours, minutes, seconds }) {
  dataDays.textContent = `${days}`;
  dataHours.textContent = `${hours}`;
  dataMinutes.textContent = `${minutes}`;
  dataSeconds.textContent = `${seconds}`;
}
