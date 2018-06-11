// Chart.js scripts
// -- Set new default font family and font color to mimic Bootstrap's default styling
var datums = JSON.parse(localStorage.getItem('inputtedData'));
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';
// -- Area Chart Example
// -60000000000 + 8000000 x - 338.16 x^2 + 0.008 x^3 - 1.×10^-7 x^4 + 4.2×10^-13 x^5
function diffeq(x){
    return -60000000000 + 8000000*x - 338.16*Math.pow(x,2) + 0.008*Math.pow(x,3) - 1.*10^-7*Math.pow(x,4) + 4.2*10^-13*Math.pow(x,5);
}
function riemann(x){
    var sum = 0;
    for(var i = 0; i < x.length; i++){
        if(i==0||i==x.length-1){sum += x[i];}
        else {sum += 2*x[i];}
    }
    var part = 1/2*sum
    return part.toFixed(2);
}
function fullriemann(x){
    console.log([0.5*(x[0]+x[1]), riemann(x.slice(0,3)), riemann(x.slice(0,4)), riemann(x.slice(0,5)), riemann(x.slice(0,6)), riemann(x.slice(0,7)), riemann(x.slice(0,8)), riemann(x.slice(0,9)), riemann(x.slice(0,10)), riemann(x.slice(0,11)), riemann(x.slice(0,12))]);
    return [0.5*(x[0]+x[1]), riemann(x.slice(0,3)), riemann(x.slice(0,4)), riemann(x.slice(0,5)), riemann(x.slice(0,6)), riemann(x.slice(0,7)), riemann(x.slice(0,8)), riemann(x.slice(0,9)), riemann(x.slice(0,10)), riemann(x.slice(0,11)), riemann(x.slice(0,12))];
}
function fullAdd(x,y){
    var ret = [];
    for(var i = 0; i < x.length; i++){
        ret.push(x+y);
    }
    console.log(ret)
    return ret;
}
var ctx = document.getElementById("myAreaChart1");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
      label: "Sessions",
      lineTension: 0.3,
      backgroundColor: "rgba(128,0,0,0.2)",
      borderColor: "rgba(128,0,0,1)",
      pointRadius: 5,
      pointBackgroundColor: "rgba(128,0,0,1)",
      pointBorderColor: "rgba(255,255,255,0.8)",
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(128,0,0,1)",
      pointHitRadius: 20,
      pointBorderWidth: 2,
      data: [2.80,2.86,2.86,2.79,2.77,2.86,2.91,2.79,2.72,2.86,2.98],
  },
  {
    label: "Sessions",
    lineTension: 0.3,
    backgroundColor: "rgba(2,117,216,0.2)",
    borderColor: "rgba(2,117,216,1)",
    pointRadius: 5,
    pointBackgroundColor: "rgba(2,117,216,1)",
    pointBorderColor: "rgba(255,255,255,0.8)",
    pointHoverRadius: 5,
    pointHoverBackgroundColor: "rgba(2,117,216,1)",
    pointHitRadius: 20,
    pointBorderWidth: 2,
    data: [3.28,3.34,3.34,3.27,3.25,3.34,3.39,3.27,3.20,3.34,3.46],
  }
],
  },
  options: {
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          min: 2,
          max: 3.75,
          maxTicksLimit: 5
        },
        gridLines: {
          color: "rgba(0, 0, 0, .125)",
        }
      }],
    },
    legend: {
      display: false
    }
  }
});
var ctx = document.getElementById("myAreaChart3");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
      label: "Optimized Price",
      lineTension: 0.3,
      backgroundColor: "rgba(128,0,0,0.2)",
      borderColor: "rgba(128,0,0,1)",
      pointRadius: 5,
      pointBackgroundColor: "rgba(128,0,0,1)",
      pointBorderColor: "rgba(255,255,255,0.8)",
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(128,0,0,1)",
      pointHitRadius: 20,
      pointBorderWidth: 2,
      data: [2.64,2.70,2.70,2.63,2.61,2.70,2.75,2.63,2.56,2.70,2.82],
  },
  {
    label: "Unoptimized Price",
    lineTension: 0.3,
    backgroundColor: "rgba(2,117,216,0.2)",
    borderColor: "rgba(2,117,216,1)",
    pointRadius: 5,
    pointBackgroundColor: "rgba(2,117,216,1)",
    pointBorderColor: "rgba(255,255,255,0.8)",
    pointHoverRadius: 5,
    pointHoverBackgroundColor: "rgba(2,117,216,1)",
    pointHitRadius: 20,
    pointBorderWidth: 2,
    data: [3.21,3.27,3.27,3.20,3.18,3.27,3.32,3.20,3.13,3.27,3.39],
  }
],
  },
  options: {
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          min: 2,
          max: 3.75,
          maxTicksLimit: 5
        },
        gridLines: {
          color: "rgba(0, 0, 0, .125)",
        }
      }],
    },
    legend: {
      display: false
    }
  }
});

