import { GAME_CONDITION } from '../constants/condition.js';
import { SELECTOR } from '../constants/selector.js';

import gameSetting from '../model/GameSetting.js';
import Car from '../model/Car.js';

import { generateRandomNumber } from '../utils/index.js';
import { $ } from '../utils/dom.js';

import {
  hideGamePlay,
  removeAllSpinners,
  showCarNames,
  showGamePlay,
  showMoving,
} from '../view/playGame.js';
import { showWinners, showGameResult, hideGameResult } from '../view/gameResult.js';
import {
  enableCarNamesForm,
  enableTrialCountForm,
  hideTrialCountForm,
  resetCarNamesForm,
  resetTrialCountForm,
} from '../view/gameSettingForm.js';

const isMovable = () => {
  const { MIN_RANDOM_NUMBER, MAX_RANDOM_NUMBER, MOVABLE_MIN_NUMBER } = GAME_CONDITION;
  const randomNumber = generateRandomNumber(MIN_RANDOM_NUMBER, MAX_RANDOM_NUMBER);

  return randomNumber >= MOVABLE_MIN_NUMBER;
};

const updateCarMoving = (car) => {
  if (isMovable()) {
    car.move();
    showMoving(car);
  }
};

const raceOneTurn = (cars) => {
  cars.forEach((car) => updateCarMoving(car));
};

const getWinners = (cars) => {
  const distanceByCar = cars.map((car) => car.getDistance());
  const maxDistance = Math.max(...distanceByCar);
  const winners = [];

  distanceByCar.forEach((distance, idx) => {
    if (distance === maxDistance) {
      winners.push(cars[idx].getName());
    }
  });

  return winners;
};

const celebrateWinners = (winners) => {
  setTimeout(() => {
    alert(`${winners.join(', ')} 축하합니다!`);
  }, GAME_CONDITION.CELEBRATE_TIME);
};

const restartGame = () => {
  clearTimeout(celebrateWinners);

  resetCarNamesForm();
  enableCarNamesForm();

  resetTrialCountForm();
  enableTrialCountForm();
  hideTrialCountForm();

  hideGamePlay();
  hideGameResult();
};

export const startGame = () => {
  const carNames = gameSetting.getNames();
  const trialCount = gameSetting.getTrialCount();
  const { TURN_INTERVAL_TIME } = GAME_CONDITION;

  const cars = carNames.map((carName) => new Car(carName));

  showGamePlay();
  showCarNames(cars);

  let currentCount = 0;

  const intervalTimer = setInterval(() => {
    raceOneTurn(cars);

    currentCount += 1;

    if (currentCount === trialCount) {
      clearInterval(intervalTimer);
      removeAllSpinners();

      const winners = getWinners(cars);

      showGameResult();
      showWinners(winners);
      celebrateWinners(winners);

      $(SELECTOR.RESTART_GAME_BTN).addEventListener('click', restartGame);
    }
  }, TURN_INTERVAL_TIME);
};
