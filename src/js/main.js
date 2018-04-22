import Model from './model/Model';
import Lesson from './lesson/Lesson';

const AxisLength = {
  LARGE_SCREEN_AXIS_LENGTH: 815,
  MEDIUM_SCREEN_AXIS_LENGTH: 480,
  SMALL_SCREEN_AXIS_LENGTH: 300
};

const initLesson = model => {
  const screenWidth = document.body.clientWidth;
  const axisLength =
    screenWidth > 900
      ? AxisLength.LARGE_SCREEN_AXIS_LENGTH
      : screenWidth < 550
        ? AxisLength.SMALL_SCREEN_AXIS_LENGTH
        : AxisLength.MEDIUM_SCREEN_AXIS_LENGTH;

  new Lesson(model, axisLength).start();

  return screenWidth;
};

document.addEventListener('DOMContentLoaded', () => {
  const model = new Model();

  let screenWidth = initLesson(model);

  window.addEventListener('resize', evt => {
    const currentScreenWidth = document.body.clientWidth;

    if (currentScreenWidth === screenWidth) return false;

    screenWidth = initLesson(model);
  });
});
