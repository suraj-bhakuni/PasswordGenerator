const inputSlider=document.querySelector("[data-lengthslider]");                             //syntax for data attribute []
const lengthDisplay=document.querySelector("[data-lengthnumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
// initial values
let password="";
let passwordLength=10;
let checkCount=0;

handleSlider();
//set strength color to grey
setIndicator("#ccc")

function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    //To set bg color of slider to black
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%";


}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //for shadow effect  
    indicator.style.boxShadow= `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;            //Taking value= false at starting for all 
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value); //navigator.clipboard.writeText it's a method in JS to copy to clipboard adn it will return a Promise
        copyMsg.innerText = "Copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copied text(span) visible
    copyMsg.classList.add("active");             // newClass to be added in stylehseet.

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000); // copied text will be hidden after 2sec
}

//Shuffling the password 
function shufflePassword(array) {
    //Fisher Yates Method- An algorithm used in shuffling. 
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        //Swap number at i index and j index.
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


// count the no. of cheked checkboxes and update the password length and slider.
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

//Event listener on Slider
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)            // we can also use password length >0
        copyContent();
})

generateBtn.addEventListener('click',() => {
    //If none checkboxes are selected
    if(checkCount<=0) return;

    if (passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //Creating a new Password
    console.log("Starting to create password");  //Just used to debug
    //removing old password
    password="";

    let funcArr=[];

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }

    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
        

    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }


    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    //Compulsory Addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("Compulsory Additioon done");

    //Remaining Addition
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining addition done");
    //shuffling the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //Show in UI
    passwordDisplay.value= password;
    console.log("Added to UI");

    //Calculate Strength()
    calcStrength();

})
