var ctx = loadChartCanvas('product')
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [ '2015-12-31', '2016-12-31', '2017-12-31', '2018-12-31',
            '2019-12-31', '2020-12-31'],
        datasets: [
            {
                label: "高价位酒",
                backgroundColor: 'rgba(66, 135, 245, 1)',
                borderColor: 'rgba(66, 135, 245,1)',
                data: [155.07,174.16,219.94,301.89,386.76,440.6]
            },
            {
                label: "中低价位酒",
                backgroundColor: 'rgba(66, 245, 66, 1)',
                borderColor: 'rgba(66, 245, 66, 1)',
                data: [48.39,52.88,66.98,75.63,76.25,83.73]
            },
            
            {
                label: "塑料制品等",
                backgroundColor: 'rgba(255, 156, 36, 1)',
                borderColor: 'rgba(255, 156, 36, 1)',
                data: [10.29,15.72,17.94,18.52,25.41,25.85]
            }
        ]
    },
    options: {
        title: {
            display: true,
            text: '年营业收入（按不同产品划分）（亿元）'
        },
        responsive: true,
        maintainAspectRatio: false,
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