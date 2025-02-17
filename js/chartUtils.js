
function makeChart(csvData) {
    var data = d3.csvParse(csvData);


    showSummary(data);

    if (document.getElementById("pop_top").checked == true) {
        data = data.slice(1);
    }

    if (excludecontracts) {
        data = data.filter(function (d) {
            return d.address.startsWith('9');
        });
    }



    if (data.length > 100) {
        data = data.slice(0, 100);
    }

    var addressLabels = data.map(function (d) {
        return d.address;
    });
    var percentageData = data.map(function (d) {
        return d.percentage * 100;
    });
    var decimalDivisor = getDecimal();
    var amountData = data.map(function (d) {
        return d.amount;
    });
    var fullAmt = data.map(function (d) {
        return d.amount;
    });
    var totalSupply = d3.sum(fullAmt);
    var shortLabels = [];
    for (var i = 0; i < addressLabels.length; i++) {
        if (addressLabels[i].length > 51) {
            var shortLabel = addressLabels[i].slice(0, 50) + '...';
            shortLabels.push(shortLabel);
        } else {
            shortLabels.push(addressLabels[i]);
        }
    }
    var ctx = document.getElementById('chart');
    ctx.height = addressLabels.length * 20;
    var chart = new Chart(ctx, {
        type: 'horizontalBar',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            barThickness: 0.9,
            scales: {
                x: {
                    grid: {
                        offset: true
                    }
                },
            },
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                    title: function (t, d) {
                        return addressLabels[t[0].index];
                    },
                    label: function (t, d) {
                        decimalAmount = amountData[t.index] / decimalDivisor;
                        return decimalAmount;
                    },
                    afterLabel: function (t, d) {
                        percent = +(amountData[t.index] * 100 / totalSupply).toFixed(3);
                        var percent_text = "Percent: " + percent + "%";
                        return percent_text;
                    }
                }
            },
            parsing: {
                key: 'nested.value'
            }
        },
        data: {
            labels: shortLabels,
            longLabels: addressLabels,
            datasets: [{
                label: 'Amount',
                data: amountData,
                backgroundColor: '#ff6384'
            }]
        }
    });

    document.getElementById("chart").onclick = function (evt) {
        var activePoints = chart.getElementsAtEvent(evt);
        var firstPoint = activePoints[0];
        var contextUrl = 'https://explorer.ergoplatform.com/en/addresses/' + chart.data.longLabels[firstPoint._index];
        if (firstPoint !== undefined)
            window.open(contextUrl, '_blank');
    }


}
