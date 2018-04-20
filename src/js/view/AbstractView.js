export default class AstractView {
  get template() {
    throw new Error('You have to define template');
  }

  get element() {
    if (!this._element) {
      this._element = this._render();
    }

    return this._element;
  }

  _render() {
    const div = document.createElement('div');
    div.classList.add('app-wrapper');
    div.innerHTML = this.template;

    return div;
  }
}
