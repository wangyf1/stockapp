$(document).ready(function(){

    var $mouseX = 0, $mouseY = 0;
    var $xp = 0, $yp = 0;
    
    $(document).mousemove(function(e){
        $mouseX = e.pageX;
        $mouseY = e.pageY;    
    });
    
    
    var $loop = setInterval(function(){

    $xp += (($mouseX - $xp)/1.5); // change 1.5 to alter damping, higher is slower
    $yp += (($mouseY - $yp)/1.5);

    $(".moving-div").css({left: $xp + 20 +'px', top: $yp - 0 + 'px'});   // change 20 and 0 to alter text box location
    }, 30);

    // 京东方
    $('a:contains("京东方")').hover(function(){
        $('#moving-div-1').addClass('moving-div-active')
        $(this).on('mouseleave',function(){
        $('#moving-div-1').removeClass('moving-div-active')
        })
    })

    // 隆基股份
    $('a:contains("隆基股份")').hover(function(){
        $('#moving-div-2').addClass('moving-div-active')
        $(this).on('mouseleave',function(){
        $('#moving-div-2').removeClass('moving-div-active')
        })
    })

    // 比亚迪
    $('a:contains("比亚迪")').hover(function(){
        $('#moving-div-3').addClass('moving-div-active')
        $(this).on('mouseleave',function(){
        $('#moving-div-3').removeClass('moving-div-active')
        })
    })

    // 比亚迪
    $('a:contains("贵州茅台")').hover(function(){
        $('#moving-div-4').addClass('moving-div-active')
        $(this).on('mouseleave',function(){
        $('#moving-div-4').removeClass('moving-div-active')
        })
    })

    //Import Excel data trial #1
    alasql('select * from xlsx("excel/maotai/bsf.xlsx.xlsm",{headers:true, sheetid:"keyData", range:"B2:AD3"})',
    [],function(data) {
        console.log(data);
    });

});