var ctx = document.getElementById("myAreaChart2");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
      label: "Sessions",
      lineTension: 0.3,
      backgroundColor: "rgba(128,0,0,0.2)",
      borderColor: "rgba(128,0,0,1)",
      pointRadius: 5,
      pointBackgroundColor: "rgba(128,0,0,1)",
      pointBorderColor: "rgba(255,255,255,0.8)",
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(128,0,0,1)",
      pointHitRadius: 20,
      pointBorderWidth: 2,
      data: fullriemann([2.80,2.86,2.86,2.79,2.77,2.86,2.91,2.79,2.72,2.86,2.98]),
  },
  {
    label: "Sessions",
    lineTension: 0.3,
    backgroundColor: "rgba(2,117,216,0.2)",
    borderColor: "rgba(2,117,216,1)",
    pointRadius: 5,
    pointBackgroundColor: "rgba(2,117,216,1)",
    pointBorderColor: "rgba(255,255,255,0.8)",
    pointHoverRadius: 5,
    pointHoverBackgroundColor: "rgba(2,117,216,1)",
    pointHitRadius: 20,
    pointBorderWidth: 2,
    data: fullriemann([3.28,3.34,3.34,3.27,3.25,3.34,3.39,3.27,3.20,3.34,3.46]),//.map(function(i){return i+10})
  }
],
  },
  options: {
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          min: 2,
          max: 35,
          maxTicksLimit: 5
        },
        gridLines: {
          color: "rgba(0, 0, 0, .125)",
        }
      }],
    },
    legend: {
      display: false
    }
  }
});
var ctx = document.getElementById("myAreaChart4");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
      label: "Optimized Price",
      lineTension: 0.3,
      backgroundColor: "rgba(128,0,0,0.2)",
      borderColor: "rgba(128,0,0,1)",
      pointRadius: 5,
      pointBackgroundColor: "rgba(128,0,0,1)",
      pointBorderColor: "rgba(255,255,255,0.8)",
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(128,0,0,1)",
      pointHitRadius: 20,
      pointBorderWidth: 2,
      data: fullriemann([2.64,2.70,2.70,2.63,2.61,2.70,2.75,2.63,2.56,2.70,2.82]),
  },
  {
    label: "Unoptimized Price",
    lineTension: 0.3,
    backgroundColor: "rgba(2,117,216,0.2)",
    borderColor: "rgba(2,117,216,1)",
    pointRadius: 5,
    pointBackgroundColor: "rgba(2,117,216,1)",
    pointBorderColor: "rgba(255,255,255,0.8)",
    pointHoverRadius: 5,
    pointHoverBackgroundColor: "rgba(2,117,216,1)",
    pointHitRadius: 20,
    pointBorderWidth: 2,
    data: fullriemann([3.21,3.27,3.27,3.20,3.18,3.27,3.32,3.20,3.13,3.27,3.39]),
  }
],
  },
  options: {
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          min: 2,
          max: 35,
          maxTicksLimit: 5
        },
        gridLines: {
          color: "rgba(0, 0, 0, .125)",
        }
      }],
    },
    legend: {
      display: false
    }
  }
});
console.log(fullriemann([2.80,2.86,2.86,2.79,2.77,2.86,2.91,2.79,2.72,2.86,2.98]));
