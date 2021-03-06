/*
Name: Ramanpreet Sidhu
Student ID: 30011040
Tutorial Section: B02
 */

$(document).ready(() => {
    // Set Previous and Current Expression to paragraph and form
    const prevExpression = $(`#previous-expression`);
    const currExpression = $(`#current-expression`);

    // State information
    // CE Button Status
    $('#ce-button').prop('disabled', true);
    // True if last button pressed was "="
    let wasLastButtonEquals = false;
    // True if "safe" to add decimal
    let isSafeToAddDecimal = true;

    // Function button handler
    $('.btn-function').click(event => {
        preEvaluate(event.target);
        $('#ce-button').prop('disabled', false);
        wasLastButtonEquals = false;
        isSafeToAddDecimal = true;
    });

    // Number button handler
    $('.btn-number').click(event => {

        if (wasLastButtonEquals) {
            currExpression.val(event.target.textContent);
            isSafeToAddDecimal = true;
        }
        else {
            preEvaluate(event.target);
        }
        $('#ce-button').prop('disabled', false);
        wasLastButtonEquals = false;
    });

    // Left bracket button
    $(`#left-bracket-button`).click(event => {
        let btnValue = event.target.textContent;
        if (currExpression.val() != "0") {
            if (!wasLastButtonEquals) {
                currExpression.val(currExpression.val() + btnValue);
            }
            else {
                currExpression.val(btnValue);
            }
        }
        else {
            currExpression.val(btnValue);
        }
        isSafeToAddDecimal = true;
        $('#ce-button').prop('disabled', false);
        wasLastButtonEquals = false;
    });

    // Right Bracket Handler
    $(`#right-bracket-button`).click(event => {
        let btnValue = event.target.textContent;
        let bracketCounter = 0;
        if (!isLastCharAFunction()) {
            for (let i = 0; i < currExpression.val().length; i++) {
                if (currExpression.val()[i] == "(") {
                    bracketCounter++;
                }
                else if (currExpression.val()[i] == ")") {
                    bracketCounter--;
                }
            }

            if (bracketCounter > 0) {
                currExpression.val(currExpression.val() + btnValue);
                isSafeToAddDecimal = true;
            }
        }
        else {
            if (currExpression.val() == "-")
            {
                currExpression.val(currExpression.val() + btnValue);
                isSafeToAddDecimal = true;
                $('#ce-button').prop('disabled', false);
                wasLastButtonEquals = false;
            }
        }
    });

    // Decimal button handler
    $(`#decimal-button`).click( event => {
        let btnValue = event.target.textContent;

        if (wasLastButtonEquals) {
            currExpression.val(btnValue);
            $('#ce-button').prop('disabled', false);
            wasLastButtonEquals = false;
            isSafeToAddDecimal = false;
        }

        if (isSafeToAddDecimal) {
            currExpression.val(currExpression.val() + btnValue);
            $('#ce-button').prop('disabled', false);
            wasLastButtonEquals = false;
            isSafeToAddDecimal = false;
        }
    });

    // "Other" Button Handler - AC/CE/=
    $('.btn-other').click(event => {
        let btnId = event.target.id;
        let btnValue = event.target.textContent;
        let oldExpression = currExpression.val();
        let newExpression = "";

        console.log("BUTTON ID: " + btnId + "\nBUTTON VALUE: " + btnValue
            + "\nOLD EXPRESSION: " + oldExpression + "\nNEW EXPRESSION: " + newExpression);

        // Equals Button:
        // Try to evaluate
        // If Error from "eval", catch and print Error
        // If NaN, print Error, and store previous expression in history
        // If Valid, print value and store previous expression in history

        // CE Button:
        // Remove last character of current expression unless just 0

        // AC Button:
        // Clear current expression
        switch (btnId) {
            case `equals-button`:
                if (isLastCharAFunction()) {
                    break;
                }
                try {
                    addClosingBrackets();

                    console.log("Current Expression Before Eval: " + currExpression.val());

                    newExpression = evaluate(currExpression.val());

                    if (!wasLastButtonEquals) {
                        prevExpression.text(currExpression.val() + btnValue);
                        $('#ce-button').prop('disabled', true);
                        wasLastButtonEquals = true;
                    }
                    if (isNaN(newExpression)) {
                        currExpression.val("Error");
                        wasLastButtonEquals = true;
                        $('#ce-button').prop('disabled', true);
                    }
                    else {
                        currExpression.val(newExpression);
                        wasLastButtonEquals = true;
                    }
                } catch (error) {
                    console.log("Expression Evaluation Error: " + error.message);
                    currExpression.val("Error");
                    $('#ce-button').prop('disabled', true);
                    wasLastButtonEquals = true;
                }
                break;
            case `ce-button`:
                if (currExpression.val().length != 1) {
                    if (currExpression.val()[currExpression.val().length -1] == ".") {
                        isSafeToAddDecimal = true;
                    }
                    currExpression.val(currExpression.val().slice(0, -1));
                }
                else {
                    currExpression.val("0");
                    $('#ce-button').prop('disabled', true);
                    isSafeToAddDecimal = true;
                }
                break;
            case `ac-button`:
                currExpression.val("0");
                $('#ce-button').prop('disabled', true);
                isSafeToAddDecimal = true;
                break;
        }

        console.log("BUTTON ID: " + btnId + "\nBUTTON VALUE: " + btnValue
            + "\nOLD EXPRESSION: " + oldExpression + "\nNEW EXPRESSION: " + newExpression);
    });

    function preEvaluate(eventTarget) {
        let btnValue = eventTarget.textContent;
        let btnClass = eventTarget.className;
        let lastValue = currExpression.val()[currExpression.val().length -1];

        console.log("Button Value: " + btnValue);
        console.log("Button Class: " + btnClass);

        // If last char was function, and current is function, replace last char with new
        if(btnClass.includes("btn-function"))
        {
            if(currExpression.val() == "Error") {
                currExpression.val("0" + btnValue);
                return;
            }

            if (currExpression.val() == "Infinity" || currExpression.val() == "-Infinity") {
                currExpression.val(currExpression.val() + btnValue);
                return;
            }

            if (currExpression.val() == "0") {
                if (btnValue == "-")
                {
                    currExpression.val(btnValue);
                }
                else {
                    currExpression.val(currExpression.val() + btnValue);
                }
            }

            if (isLastCharAFunction()) {
                if (currExpression.val()[currExpression.val().length - 1] != "-" && btnValue == "-")
                {
                    currExpression.val(currExpression.val() + btnValue);
                }
                else {
                    currExpression.val(currExpression.val().slice(0, -1) + btnValue);
                }

                return;
            }
        }
        else {
            if (currExpression.val() == "0" || currExpression.val() == "Infinity" ||
                currExpression.val() == "-Infinity" || currExpression.val() == "Error")
            {
                currExpression.val(btnValue);
                isSafeToAddDecimal = true;
                return;
            }

            // If last char was ")" and current is number, add * (then number later)
            if(lastValue == ")") {
                currExpression.val(currExpression.val() + "*");
                isSafeToAddDecimal = true;
            }
        }

        currExpression.val(currExpression.val() + btnValue);
        wasLastButtonEquals = false;
    }

    function isLastCharAFunction() {
        let lastValue = currExpression.val()[currExpression.val().length -1];
        return (lastValue == "+" || lastValue == "-" || lastValue == "*" || lastValue == "/");
    }

    function addClosingBrackets() {
        let bracketCounter = 0;
        let currExpressionStr = currExpression.val();
        let appendBrackets = "";

        for (let i = 0; i < currExpressionStr.length; i++) {
            if (currExpressionStr[i] == "(") {
                bracketCounter++;
            }
            else if (currExpressionStr[i] == ")") {
                bracketCounter--;
            }
        }

        console.log("(Unclosed) Bracket Counter: " + bracketCounter);

        for (let j = 0; j < bracketCounter; j++)
        {
            appendBrackets += ")";
        }

        currExpression.val(currExpressionStr + appendBrackets);
    }

    function evaluate(expression) {
        return eval(expression.replace(/(\d)\.?\(/g, '$1*('));
    }
})
