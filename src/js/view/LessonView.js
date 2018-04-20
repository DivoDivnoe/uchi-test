import AbstractView from './AbstractView';
import {findRadius, findArcLength, findArcHeight} from '../utils';
import {START_X, END_X} from '../config';

export default class LessonView extends AbstractView {
  constructor(state, axisLength) {
    super();
    this.state = state;
    this.axisLength = axisLength;
    this.arcs = {
      alpha: 120,
      width: 2,
      items: []
    };
  }

  get template() {
    const items = [];
    const interval = this.axisLength / (END_X - START_X + 1);
    let arcOffsetLeft = 0;

    for (let i = START_X; i <= END_X; i++) {
      items.push(i);
    }

    const drawAxisDash = item => `
      <div 
        class="axis__dash ${!(item % 5)
          ? 'axis__dash--bold'
          : ''}" style="left: ${interval * item}px">
        <span 
        class="axis__number ${!(item % 5) ? 'axis__number--bold' : ''}"
          >${item}</span>
      </div>
    `;

    const drawSvg = (chordLength, index, offset = 0) => {
      const radius = findRadius(chordLength, this.arcs.alpha);
      const arcLength = findArcLength(radius, this.arcs.alpha);
      const circleLength = findArcLength(radius, 360);

      const arcCenterCoord = radius + this.arcs.width / 2;
      const svgDimension = (radius + this.arcs.width / 2) * 2 + 2;
      const svgLeft = -(svgDimension - chordLength) / 2 + offset;
      const svgTop = -findArcHeight(radius, chordLength, this.arcs.width);

      this.arcs.items.push({arcLength, circleLength});

      return `
        <div class="axis__arcs-wrapper axis__arcs-wrapper--${index}" style="left:${svgLeft}px;top:${svgTop}px">
          <svg 
            class="axis__arcs" 
            width="${svgDimension}" 
            height="${svgDimension}" 
            viewPort="0 0 ${svgDimension} ${svgDimension}" 
            version="1.1" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <marker id="arrowhead" markerWidth="5" markerHeight="3" refX="0" refY="1.5" orient="auto" stroke="#ff0000">
                <polygon points="0 0, 5 1.5, 0 3" fill="#ff0000"/>
              </marker>
            </defs>
            <circle 
              class="axis__arc axis__arc--first"
              r="${radius}"
              cx="${arcCenterCoord}"
              cy="${arcCenterCoord}"
              fill="transparent"
              stroke-width="${this.arcs.width}"
            ></circle>
            <circle
              class="axis__arc axis__arc--second"
              r="${radius}"
              cx="${arcCenterCoord}"
              cy="${arcCenterCoord}"
              fill="transparent"
              stroke-width="${this.arcs.width}"
              stroke-dasharray="0.001 ${circleLength}"
            ></circle>
            <line 
              class="axis__arc-arrow"
              x1="${svgDimension - 2}" 
              y1="${svgDimension / 2 - 1}" 
              x2="${svgDimension - 2}" 
              y2="${svgDimension / 2 + 0.001 - 1}" 
              stroke="#ff0000" stroke-width="2" 
              marker-end="url(#arrowhead)"
            >
          </svg>
          <input class="axis__input" type="text">
        </div>
      `;
    };

    return `
      <header class="task__header">
        <h2 class="task__title">
          <span 
            class="task__title-item task__title-item--first"
          >${this.state.firstSummand}</span> + <span 
            class="task__title-item task__title-item--second"
          >${this.state.secondSummand}</span> = <input 
            class="task__title-sum task__title-sum--disabled" 
            value="?" 
            disabled
          >
        </h2>
      </header>
      <div class="axis-wrapper">
        <div class="axis" style="width: ${this.axisLength}px">
          ${items.map(drawAxisDash).join('')}
          ${[this.state.firstSummand, this.state.secondSummand]
            .map((item, i) => {
              const currentOffset = arcOffsetLeft;
              const chordLength = interval * item;

              arcOffsetLeft += chordLength;

              return drawSvg(chordLength, i, currentOffset);
            })
            .join('')}
        </div>
      </div>
    `;
  }

  renderFirstStep() {
    const arcWrapper = this.element.querySelector('.axis__arcs-wrapper--0');
    const firstSummand = this.element.querySelector('.task__title-item--first');

    this.renderLessonStep(arcWrapper, this.state.firstSummand, firstSummand);
  }

  renderSecondStep() {
    const arcWrapper = this.element.querySelector('.axis__arcs-wrapper--1');
    const secondSummand = this.element.querySelector(
      '.task__title-item--second'
    );

    this.renderLessonStep(arcWrapper, this.state.secondSummand, secondSummand);
  }

  renderFinal() {
    const sum = this.element.querySelector('.task__title-sum');

    sum.classList.remove('task__title-sum--disabled');
    sum.disabled = false;
    sum.value = '';

    this.initInput(sum, this.state.sum, 'task__title-sum');
  }

  renderLessonStep(arcWrapper, stateItem, questionItem) {
    const input = arcWrapper.querySelector('.axis__input');
    arcWrapper.classList.add('axis__arcs-wrapper--active');

    const transitionendHandler = () => {
      this.initInput(
        input,
        stateItem,
        'axis__input',
        questionItem,
        'task__title-item'
      )
    };

    setTimeout(() => this.animateArc(arcWrapper, transitionendHandler), 0);
  }

  animateArc(arcWrapper, transitionendHandler) {
    const currentArc = this.arcs.items[this.state.currentStep];
    const renderedArc = arcWrapper.querySelector('.axis__arc--second');

    renderedArc.style.strokeDasharray = `${currentArc.arcLength} ${currentArc.circleLength - currentArc.arcLength}`;
    arcWrapper.querySelector('.axis__arc-arrow').classList.add('axis__arc-arrow--animate');

    renderedArc.addEventListener('transitionend', transitionendHandler);
  }

  initInput(
    answerInput,
    answer,
    answerInputClassName,
    questionItem,
    questionItemClassName
  ) {
    const inputHandler = evt => {
      const target = evt.target;

      if (+target.value === answer) {
        if (questionItem) {
          this.removeClass(questionItem, `${questionItemClassName}--wrong`);
        }
        this.removeClass(target, `${answerInputClassName}--wrong`);

        this.disableInput(
          target,
          `${answerInputClassName}--disabled`,
          inputHandler
        );

        this.answerHandler();
      } else {
        if (questionItem) {
          this.addClass(questionItem, `${questionItemClassName}--wrong`);
        }
        this.addClass(target, `${answerInputClassName}--wrong`);
      }
    };

    answerInput.addEventListener('input', inputHandler);
    answerInput.classList.add('axis__input--active');
    answerInput.focus();
  }

  disableInput(input, className, inputHandler) {
    input.classList.add(className);
    input.disabled = true;
    input.removeEventListener('input', inputHandler);
  }

  removeClass(element, className) {
    if (element.classList.contains(className)) {
      element.classList.remove(className);
    }
  }

  addClass(element, className) {
    if (!element.classList.contains(className)) {
      element.classList.add(className);
    }
  }

  answerHandler() {}
}
