import * as notiflix from 'notiflix/build/notiflix-notify-aio';

const form = document.querySelector('.form');
const delayInput = form.querySelector('input[name="delay"]');
const stepInput = form.querySelector('input[name="step"]');
const amountInput = form.querySelector('input[name="amount"]');

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;
    setTimeout(() => {
      const result = { position, delay };
      if (shouldResolve) {
        resolve(result);
      } else {
        reject(result);
      }
    }, delay);
  });
}

form.addEventListener('submit', async e => {
  e.preventDefault();

  const initialDelay = parseInt(delayInput.value);
  const step = parseInt(stepInput.value);
  const amount = parseInt(amountInput.value);

  if (isNaN(initialDelay) || isNaN(step) || isNaN(amount)) {
    notiflix.Notify.failure(
      'Будь ласка, введіть коректні значення для всіх полів.'
    );
    return;
  }

  for (let i = 1; i <= amount; i++) {
    try {
      const result = await createPromise(i, initialDelay + (i - 1) * step);
      notiflix.Notify.success(
        `✅ Fulfilled promise ${result.position} in ${result.delay}ms`
      );
    } catch (error) {
      notiflix.Notify.failure(
        `❌ Rejected promise ${error.position} in ${error.delay}ms`
      );
    }
  }
});
