import Model from './model/Model';
import Lesson from './lesson/Lesson';

const initLesson = (model) => {
  const sreenWidth = document.body.clientWidth;
  const axisLength = sreenWidth > 900 ? 815 : (sreenWidth < 550 ? 300 : 480);

  const lesson = new Lesson(model, axisLength);
  
  lesson.start();
}

document.addEventListener('DOMContentLoaded', () => {
  const model = new Model();
  
  initLesson(model);

  window.addEventListener('resize', () => initLesson(model));
});
