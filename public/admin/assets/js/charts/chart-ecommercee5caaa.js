"use strict";
let chartData1;
$.get('/admin/loadchart', function (data) {
    console.log(data.totalSales.labels, 'adbedhbsdrfrdxdrrd');
    chartData1 = data;

    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
    drawChart();

    function drawChart() {
        let largeArray = [['price', 'month']];
        chartData1.totalSales.labels.map((obj, index) => {

            let subArray = [];
            subArray.push(chartData1.totalSales.labels[index - 1]);
             subArray.push(chartData1.totalSales.data[index - 1]);
            largeArray.push(subArray);
        });

        var data = google.visualization.arrayToDataTable(largeArray);

        var options = {
            width: '100%', // Set the chart width to 100% of the container
            height: '100%', // Set the chart height to 100% of the container
            curveType: 'function', // or 'none' for straight lines
            legend: { position: 'bottom' },
            backgroundColor: 'transparent',
            pointSize: 0, // Set the size of data points to zero
            pointsVisible: false, // Hide the data points
            hAxis: {
                gridlines: {
                    color: 'transparent' // Set gridline color to transparent
                },
                textPosition: 'none' // Remove x-axis labels
            },
            vAxis: {
                gridlines: {
                    color: 'transparent' // Set gridline color to transparent
                },
                textPosition: 'none' // Remove y-axis labels
            }
        };

        var chart4 = new google.visualization.AreaChart(document.getElementById('curve_chart4'));

        chart4.draw(data, options);
    }
});
