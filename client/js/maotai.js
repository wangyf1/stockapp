//Import Excel data


var ImportData = alasql.promise('select * from xlsx("../excel/maotai/bfa.xlsx.xlsm",{sheetid:"keyData",range:"B2:AD3"})')
    .then(function(data){
        console.log(data[0]);
    }).catch(function(err){
    console.log('There was an error reading the source file.:', err);
});

console.log(ImportData);

  

 
