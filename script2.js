document.addEventListener('DOMContentLoaded', function () {
    const trigFunctionSelect = document.getElementById('trig-function');
    const plotDiv = document.getElementById('plot');
    let currentFunction = trigFunctionSelect.value;

function plotTrigFunction(functionName) {
    let xValues = [];
    let yValues = [];

    const minStep = 0.01; // Minimum step size
    const maxStep = 0.1; // Maximum step size
    const tolerance = 0.1; // Tolerance for slope

    const functionDerivative = getFunctionDerivative(functionName);
    
    for (let x = -2 * Math.PI; x <= 2 * Math.PI;) {
        let slope = Math.abs(functionDerivative(x));
        let stepSize = mapValues(slope, 0, tolerance, maxStep, minStep);
        stepSize = Math.min(stepSize, maxStep);

        xValues.push(x);
        yValues.push(eval(functionName)(x));

        x += stepSize;
    }

    let trace = {
        x: xValues,
        y: yValues,
        mode: 'lines',
        name: functionName//,
        //line: { shape: 'spline' }
    };

    let layout = {
        title: 'Plot of ' + functionName + '(x)',
        xaxis: { title: 'x' },
        yaxis: { title: functionName + '(x)' }
    };

    Plotly.newPlot(plotDiv, [trace], layout);
}

function getFunctionDerivative(functionName) {
    switch (functionName) {
        case 'sin':
            return Math.cos;
        case 'cos':
            return (x) => -Math.sin(x);
        case 'tan':
            return (x) => 1 / Math.pow(Math.cos(x), 2);
        default:
            throw new Error('Invalid function name');
    }
}

function mapValues(value, valueMin, valueMax, targetMin, targetMax) {
    return (value - valueMin) * (targetMax - targetMin) / (valueMax - valueMin) + targetMin;
}	

    function eval(functionName) {
        switch (functionName) {
            case 'sin':
                return Math.sin;
            case 'cos':
                return Math.cos;
            case 'tan':
                return function (x) {
                    return Math.sin(x) / Math.cos(x);
                };
            default:
                throw new Error('Invalid function name');
        }
    }

    trigFunctionSelect.addEventListener('change', function () {
        currentFunction = this.value;
        plotTrigFunction(currentFunction);
    });

    plotTrigFunction(currentFunction);
});
