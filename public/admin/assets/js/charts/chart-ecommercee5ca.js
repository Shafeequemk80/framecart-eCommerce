"use strict";
var totalSalesData;
  // Example URL to fetch data from (replace with your actual URL)
const apiUrl = '/admin/dashboard';

// Perform a GET request using the Fetch API
async function api (){
 let data =  await fetch(apiUrl)
  .then(response => {
    // Check if the request was successful (status code 200 OK)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response body as JSON
    return response.json();
  })
  .then(data => {
    totalSalesData=data.totalSales
  
})
let json = await data.json()

totalSalesData=json
// /----------------------------------

}
 


async function chart (NioApp, $,toal) {
  api()
  console.log(toal,'toal');
  
  let Sales = [];
  for (let index = 1; index <= 30; index++) {
    Sales.push(index + " feb");
  }
  let number = [];
  for (let index = 1; index <= 30; index++) {
    number.push(Math.ceil(index*2/10));
  }
  const dataElement = document.getElementById('data');
const dataString = dataElement.value;
const parsedData = JSON.parse(dataString);

console.log(parsedData);

    var totalSales = {
        labels: parsedData.totalSales.labels,
        dataUnit: "Sales",
        lineTension: 0.3,
        datasets: [
          {
            label: "Sales",
            color: "#9d72ff",
            background: NioApp.hexRGB("#9d72ff", 0.25),
            data: parsedData.totalSales.data,
          },
        ],
      },
      totalOrders = {
        labels: parsedData.totalSales.labels,
        dataUnit: "Orders",
        lineTension: 0.3,
        datasets: [
          {
            label: "Orders",
            color: "#7de1f8",
            background: NioApp.hexRGB("#7de1f8", 0.25),
            data: parsedData.dailyOrderCounts,
          },
        ],
      },
      totalCustomers = {
        labels: Sales,
        dataUnit: "Customers",
        lineTension: 0.3,
        datasets: [
          {
            label: "Customers",
            color: "#83bcff",
            background: NioApp.hexRGB("#83bcff", 0.25),
            data: number,
          },
        ],
      };
    function ecommerceLineS1(selector, set_data) {
      var $selector = $(selector || ".ecommerce-line-chart-s1");
      $selector.each(function () {
        for (
          var $self = $(this),
            _self_id = $self.attr("id"),
            _get_data = void 0 === set_data ? eval(_self_id) : set_data,
            selectCanvas = document.getElementById(_self_id).getContext("2d"),
            chart_data = [],
            i = 0;
          i < _get_data.datasets.length;
          i++
        )
          chart_data.push({
            label: _get_data.datasets[i].label,
            tension: _get_data.lineTension,
            backgroundColor: _get_data.datasets[i].background,
            fill: !0,
            borderWidth: 2,
            borderColor: _get_data.datasets[i].color,
            pointBorderColor: "transparent",
            pointBackgroundColor: "transparent",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: _get_data.datasets[i].color,
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 4,
            data: _get_data.datasets[i].data,
          });
        var chart = new Chart(selectCanvas, {
          type: "line",
          data: { labels: _get_data.labels, datasets: chart_data },
          options: {
            plugins: {
              legend: {
                display: _get_data.legend || !1,
                rtl: NioApp.State.isRTL,
                labels: { boxWidth: 12, padding: 20, color: "#6783b8" },
              },
              tooltip: {
                enabled: !0,
                rtl: NioApp.State.isRTL,
                callbacks: {
                  label: function (a) {
                    return ""
                      .concat(a.parsed.y, " ")
                      .concat(_get_data.dataUnit);
                  },
                },
                backgroundColor: "#1c2b46",
                titleFont: { size: 10 },
                titleColor: "#fff",
                titleMarginBottom: 4,
                bodyColor: "#fff",
                bodyFont: { size: 10 },
                bodySpacing: 4,
                padding: 6,
                footerMarginTop: 0,
                displayColors: !1,
              },
            },
            maintainAspectRatio: !1,
            scales: {
              y: {
                display: !1,
                ticks: {
                  beginAtZero: !0,
                  font: { size: 12 },
                  color: "#9eaecf",
                  padding: 0,
                },
                grid: {
                  color: NioApp.hexRGB("#526484", 0.2),
                  tickLength: 0,
                  zeroLineColor: NioApp.hexRGB("#526484", 0.2),
                  drawTicks: !1,
                },
              },
              x: {
                display: !1,
                ticks: {
                  font: { size: 12 },
                  color: "#9eaecf",
                  source: "auto",
                  padding: 0,
                  reverse: NioApp.State.isRTL,
                },
                grid: {
                  color: "transparent",
                  tickLength: 0,
                  zeroLineColor: NioApp.hexRGB("#526484", 0.2),
                  offset: !1,
                  drawTicks: !1,
                },
              },
            },
          },
        });
      });
    }
    NioApp.coms.docReady.push(function () {
      ecommerceLineS1();
    });
    var storeVisitors = {
      labels: Sales,
      dataUnit: "People",
      lineTension: 0.1,
      datasets: [
        {
          label: "Current Month",
          color: "#9d72ff",
          dash: [0, 0],
          background: "transparent",
          data: number,
        },
      ],
    };
    function ecommerceLineS2(selector, set_data) {
      var $selector = $(selector || ".ecommerce-line-chart-s2");
      $selector.each(function () {
        for (
          var $self = $(this),
            _self_id = $self.attr("id"),
            _get_data = void 0 === set_data ? eval(_self_id) : set_data,
            selectCanvas = document.getElementById(_self_id).getContext("2d"),
            chart_data = [],
            i = 0;
          i < _get_data.datasets.length;
          i++
        )
          chart_data.push({
            label: _get_data.datasets[i].label,
            tension: _get_data.lineTension,
            backgroundColor: _get_data.datasets[i].background,
            fill: !0,
            borderWidth: 2,
            borderDash: _get_data.datasets[i].dash,
            borderColor: _get_data.datasets[i].color,
            pointBorderColor: "transparent",
            pointBackgroundColor: "transparent",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: _get_data.datasets[i].color,
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 4,
            data: _get_data.datasets[i].data,
          });
        var chart = new Chart(selectCanvas, {
          type: "line",
          data: { labels: _get_data.labels, datasets: chart_data },
          options: {
            plugins: {
              legend: {
                display: _get_data.legend || !1,
                rtl: NioApp.State.isRTL,
                labels: { boxWidth: 12, padding: 20, color: "#6783b8" },
              },
              tooltip: {
                enabled: !0,
                rtl: NioApp.State.isRTL,
                callbacks: {
                  label: function (a) {
                    return ""
                      .concat(a.parsed.y, " ")
                      .concat(_get_data.dataUnit);
                  },
                },
                backgroundColor: "#1c2b46",
                titleFont: { size: 13 },
                titleColor: "#fff",
                titleMarginBottom: 6,
                bodyColor: "#fff",
                bodyFont: { size: 12 },
                bodySpacing: 4,
                padding: 10,
                footerMarginTop: 0,
                displayColors: !1,
              },
            },
            maintainAspectRatio: !1,
            scales: {
              y: {
                display: !0,
                position: NioApp.State.isRTL ? "right" : "left",
                ticks: {
                  font: { size: 12 },
                  color: "#9eaecf",
                  padding: 8,
                  stepSize: 2400,
                  display: !1,
                },
                grid: {
                  color: NioApp.hexRGB("#526484", 0.2),
                  tickLength: 0,
                  zeroLineColor: NioApp.hexRGB("#526484", 0.2),
                  drawTicks: !1,
                },
              },
              x: {
                display: !1,
                ticks: {
                  font: { size: 12 },
                  color: "#9eaecf",
                  source: "auto",
                  padding: 0,
                  reverse: NioApp.State.isRTL,
                },
                grid: {
                  color: "transparent",
                  tickLength: 0,
                  zeroLineColor: "transparent",
                  offset: !0,
                  drawTicks: !1,
                },
              },
            },
          },
        });
      });
    }
    NioApp.coms.docReady.push(function () {
      ecommerceLineS2();
    });
    var todayOrders = {
        labels: [
          "12AM - 02AM",
          "02AM - 04AM",
          "04AM - 06AM",
          "06AM - 08AM",
          "08AM - 10AM",
          "10AM - 12PM",
          "12PM - 02PM",
          "02PM - 04PM",
          "04PM - 06PM",
          "06PM - 08PM",
          "08PM - 10PM",
          "10PM - 12PM",
        ],
        dataUnit: "Orders",
        lineTension: 0.3,
        datasets: [
          {
            label: "Orders",
            color: "#854fff",
            background: "transparent",
            data: [92, 105, 125, 85, 110, 106, 131, 105, 110, 131, 105, 110],
          },
        ],
      },
      todayRevenue = {
        labels: [
          "12AM - 02AM",
          "02AM - 04AM",
          "04AM - 06AM",
          "06AM - 08AM",
          "08AM - 10AM",
          "10AM - 12PM",
          "12PM - 02PM",
          "02PM - 04PM",
          "04PM - 06PM",
          "06PM - 08PM",
          "08PM - 10PM",
          "10PM - 12PM",
        ],
        dataUnit: "Orders",
        lineTension: 0.3,
        datasets: [
          {
            label: "Revenue",
            color: "#33d895",
            background: "transparent",
            data: [92, 105, 125, 85, 110, 106, 131, 105, 110, 131, 105, 110],
          },
        ],
      },
      todayCustomers = {
        labels: [
          "12AM - 02AM",
          "02AM - 04AM",
          "04AM - 06AM",
          "06AM - 08AM",
          "08AM - 10AM",
          "10AM - 12PM",
          "12PM - 02PM",
          "02PM - 04PM",
          "04PM - 06PM",
          "06PM - 08PM",
          "08PM - 10PM",
          "10PM - 12PM",
        ],
        dataUnit: "Orders",
        lineTension: 0.3,
        datasets: [
          {
            label: "Customers",
            color: "#ff63a5",
            background: "transparent",
            data: [92, 105, 125, 85, 110, 106, 131, 105, 110, 131, 105, 110],
          },
        ],
      },
      todayVisitors = {
        labels: [
          "12AM - 02AM",
          "02AM - 04AM",
          "04AM - 06AM",
          "06AM - 08AM",
          "08AM - 10AM",
          "10AM - 12PM",
          "12PM - 02PM",
          "02PM - 04PM",
          "04PM - 06PM",
          "06PM - 08PM",
          "08PM - 10PM",
          "10PM - 12PM",
        ],
        dataUnit: "Orders",
        lineTension: 0.3,
        datasets: [
          {
            label: "Visitors",
            color: "#559bfb",
            background: "transparent",
            data: [92, 105, 125, 85, 110, 106, 131, 105, 110, 131, 105, 110],
          },
        ],
      };
    function ecommerceLineS3(selector, set_data) {
      var $selector = $(selector || ".ecommerce-line-chart-s3");
      $selector.each(function () {
        for (
          var $self = $(this),
            _self_id = $self.attr("id"),
            _get_data = void 0 === set_data ? eval(_self_id) : set_data,
            selectCanvas = document.getElementById(_self_id).getContext("2d"),
            chart_data = [],
            i = 0;
          i < _get_data.datasets.length;
          i++
        )
          chart_data.push({
            label: _get_data.datasets[i].label,
            tension: _get_data.lineTension,
            backgroundColor: _get_data.datasets[i].background,
            fill: !0,
            borderWidth: 2,
            borderColor: _get_data.datasets[i].color,
            pointBorderColor: "transparent",
            pointBackgroundColor: "transparent",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: _get_data.datasets[i].color,
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 4,
            data: _get_data.datasets[i].data,
          });
        var chart = new Chart(selectCanvas, {
          type: "line",
          data: { labels: _get_data.labels, datasets: chart_data },
          options: {
            plugins: {
              legend: {
                display: _get_data.legend || !1,
                rtl: NioApp.State.isRTL,
                labels: { boxWidth: 12, padding: 20, color: "#6783b8" },
              },
              tooltip: {
                enabled: !0,
                rtl: NioApp.State.isRTL,
                callbacks: {
                  title: function () {
                    return !1;
                  },
                  label: function (a) {
                    return ""
                      .concat(a.parsed.y, " ")
                      .concat(_get_data.dataUnit);
                  },
                },
                backgroundColor: "#1c2b46",
                titleFont: { size: 8 },
                titleColor: "#fff",
                titleMarginBottom: 4,
                bodyColor: "#fff",
                bodyFont: { size: 8 },
                bodySpacing: 4,
                padding: 6,
                footerMarginTop: 0,
                displayColors: !1,
              },
            },
            maintainAspectRatio: !1,
            scales: {
              y: {
                display: !1,
                ticks: {
                  beginAtZero: !1,
                  font: { size: 12 },
                  color: "#9eaecf",
                  padding: 0,
                },
                grid: {
                  color: NioApp.hexRGB("#526484", 0.2),
                  tickLength: 0,
                  zeroLineColor: NioApp.hexRGB("#526484", 0.2),
                  drawTicks: !1,
                },
              },
              x: {
                display: !1,
                ticks: {
                  font: { size: 12 },
                  color: "#9eaecf",
                  source: "auto",
                  padding: 0,
                  reverse: NioApp.State.isRTL,
                },
                grid: {
                  color: "transparent",
                  tickLength: 0,
                  zeroLineColor: NioApp.hexRGB("#526484", 0.2),
                  offset: !0,
                  drawTicks: !1,
                },
              },
            },
          },
        });
      });
    }
    NioApp.coms.docReady.push(function () {
      ecommerceLineS3();
    });
    var salesStatistics = {
      labels: Sales,
      dataUnit: "People",
      lineTension: 0.4,
      datasets: [
        {
          label: "Total orders",
          color: "#9d72ff",
          dash: [0, 0],
          background: NioApp.hexRGB("#9d72ff", 0.15),
          data: number,
        },
        {
          label: "Canceled orders",
          color: "#eb6459",
          dash: [5, 5],
          background: "transparent",
          data: number,
        },
      ],
    };
    function ecommerceLineS4(selector, set_data) {
      var $selector = $(selector || ".ecommerce-line-chart-s4");
      $selector.each(function () {
        for (
          var $self = $(this),
            _self_id = $self.attr("id"),
            _get_data = void 0 === set_data ? eval(_self_id) : set_data,
            selectCanvas = document.getElementById(_self_id).getContext("2d"),
            chart_data = [],
            i = 0;
          i < _get_data.datasets.length;
          i++
        )
          chart_data.push({
            label: _get_data.datasets[i].label,
            tension: _get_data.lineTension,
            backgroundColor: _get_data.datasets[i].background,
            fill: !0,
            borderWidth: 2,
            borderDash: _get_data.datasets[i].dash,
            borderColor: _get_data.datasets[i].color,
            pointBorderColor: "transparent",
            pointBackgroundColor: "transparent",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: _get_data.datasets[i].color,
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 4,
            data: _get_data.datasets[i].data,
          });
        var chart = new Chart(selectCanvas, {
          type: "line",
          data: { labels: _get_data.labels, datasets: chart_data },
          options: {
            plugins: {
              legend: {
                display: _get_data.legend || !1,
                rtl: NioApp.State.isRTL,
                labels: { boxWidth: 12, padding: 20, color: "#6783b8" },
              },
              tooltip: {
                enabled: !0,
                rtl: NioApp.State.isRTL,
                callbacks: {
                  label: function (a) {
                    return ""
                      .concat(a.parsed.y, " ")
                      .concat(_get_data.dataUnit);
                  },
                },
                backgroundColor: "#1c2b46",
                titleFont: { size: 13 },
                titleColor: "#fff",
                titleMarginBottom: 6,
                bodyColor: "#fff",
                bodyFont: { size: 12 },
                bodySpacing: 4,
                padding: 10,
                footerMarginTop: 0,
                displayColors: !1,
              },
            },
            maintainAspectRatio: !1,
            scales: {
              y: {
                display: !0,
                stacked: _get_data.stacked || !1,
                position: NioApp.State.isRTL ? "right" : "left",
                ticks: {
                  beginAtZero: !0,
                  font: { size: 11 },
                  color: "#9eaecf",
                  padding: 10,
                  callback: function (a, t, e) {
                    return "$ " + a;
                  },
                  min: 0,
                  stepSize: 3e3,
                },
                grid: {
                  color: NioApp.hexRGB("#526484", 0.2),
                  tickLength: 0,
                  zeroLineColor: NioApp.hexRGB("#526484", 0.2),
                  drawTicks: !1,
                },
              },
              x: {
                display: !1,
                stacked: _get_data.stacked || !1,
                ticks: {
                  font: { size: 9 },
                  color: "#9eaecf",
                  source: "auto",
                  padding: 10,
                  reverse: NioApp.State.isRTL,
                },
                grid: {
                  color: "transparent",
                  tickLength: 0,
                  zeroLineColor: "transparent",
                  drawTicks: !1,
                },
              },
            },
          },
        });
      });
    }
    NioApp.coms.docReady.push(function () {
      ecommerceLineS4();
    });
    var averargeOrder = {
      labels: parsedData.totalSales.labels,
      dataUnit: `Orders`,
      lineTension: 0.1,
      datasets: [
        {
          label: "Active Users",
          
          color: "#b695ff",
          background: "#b695ff",
          data: parsedData.dailyOrderCounts,
        },
      ],
    
    };
    function ecommerceBarS1(selector, set_data) {
      var $selector = $(selector || ".ecommerce-bar-chart-s1");
      $selector.each(function () {
        for (
          var $self = $(this),
            _self_id = $self.attr("id"),
            _get_data = void 0 === set_data ? eval(_self_id) : set_data,
            selectCanvas = document.getElementById(_self_id).getContext("2d"),
            chart_data = [],
            i = 0;
          i < _get_data.datasets.length;
          i++
        )
          chart_data.push({
            label: _get_data.datasets[i].label,
            tension: _get_data.lineTension,
            backgroundColor: _get_data.datasets[i].background,
            borderWidth: 2,
            borderColor: _get_data.datasets[i].color,
            data: _get_data.datasets[i].data,
            barPercentage: 0.7,
            categoryPercentage: 0.7,
          });
        var chart = new Chart(selectCanvas, {
          type: "bar",
          data: { labels: _get_data.labels, datasets: chart_data },
          options: {
            plugins: {
              legend: {
                display: _get_data.legend || !1,
                rtl: NioApp.State.isRTL,
                labels: { boxWidth: 12, padding: 20, color: "#6783b8" },
              },
              tooltip: {
                enabled: !0,
                rtl: NioApp.State.isRTL,
                callbacks: {
                  title: function () {
                    return !1;
                  },
                  label: function (a) {
                    return ""
                      .concat(a.parsed.y, " ")
                      .concat(_get_data.dataUnit);
                  },
                },
                backgroundColor: "#1c2b46",
                titleFont: { size: 11 },
                titleColor: "#fff",
                titleMarginBottom: 6,
                bodyColor: "#fff",
                bodyFont: { size: 9 },
                bodySpacing: 4,
                padding: 6,
                footerMarginTop: 0,
                displayColors: !1,
              },
            },
            maintainAspectRatio: !1,
            scales: {
              y: {
                display: !0,
                position: NioApp.State.isRTL ? "right" : "left",
                ticks: {
                  beginAtZero: !1,
                  font: { size: 12 },
                  color: "#9eaecf",
                  padding: 0,
                  display: !1,
                  stepSize: 100,
                },
                grid: {
                  color: NioApp.hexRGB("#526484", 0.2),
                  tickLength: 0,
                  zeroLineColor: NioApp.hexRGB("#526484", 0.2),
                  drawTicks: !1,
                },
              },
              x: {
                display: !1,
                ticks: {
                  font: { size: 12 },
                  color: "#9eaecf",
                  source: "auto",
                  padding: 0,
                  reverse: NioApp.State.isRTL,
                },
                grid: {
                  color: "transparent",
                  tickLength: 0,
                  zeroLineColor: "transparent",
                  offset: !0,
                  drawTicks: !1,
                },
              },
            },
          },
        });
      });
    }
    NioApp.coms.docReady.push(function () {
      ecommerceBarS1();
    });
    var trafficSources = {
        labels: ["Online Payment", "Cash On Delivery", "Wallet"],
        dataUnit: "People",
        legend: !1,
        datasets: [
          {
            borderColor: "#fff",
            background: ["#b695ff", "#ffa9ce", "#b8acff"],
            data: [parsedData.paymentCounts.online, parsedData.paymentCounts.cashOnDelivery, parsedData.paymentCounts.wallet],
          },
        ],
      },
      orderStatistics = {
        labels: ["Completed", "Processing", "Canclled"],
        dataUnit: "People",
        legend: !1,
        datasets: [
          {
            borderColor: "#fff",
            background: ["#816bff", "#13c9f2", "#ff82b7"],
            data: [4305, 859, 482],
          },
        ],
      };
    function ecommerceDoughnutS1(selector, set_data) {
      var $selector = $(selector || ".ecommerce-doughnut-s1");
      $selector.each(function () {
        for (
          var $self = $(this),
            _self_id = $self.attr("id"),
            _get_data = void 0 === set_data ? eval(_self_id) : set_data,
            selectCanvas = document.getElementById(_self_id).getContext("2d"),
            chart_data = [],
            i = 0;
          i < _get_data.datasets.length;
          i++
        )
          chart_data.push({
            backgroundColor: _get_data.datasets[i].background,
            borderWidth: 2,
            borderColor: _get_data.datasets[i].borderColor,
            hoverBorderColor: _get_data.datasets[i].borderColor,
            data: _get_data.datasets[i].data,
          });
        var chart = new Chart(selectCanvas, {
          type: "doughnut",
          data: { labels: _get_data.labels, datasets: chart_data },
          options: {
            plugins: {
              legend: {
                display: _get_data.legend || !1,
                rtl: NioApp.State.isRTL,
                labels: { boxWidth: 12, padding: 20, color: "#6783b8" },
              },
              tooltip: {
                enabled: !0,
                rtl: NioApp.State.isRTL,
                callbacks: {
                  label: function (a) {
                    return "".concat(a.parsed, " ").concat(_get_data.dataUnit);
                  },
                },
                backgroundColor: "#1c2b46",
                titleFont: { size: 13 },
                titleColor: "#fff",
                titleMarginBottom: 6,
                bodyColor: "#fff",
                bodyFont: { size: 12 },
                bodySpacing: 4,
                padding: 10,
                footerMarginTop: 0,
                displayColors: !1,
              },
            },
            rotation: -1.5,
            cutoutPercentage: 70,
            maintainAspectRatio: !1,
          },
        });
      });
    }
    NioApp.coms.docReady.push(function () {
      ecommerceDoughnutS1();
    });
  
}
chart(NioApp, jQuery,totalSalesData)