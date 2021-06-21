var ctx = loadChartCanvas('region');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['2016-12-31', '2017-12-31', '2018-12-31',
            '2019-12-31', '2020-12-31'],
        datasets: [
            {
                label: "中国境内",
                backgroundColor: 'rgba(0, 102, 255, 1)',
                borderColor: 'rgba(0, 102, 255,1)',
                data: [11.20, 13.94, 18.45, 27.85, 30.76]
            },
            
            {
                label: "境外",
                backgroundColor: 'rgba(146,36, 0, 1)',
                borderColor: 'rgba(146,36, 0, 1)',
                data: [2.98, 4.34, 6.13, 6.45, 1.94]
            }

        ]
    },
    options: {
        title: {
            display: true,
            text: '年营业收入（按地区划分）（亿元）'
        },
        responsive: false,
        scales: {
            xAxes: [{
                stacked: true
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                stacked: true
            }]
        }
    }
});

var ctx = loadChartCanvas('product');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['2016-12-31', '2017-12-31', '2018-12-31',
            '2019-12-31', '2020-12-31'],
        datasets: [
            {
                label: "智能安全芯片",
                backgroundColor: 'rgba(0, 102, 255, 1)',
                borderColor: 'rgba(0, 102, 255,1)',
                data: [5.685, 8.133,10.36, 13.21, 13.63]
            },
            {
                label: "特种集成电路",
                backgroundColor: 'rgba(75, 192, 192, 1)',
                borderColor: 'rgba(75, 192, 192, 1)',
                data: [5.13,5.16,6.16,10.79,16.73]
            },
            
            {
                label: "存储器芯片",
                backgroundColor: 'rgba(255, 51, 0, 1)',
                borderColor: 'rgba(255, 51, 0, 1)',
                data: [1.94, 3.35, 6.45, 8.43, 0.11]
            },
            {
                label: "晶体元器件",
                backgroundColor: 'rgba(146,36, 0, 1)',
                borderColor: 'rgba(146,36, 0, 1)',
                data: [1.41, 1.61, 1.57, 1.68, 1.97]
            }
        ]
    },
    options: {
        title: {
            display: true,
            text: '年营业收入（按不同产品划分）（亿元）'
        },
        responsive: false,
        scales: {
            xAxes: [{
                stacked: true
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                stacked: true
            }]
        }
    }
});