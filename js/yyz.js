//hovering function
$(document).ready(function () {
  var $mouseX = 0, $mouseY = 0;
  var $xp = 0, $yp = 0;

  $(document).mousemove(function (e) {
    $mouseX = e.pageX;
    $mouseY = e.pageY;
  });


  var $loop = setInterval(function () {

    $xp += (($mouseX - $xp) / 1.5); // change 1.5 to alter damping, higher is slower
    $yp += (($mouseY - $yp) / 1.5);

    $(".moving-div").css({ left: $xp + 20 + 'px', top: $yp - 0 + 'px' });   // change 20 and 0 to alter text box location
  }, 30);

  // 京东方
  $('a:contains("京东方")').hover(function () {
    $('#moving-div-1').addClass('moving-div-active')
    $(this).on('mouseleave', function () {
      $('#moving-div-1').removeClass('moving-div-active')
    })
  })

  // 隆基股份
  $('a:contains("隆基股份")').hover(function () {
    $('#moving-div-2').addClass('moving-div-active')
    $(this).on('mouseleave', function () {
      $('#moving-div-2').removeClass('moving-div-active')
    })
  })

  // 比亚迪
  $('a:contains("比亚迪")').hover(function () {
    $('#moving-div-3').addClass('moving-div-active')
    $(this).on('mouseleave', function () {
      $('#moving-div-3').removeClass('moving-div-active')
    })
  })

  // 比亚迪
  $('a:contains("贵州茅台")').hover(function () {
    $('#moving-div-4').addClass('moving-div-active')
    $(this).on('mouseleave', function () {
      $('#moving-div-4').removeClass('moving-div-active')
    })
  })

  // 净利润解释

  $('u:contains("净利润")').hover(function () {
    $('#profitDescription').addClass('moving-div-active')
    $(this).on('mouseleave', function () {
      $('#profitDescription').removeClass('moving-div-active')
    })
  })

});

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("myTable");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function sortTableByNum(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("myTable");
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.getElementsByTagName("TR");
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      var xContent = (isNaN(x.innerHTML))
        ? (x.innerHTML.toLowerCase() === '-')
          ? 0 : x.innerHTML.toLowerCase()
        : parseFloat(x.innerHTML);
      var yContent = (isNaN(y.innerHTML))
        ? (y.innerHTML.toLowerCase() === '-')
          ? 0 : y.innerHTML.toLowerCase()
        : parseFloat(y.innerHTML);
      if (dir == "asc") {
        if (xContent > yContent) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (xContent < yContent) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

