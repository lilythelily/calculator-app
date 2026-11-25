'use strict';

// theme-toggle

const themeSwitche = document.querySelector('.theme-switch');
const html = document.querySelector('html');
const switchBtns = document.querySelectorAll('.button-theme');

function hideSwitch(item1, item2, item3){
  item1.classList.remove("opacity");
  item2.classList.add("opacity");
  item3.classList.add("opacity");
}

function toggleTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

themeSwitche.addEventListener('click', (e)=>{
  switchBtns.forEach((btn)=>{
    btn.classList.add("opacity");
  })
  if(e.target.classList.contains('button-1')){
     html.dataset.theme = "middle";
     hideSwitch(switchBtns[0], switchBtns[1], switchBtns[2]);
  }else if(e.target.classList.contains('button-2')){
    html.dataset.theme = "light";
     hideSwitch(switchBtns[1], switchBtns[0]  , switchBtns[2]);
  }else if(e.target.classList.contains('button-3')){
    html.dataset.theme = "dark";
     hideSwitch(switchBtns[2], switchBtns[1], switchBtns[0]);
  }
})

// --- restore saved theme ---

// const themeMap = {
//   'button-1': { theme: 'middle', index: 0 },
//   'button-2': { theme: 'light', index: 1 },
//   'button-3': { theme: 'dark', index: 2 },
// };

// const savedTheme = localStorage.getItem('theme');
// if (savedTheme) {
//   html.dataset.theme = savedTheme;
//   const matchedEntry = Object.values(themeMap).find((entry) => entry.theme === savedTheme);
//   if (matchedEntry && switchBtns[matchedEntry.index]) {
//     setActiveSwitch(switchBtns[matchedEntry.index]);
//   }
// }

// --- calculation ---

// --- reset ---

const result = document.querySelector('.result-container');
const resetBtn = document.querySelector('.reset-button');

function clearActiveOperators() {
  calculator?.querySelectorAll('.isActive').forEach((btn) => btn.classList.remove('isActive'));
}

function reset(){
  result.innerHTML = '0';
  delete calculator.dataset.firstValue;
  delete calculator.dataset.operator;
  delete calculator.dataset.previousKeyType;
  clearActiveOperators();
}

resetBtn.addEventListener('click', reset);

// --- calculation ---

const calculator = document.querySelector('.keypad-container');

function calculate(n1, operator, n2){
  const num1 = parseFloat(n1);
  const num2 = parseFloat(n2);

if(Number.isNaN(num1) || Number.isNaN(num2)) return '0';

switch (operator) {
  case 'add':
  return String(num1 + num2);
  case 'subtract':
  return String(num1 - num2);
  case 'multiply':
  return String(num1 * num2);
  case 'divide':
    return num2 === 0 ? "Error" : String(num1/num2);
    default:
    return String(num2);
}
}

calculator.addEventListener('click', (e) => {
  const key = e.target.closest('button');
  if (!key || !calculator.contains(key)) return;

  const value = key.value;
  const action = key.dataset.action;
  const resultNumber = result.textContent;
  const previousKeyType = calculator.dataset.previousKeyType;
  const { firstValue, operator } = calculator.dataset;

  // Number key
  if (!action) {
    if (resultNumber === '0' || previousKeyType === 'operator' || previousKeyType === 'calculate') {
      result.textContent = value;
    } else {
      result.textContent = resultNumber + value;
    }
    clearActiveOperators();
    calculator.dataset.previousKeyType = 'number';
    return;
  }

  // Decimal key
  if (action === 'decimal') {
    if (previousKeyType === 'operator' || previousKeyType === 'calculate') {
      result.textContent = '0.';
    } else if (!resultNumber.includes('.')) {
      result.textContent = `${resultNumber}.`;
    }
    clearActiveOperators();
    calculator.dataset.previousKeyType = 'decimal';
    return;
  }

  // Delete key

  if(action === "delete"){
    if(
      previousKeyType === "operator" ||
      previousKeyType === "calculate"
    ){
      result.textContent = '0';
    }else{
      const trimmed = resultNumber.slice(0, -1);
      result.textContent = trimmed === '' || trimmed === '' ? '0' : trimmed;
    }calculator.dataset.previousKeyType = "delete";
    return;
  }

  // Operator keys
  if (
    action === 'add' ||
    action === 'subtract' ||
    action === 'multiply' ||
    action === 'divide'
  ) {
    if (firstValue && operator && previousKeyType !== 'operator' && previousKeyType !== 'calculate') {
      const intermediate = calculate(firstValue, operator, resultNumber);
      result.textContent = intermediate;
      calculator.dataset.firstValue = intermediate;
    } else {
      calculator.dataset.firstValue = resultNumber;
    }

    clearActiveOperators();
    key.classList.add('isActive');
    calculator.dataset.operator = action;
    calculator.dataset.previousKeyType = 'operator';
    return;
  }

  // Equals / calculate key
  if (action === 'calculate') {
    if (firstValue && operator) {
      const secondValue = previousKeyType === 'operator' ? firstValue : resultNumber;
      const computed = calculate(firstValue, operator, secondValue);
      result.textContent = computed;
      delete calculator.dataset.firstValue;
      delete calculator.dataset.operator;
    }
    clearActiveOperators();
    calculator.dataset.previousKeyType = 'calculate';
  }
});
