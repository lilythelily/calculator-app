'use strict';

// theme-toggle

const themeSwitche = document.querySelector('.theme-switch');

themeSwitche.addEventListener('click', (e)=>{
  if(e.target.classList.contains('button-1')){
    console.log('button01');
  }else if(e.target.classList.contains('button-2')){
    console.log('button2');
  }else{
    console.log('button3');
  }
})

const toggleTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};