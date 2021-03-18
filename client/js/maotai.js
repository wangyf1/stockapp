//Import Excel data


alasql.promise('select * from xlsx("../excel/maotai/bfa.xlsx.xlsm",{sheetid:"keyData",range:"B2:AD3"})')
    .then(function(data){
        
        console.log(data[0]);
        var timeKeys = Object.keys(data[0]);
        console.log(timeKeys);
        var profit = Object.values(data[0]);
        console.log(profit);

        var ctx = document.getElementById('profit');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: timeKeys,
                datasets: [
                    {
                        label: "净利润（亿元）",
                        backgroundColor: 'rgba(0, 102, 255, 1)',
                        borderColor: 'rgba(0, 102, 255,1)',
                        data: profit
                    }

                ]
            },
            options: {
                title: {
                    display: true,
                    text: '净利润（亿元）'
                },
                responsive: false,
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        },
                    }]
                }
            }
            });











    }).catch(function(err){
    console.log('There was an error reading the source file.:', err);
});


  

 
