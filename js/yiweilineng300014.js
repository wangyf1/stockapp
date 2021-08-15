var ctx = loadChartCanvas('product')
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [ '2015-12-31', '2016-12-31', '2017-12-31', '2018-12-31',
            '2019-12-31', '2020-12-31'],
        datasets: [
            {
                label: "锂原电池",
                backgroundColor: 'rgba(66, 135, 245, 1)',
                borderColor: 'rgba(66, 135, 245,1)',
                data: [6.94,7.76,10.91,12.00,18.92,14.91]
            },
            {
                label: "锂离子电池",
                backgroundColor: 'rgba(66, 245, 66, 1)',
                borderColor: 'rgba(66, 245, 66, 1)',
                data: [3.19,8.30,13.90,31.51,45.20,66.70]
            },
            
            {
                label: "电子烟及其他",
                backgroundColor: 'rgba(255, 156, 36, 1)',
                borderColor: 'rgba(255, 156, 36, 1)',
                data: [2.96,7.28,4.99,0,0,0]
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