import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  showSnackBar = (res , status) => {
      console.log(res);
     const el =  document.querySelectorAll<HTMLElement>('#snackbar')[0];
     el.classList.remove("valid" , "hasError");
     if(status === 'Success'){
      el.classList.add('valid');
      el.innerHTML = `<span  class="feather-check-circle" ></span> ${res.message}`
    } else if(status === 'customSuccess'){
      el.classList.add('valid');
    el.innerHTML = `<span  class="feather-check-circle" ></span> ${res}`

    }  else if('customError') {
      el.classList.add('hasError');
      el.innerHTML = `<span  class="feather-alert-circle" ></span> ${res.error.message}`

    } else {
      el.classList.add('hasError');
       el.innerHTML = `<span  class="feather-alert-circle" ></span> ${res.error.message}`
    }
    el.classList.add('show');
    setTimeout(function(){ el.className = el.className.replace("show", ""); }, 2500);
    el.className.replace("valid , hasError", "");
   }
  showCartMessage = (res , status) => {
    const el =  document.querySelectorAll<HTMLElement>('#snackbar')[0];
    if(status === 'Success'){
      console.log(res)
     el.classList.add('valid');
     el.innerHTML = `<span  class="feather-check-circle" ></span> ${res}`
    } else {
     el.classList.add('hasError');
     el.innerHTML = `<span  class="feather-alert-circle" ></span> ${res}`
   }
   el.classList.add('show');
   setTimeout(function(){ el.className = el.className.replace("show", ""); }, 2500);
 }

  showPreloader() {
    const el =  document.querySelectorAll<HTMLElement>('#loader')[0];
    el.classList.add('show');
   }
  hidePreloader () { 
    const el =  document.querySelectorAll<HTMLElement>('#loader')[0];
     setTimeout(function(){ el.className = el.className.replace("show", ""); }, 1000);
  }
  refresh(): void {
    window.location.reload();
  }

  checkStrength = (p) => {
    // 1
    let force = 0;
  
    // 2
    const regex = /[$-/:-?{-~!"^_@`\[\]]/g;
    const lowerLetters = /[a-z]+/.test(p);
    const upperLetters = /[A-Z]+/.test(p);
    const numbers = /[0-9]+/.test(p);
    const symbols = regex.test(p);
  
    // 3
    const flags = [lowerLetters, upperLetters, numbers, symbols];
  
    // 4
    let passedMatches = 0;
    for (const flag of flags) {
      passedMatches += flag === true ? 1 : 0;
    }
  
    // 5
    force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
    force += passedMatches * 10;
  
    // 6
    force = (p.length <= 6) ? Math.min(force, 10) : force;
  
    // 7
    force = (passedMatches === 1) ? Math.min(force, 10) : force;
    force = (passedMatches === 2) ? Math.min(force, 20) : force;
    force = (passedMatches === 3) ? Math.min(force, 30) : force;
    force = (passedMatches === 4) ? Math.min(force, 40) : force;
    console.log(force)
    return force;
  }
}
