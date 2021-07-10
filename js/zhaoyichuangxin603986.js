var ctx = loadChartCanvas('product')
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [ '2016-12-31', '2017-12-31', '2018-12-31',
            '2019-12-31', '2020-12-31'],
        datasets: [
            {
                label: "存储芯片",
                backgroundColor: 'rgba(66, 135, 245, 1)',
                borderColor: 'rgba(66, 135, 245,1)',
                data: [12.92, 17.16, 18.39, 25.55, 32.82]
            },
            {
                label: "微控制器",
                backgroundColor: 'rgba(66, 245, 66, 1)',
                borderColor: 'rgba(66, 245, 66, 1)',
                data: [1.97,3.10, 4.04, 4.44, 7.55]
            },
            
            {
                label: "传感器\技术服务及其 他收入",
                backgroundColor: 'rgba(255, 156, 36, 1)',
                borderColor: 'rgba(255, 156, 36, 1)',
                data: [0,0,0,2.03,4.5]
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