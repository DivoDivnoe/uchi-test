const container = document.querySelector('.app');

const showScreen = element => {
  container.innerHTML = '';
  container.appendChild(element);
};

export default showScreen;
