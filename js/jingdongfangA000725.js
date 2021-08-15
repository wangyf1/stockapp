var ctx = loadChartCanvas('region');
date = [
    '2020-12-31', '2019-12-31', '2018-12-31', '2017-12-31',
    '2016-12-31', '2015-12-31'];
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: date.reverse(),
        datasets: [
            {
                label: "中国",
                backgroundColor: 'rgba(0, 102, 255, 1)',
                borderColor: 'rgba(0, 102, 255,1)',
                data: [652, 594, 429, 440, 367, 210].reverse()
            },
            {
                label: "亚洲其他",
                backgroundColor: 'rgba(75, 192, 192, 1)',
                borderColor: 'rgba(75, 192, 192, 1)',
                data: [549, 450, 442, 442, 286, 213].reverse()
            },
            {
                label: "欧洲",
                backgroundColor: 'rgba(255, 206, 86, 1)',
                borderColor: 'rgba(255, 206, 86, 1)',
                data: [48, 45, 35, 22, 16, 34].reverse()
            },
            {
                label: "美洲",
                backgroundColor: 'rgba(255, 51, 0, 1)',
                borderColor: 'rgba(255, 51, 0, 1)',
                data: [103, 70, 63, 32, 18, 34].reverse()
            }

        ]
    },
    options: {
        title: {
            display: true,
            text: '年营业收入（按地区划分）（亿元）'
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