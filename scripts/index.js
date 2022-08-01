(function(global) {
    let vis = new global.visualizer('canvas', msPerInterval = 150);
    vis.setInvertYAxis(true);
    vis.setDrawBars(true);
    vis.initFromCellDimensions(15, 15, 3);
    vis.drawSortedData();
    vis.mountButtons(global.algorithms);
})(window);