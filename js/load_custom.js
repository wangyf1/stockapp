function loadChartCanvas(id) {
    var ctx = document.createElement('canvas');
    ctx.width = 800;
    ctx.height = 700;
    ctx.id = id;
    var wrapperDiv = document.createElement('div');
    var parent = document.getElementById('canvas');
    wrapperDiv.appendChild(ctx);
    parent.insertBefore(wrapperDiv, parent.firstChild);
    return ctx
}
