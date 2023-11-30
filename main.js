const expression = document.getElementById('expression');
const result = document.getElementById('result');
const buttons = document.querySelectorAll('button');
const error = document.getElementById('error');

const operatorIds = ['add', 'subtract', 'multiply', 'divide', 'power'];
const operators = ['+', '-', '×', '÷', '^'];
const mathFuncs = ['sqrt', 'sin', 'cos', 'tan', 'square'];
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

error.style.visibility = 'hidden';
for (let button of buttons) {
    button.addEventListener('click', onButtonClick);
}

function onButtonClick(e) {
    if (error.style.visibility === 'visible') {
        error.style.visibility = 'hidden';
        handleC();
    }

    const button = e.target;
    const id = button.id;
    if (id === 'c') {
        handleC();
        return;
    } else if (numbers.includes(id)) {
        handleNumber(button);
        return;
    } else if (id === 'decimal') {
        handleDecimal();
        return;
    } else if (id === 'sign') {
        handleSign();
        return;
    } else if (operatorIds.includes(id)) {
        handleOperator(button);
        return;
    } else if (id === 'equals') {
        handleEquals();
        return;
    } else if (mathFuncs.includes(id)) {
        handleMathFunc(button);
        return;
    }
}

function handleC() {
    setExpression('');
    setResult(0);
}

function handleNumber(button) {
    const id = button.id;
    if (result.innerText === '0' && id === '0') {
        return;
    } else if (result.innerText === '0') {
        setResult(id);
        return;
    }
    setResult(result.innerText + id);
}

function handleDecimal() {
    if (result.innerText.includes('.')) {
        return;
    }
    setResult(result.innerText + '.');
}

function handleSign() {
    if (result.innerText === '0') {
        return;
    }
    setResult(result.innerText * -1);
}

function handleOperator(button) {
    let operator = button.innerText;
    if (operator === 'x^y') {
        operator = '^';
    }

    if (expression.innerText.slice(-1) === ')') {
        setExpression(expression.innerText + " " + operator)
        return;
    }

    if (expression.innerText === '') {
        setExpression(result.innerText + ' ' + operator);
        setResult(0);
        return;
    } else if (expression.innerText.includes('=')) {
        setExpression(result.innerText + ' ' + operator);
        setResult(0);
        return;
    }
    setExpression(expression.innerText + ' ' + result.innerText + ' ' + operator);
    setResult(0);
}

function handleEquals() {
    if (expression.innerText.includes('=')) {
        setExpression(result.innerText + ' =');
        setResult(0);
        return;
    }

    if (operators.includes(expression.innerText.slice(-1))) {
        setExpression(expression.innerText + ' ' + result.innerText + ' =');
    } else if (expression.innerText.slice(-1) !== ')') {
        setExpression(expression.innerText + ' ' + result.innerText + ' =');
    }

    try {
        const square = num => num * num; // used by eval to calculate square
        const expr = expression.innerText.replace('×', '*').replace('÷', '/')
        .replace('=', '').replace('^', '**').replace('sqrt', 'Math.sqrt').replace('sin', 'Math.sin')
        .replace('cos', 'Math.cos').replace('tan', 'Math.tan');
        console.log(expr);
        res = eval(expr);
        validateResult(res);
        setResult(res);
    } catch (e) {
        handleError(e.message);
    }
}

function handleMathFunc(button) {
    setExpression(button.id + '(' + result.innerText + ')');
    setResult(0);
}

function validateResult(value) {
    if (Number.isNaN(value)) {
        throw new Error('Invalid expression');
    } else if (!Number.isFinite(value)) {
        throw new Error('Divide by zero');
    }
}

function setResult(value) {
    const str = value.toString();
    const maxResultLength = 19;
    if (str.length > maxResultLength) {
        value = str.substring(0, maxResultLength);
    }
    result.innerText = value;
}

function setExpression(value) {
    const str = value.toString();
    const maxExpressionLength = 75;
    if (str.length > maxExpressionLength) {
        value = str.substring(str.length - maxExpressionLength, str.length);
    }
    expression.innerText = value;
}

function handleError(message) {
    error.innerText = `Error: ${message}.\nPress any button to reset`
    error.style.visibility = 'visible';
}
