"use strict";
const num1Element = document.getElementById("num1");
const num2Element = document.getElementById("num2");
const btn = document.querySelector("button");
function adds(num1, num2) {
    if (typeof num1 === 'number' && typeof num2 === 'number') {
        return num1 + num2;
    }
    else if (typeof num1 === 'string' && typeof num2 === 'string') {
        return num1 + " " + num2;
    }
    return +num1 + +num2;
}
console.log(adds(1, 2));
btn.addEventListener('click', () => {
    const num1 = num1Element.value;
    const num2 = num2Element.value;
    const result = adds(+num1, +num2);
    console.log(result);
});
// console.log(adds('1', '2'));
