var ctx = loadChartCanvas('product')
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [ '2017-12-31', '2018-12-31',
            '2019-12-31', '2020-12-31'],
        datasets: [
            {
                label: "动力电池系统",
                backgroundColor: 'rgba(66, 135, 245, 1)',
                borderColor: 'rgba(66, 135, 245,1)',
                data: [166.57, 245.15, 385.84, 394.26]
            },
            {
                label: "锂电池材料",
                backgroundColor: 'rgba(66, 245, 66, 1)',
                borderColor: 'rgba(66, 245, 66, 1)',
                data: [24.71,38.61,43.05,34.29]
            },
            
            {
                label: "储能系统",
                backgroundColor: 'rgba(255, 156, 36, 1)',
                borderColor: 'rgba(255, 156, 36, 1)',
                data: [0.16, 1.89, 6.10, 19.43]
            },
            {
                label: "其他类产品",
                backgroundColor: 'rgba(146,36, 0, 1)',
                borderColor: 'rgba(146,36, 255, 1)',
                data: [8.53, 10.46, 22.89, 55.21]
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