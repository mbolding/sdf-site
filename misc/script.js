document.addEventListener('DOMContentLoaded', function () {
    const trigFunctionSelect = document.getElementById('trig-function');
    const plotDiv = document.getElementById('plot');
    let currentFunction = trigFunctionSelect.value;

    function plotTrigFunction(functionName) {
        let xValues = [];
        let yValues = [];

        for (let x = -1 * Math.PI; x <=  1 * Math.PI; x += 0.01) {
            xValues.push(x);
            yValues.push(eval(functionName)(x));
        }

        let trace = {
            x: xValues,
            y: yValues,
            //mode: 'lines',
			mode: 'markers',
            name: functionName//,
            //line: { shape: 'linear' }
        };

        let layout = {
            title: 'Plot of ' + functionName + '(x)',
            xaxis: { title: 'x' },
            yaxis: { title: functionName + '(x)' }
        };

        Plotly.newPlot(plotDiv, [trace], layout);
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
