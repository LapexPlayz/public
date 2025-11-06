class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        
        this.currentOperandElement = document.querySelector('.current-operand');
        this.previousOperandElement = document.querySelector('.previous-operand');
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleButtonClick(button);
            });
        });
        
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });
    }
    
    handleButtonClick(button) {
        const action = button.dataset.action;
        
        if (action === 'number') {
            this.appendNumber(button.textContent);
        } else if (action === 'operator') {
            this.chooseOperation(button.dataset.operator);
        } else if (action === 'equals') {
            this.compute();
        } else if (action === 'clear') {
            this.clear();
        } else if (action === 'delete') {
            this.delete();
        } else if (action === 'decimal') {
            this.appendDecimal();
        }
        
        this.updateDisplay();
    }
    
    handleKeyboardInput(e) {
        if (e.key >= '0' && e.key <= '9') {
            this.appendNumber(e.key);
        } else if (e.key === '.') {
            this.appendDecimal();
        } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            this.chooseOperation(e.key);
        } else if (e.key === 'Enter' || e.key === '=') {
            this.compute();
        } else if (e.key === 'Escape') {
            this.clear();
        } else if (e.key === 'Backspace') {
            this.delete();
        }
        
        this.updateDisplay();
    }
    
    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        if (this.currentOperand === '0') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }
    
    appendDecimal() {
        if (this.shouldResetScreen) {
            this.currentOperand = '0';
            this.shouldResetScreen = false;
        }
        
        if (!this.currentOperand.includes('.')) {
            this.currentOperand += '.';
        }
    }
    
    chooseOperation(operator) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operator;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }
    
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.previousOperand = '';
                    this.operation = undefined;
                    this.shouldResetScreen = true;
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        this.currentOperand = this.formatNumber(computation);
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = true;
    }
    
    delete() {
        if (this.currentOperand === 'Error') {
            this.clear();
            return;
        }
        
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }
    
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }
    
    formatNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
    
    updateDisplay() {
        this.currentOperandElement.textContent = this.currentOperand;
        
        if (this.operation != null) {
            this.previousOperandElement.textContent = 
                `${this.formatNumber(parseFloat(this.previousOperand))} ${this.getOperatorSymbol(this.operation)}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
    
    getOperatorSymbol(operator) {
        switch (operator) {
            case '*': return '×';
            case '/': return '÷';
            case '-': return '−';
            case '+': return '+';
            default: return operator;
        }
    }
}

const calculator = new Calculator();