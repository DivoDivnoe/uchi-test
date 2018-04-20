import {
  FIRST_SUMMAND_START,
  FIRST_SUMMAND_END,
  SUM_START,
  SUM_END
} from '../config.js';

export default class Model {
  constructor() {
    this.initState();
  }

  get initialState() {
    const firstSummand = Math.floor(
      (FIRST_SUMMAND_END - FIRST_SUMMAND_START + 1) * Math.random() +
        FIRST_SUMMAND_START
    );
    const sum = Math.floor(
      (SUM_END - SUM_START + 1) * Math.random() + SUM_START
    );

    return {
      firstSummand,
      sum,
      secondSummand: sum - firstSummand,
      steps: 3,
      currentStep: 0,
      complete: false
    };
  }

  get firstSummand() {
    return this.state.firstSummand;
  }

  get secondSummand() {
    return this.state.secondSummand;
  }

  get sum() {
    return this.state.sum;
  }

  initState() {
    this.state = this.initialState;

    return this.state;
  }

  nextStep() {
    if (++this.state.currentStep === this.state.steps - 1) {
      this.state.complete = true;
    }
  }
}
