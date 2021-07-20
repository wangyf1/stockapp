var ctx = loadChartCanvas('product')
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [ '2016-12-31', '2017-12-31', '2018-12-31',
            '2019-12-31', '2020-12-31'],
        datasets: [
            {
                label: "防水卷材",
                backgroundColor: 'rgba(66, 135, 245, 1)',
                borderColor: 'rgba(66, 135, 245,1)',
                data: [126.89,36.84,53.35,73.19,99.8,112.33]
            },
            {
                label: "防水涂料",
                backgroundColor: 'rgba(66, 245, 66, 1)',
                borderColor: 'rgba(66, 245, 66, 1)',
                data: [13.62,18.99,29.72,39.76,48.75,60.01]
            },
            
            {
                label: "防水施工",
                backgroundColor: 'rgba(255, 156, 36, 1)',
                borderColor: 'rgba(255, 156, 36, 1)',
                data: [8.39,9.56,14.17,19.61,23.48,33.04]
            },

            {
                label: "其他收入",
                backgroundColor: 'rgba(255, 0, 36, 1)',
                borderColor: 'rgba(255, 0, 36, 1)',
                data: [3.87,3.59,5.23,6.81,8.31,11.03]
            },

            {
                label: "材料销售",
                backgroundColor: 'rgba(0, 239, 255, 1)',
                borderColor: 'rgba(0, 239, 255, 1)',
                data: [0.27,1.02,0.47,1.18,1.2,0.767]
            },

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