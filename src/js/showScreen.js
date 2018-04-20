const container = document.querySelector('.app');

const showScreen = element => {
  console.log(element);
  container.innerHTML = '';
  container.appendChild(element);
};

export default showScreen;
