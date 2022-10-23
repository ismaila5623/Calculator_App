let btns = document.querySelectorAll('.btn')
let screen = document.querySelector('.screen')

function isDigit(value) {
    return !isNaN(value);
}
class Calculator {
    constructor(value) {
        this.value = value;
        let j = 0;
        for (let i = 0; i < this.value.length; i++) {
            if (isDigit(this.value[i])) {
                if (i == 0) {
                    this.tempDigits = new Stack(parseInt(this.value[i]));
                } else {
                    this.tempDigits.push(parseInt(this.value[i]))
                }
            } else {
                j++;
                if (j == 1) {
                    this.tempOps = new Stack(this.value[i]);
                } else {
                    this.tempOps.push(this.value[i])
                }
            }
        }
    }
    execute() {
        while (!this.tempOps.isEmpty()) {
            if (this.hasPrecidence(this.tempOps.getCurrentValue())) {
                this.tempDigits.moveToFirst()
                this.tempOps.moveToFirst()
                let num1 = this.tempDigits.head.value;
                let op = this.tempOps.head.value;
                this.value = this.calculate(num1, this.tempDigits.getCurrentNextValue(), op)
                this.tempDigits.updateCurrentNextValue(this.value)
                this.tempDigits.pop()
                this.tempOps.pop()
            }
            this.tempDigits.moveNext()
            this.tempOps.moveNext()
            if (this.tempOps.length == 1) {
                this.tempDigits.resetCurrent()
                this.tempOps.resetCurrent()
            }
        }
        return this.value;
    }
    calculate(num1, num2, op) {
        let value = 0;
        switch (op) {
            case "+":
                value = this.add(num1, num2)
                break;
            case "-":
                value = this.subtract(num1, num2)
                break;
            case "*":
                value = this.multiply(num1, num2)
                break;
            case "/":
                value = this.divide(num1, num2)
                break;
            default:
                console.log('invalid operator')
                break;
        }
        return value;
    }
    add(num1, num2) {
        return num1 + num2;
    }
    subtract(num1, num2) {
        return num1 - num2;
    }
    multiply(num1, num2) {
        return num1 * num2;
    }
    divide(num1, num2) {
        return num1 / num2;
    }
    hasPrecidence(op) {
        if (op == '/') {
            return true;
        } else if (op == '*') {
            if (this.tempOps.hasValue('/')) {
                return false;
            }
            return true;
        } else if (op == '+') {
            if (this.tempOps.hasValue('/') || this.tempOps.hasValue('*')) {
                return false
            }
            return true;
        } else {
            if (this.tempOps.hasValue('/') || this.tempOps.hasValue('*') || this.tempOps.hasValue('+')) {
                return false;
            }
            return true;
        }
    }
    isDigit(value) {
        return !isNaN(value);
    }
}


class Stack {
    constructor(value) {
        this.head = new Node(value)
        this.head.next = null;
        this.currentIndx = 0;
        this.length = 1;
    }
    push(value) {
        if (this.isEmpty()) {
            this.currentIndx = 0;
        }
        let node = new Node(value);
        node.next = this.head;
        this.head = node;
        this.length++;
    }
    pop() {
        if (!this.isEmpty()) {
            let node = this.head;
            this.head = this.head.next;
            if (this.getCurrentNode() == this.head) {
                this.currentInx = 0;
            }
            if (this.hasReachEnd()) {
                this.currentIndx--;
            }
            this.length--;
            return node.value;
        } else {
            this.currentIndx = -1;
        }
    }
    moveToFirst() {
        let node = this.head;
        let count = 0;
        while (count < this.currentIndx) {
            let nxt = node.next;
            let nxtValue = nxt.value;
            nxt.value = this.head.value;
            this.head.value = nxtValue;

            node = node.next;
            count++;
        }
    }
    hasValue(value) {
        let node = this.head;
        while (node != null) {
            if (node.value == value) {
                return true;
            }
            node = node.next;
        }
        return false;
    }
    moveNext() {
        if (this.isEmpty()) {
            this.currentIndx = -1;
        } else if (this.hasReachEnd()) {
            this.resetCurrent()
        } else {
            this.currentIndx++;
        }
    }
    resetCurrent() {
        if (this.isEmpty()) {
            this.currentIndx = -1;
        } else {
            this.currentIndx = 0;
        }
    }
    hasReachEnd() {
        return this.currentIndx >= this.length - 1;
    }
    isEmpty() {
        return this.length == 0;
    }
    list() {
        let n = this.head;
        while (n != null) {
            console.log(n.value)
            n = n.next
        }
    }
    getCurrentNode() {
        if (!this.isEmpty()) {
            let count = 0;
            let node = this.head;
            while (count <= this.currentIndx) {
                if (count == this.currentIndx) {
                    return node;
                }
                node = node.next;
                count++;
            }
        } else {
            return null;
        }
    }
    getCurrentValue() {
        if (this.getCurrentNode() == null) {
            return -1;
        }
        return this.getCurrentNode().value;
    }
    getCurrentNextNode() {
        if (!this.isEmpty()) {
            let count = 0;
            let node = this.head;
            while (node != null) {
                if (count == this.currentIndx + 1) {
                    return node;
                }
                node = node.next;
                count++;
            }
        } else {
            return null;
        }
    }
    updateCurrentNextValue(value) {
        this.getCurrentNextNode().value = value;
    }
    getCurrentNextValue() {
        if (!this.isEmpty()) {
            let count = 0;
            let node = this.head;
            while (node != null) {
                if (count == this.currentIndx + 1) {
                    return node.value;
                }
                node = node.next;
                count++;
            }
        } else {
            return null;
        }
    }
}

class Node {
    constructor(value) {
        this.value = value;
    }
}

btns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        value = e.target.dataset.value.trim();
        if (isOperator(value) && isOperator(screen.value[screen.value.length - 1])) {} else {
            if (value != '=') {
                screen.value += e.target.dataset.value;
            }
            if (value == 'cls') {
                screen.value = ''
            }
            if (value == '=') {
                if (invalidEntry(screen.value)) {
                    screen.value = ''
                    screen.setAttribute('placeholder', 'invalid entry')
                } else {
                    let val = formatValue(screen.value)
                    if (val.length > 1) {
                        let cal = new Calculator(val)
                        screen.value = cal.execute()
                    }
                }
            }
        }
    })
})

function invalidEntry(value) {
    if (isOperator(value[value.length - 1]) || isOperator(value[0])) {
        return true
    } else {
        return false;
    }
}

function isOperator(op) {
    if (op == '+' || op == '-' || op == '*' || op == '/') {
        return true;
    } else {
        return false;
    }
}

function formatValue(value) {
    let i = 0;
    let j = i + 1;
    let arr = []
    while (i < value.length) {
        if (!isNaN(value[j])) {
            j++;
        } else {
            let val = ''
            for (let k = i; k < j; k++) {
                if (isNaN(value[k])) {
                    arr.push(value[k])
                } else {
                    val += value[k]
                }
            }
            arr.push(val)
            i = j;
            j++;
        }
    }
    return arr.reverse();
}