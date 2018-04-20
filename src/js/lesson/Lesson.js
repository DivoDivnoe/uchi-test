import Model from '../model/Model';
import LessonView from '../view/LessonView';
import showScreen from '../showScreen';

export default class Lesson {
  constructor() {
    this.model = new Model();
    this.screen = new LessonView(this.model.state);

    this.routes = [
      () => this.screen.renderFirstStep(),
      () => this.screen.renderSecondStep(),
      () => this.screen.renderFinal()
    ];
  }

  start() {
    this.screen.answerHandler = () => this.continueLesson();
    showScreen(this.screen.element);
    this.initStep();
  }

  continueLesson() {
    if (this.model.state.complete) {
      console.log('Вы выполнили задание');
      return false;
    }

    this.model.nextStep();
    this.initStep();
  }

  initStep() {
    this.routes[this.model.state.currentStep]();
  }
}
