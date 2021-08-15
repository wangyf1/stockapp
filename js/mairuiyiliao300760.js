var ctx = loadChartCanvas('product');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [ '2017-12-31', '2018-12-31',
            '2019-12-31', '2020-12-31'],
        datasets: [
            {
                label: "生命信息与支持类产品",
                backgroundColor: 'rgba(66, 135, 245, 1)',
                borderColor: 'rgba(66, 135, 245,1)',
                data: [42.36, 52.24, 64.90, 100.06]
            },
            {
                label: "体外诊断类产品",
                backgroundColor: 'rgba(66, 245, 66, 1)',
                borderColor: 'rgba(66, 245, 66, 1)',
                data: [37.41, 46.26, 58.14, 66.46]
            },
            
            {
                label: "医学影像类产品",
                backgroundColor: 'rgba(255, 156, 36, 1)',
                borderColor: 'rgba(255, 156, 36, 1)',
                data: [29.35, 35.97, 40.39, 41.96]
            },
            {
                label: "其他类产品",
                backgroundColor: 'rgba(146,36, 0, 1)',
                borderColor: 'rgba(146,36, 255, 1)',
                data: [2.20, 2.63, 1.76, 1.32]
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