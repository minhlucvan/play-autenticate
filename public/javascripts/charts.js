if (!d3) throw new Error('d3js not found!');
/*

*/
Chart = Object();
Chart.colors = ['#69D2E7',
                '#FA6900',
                '#E94C6F',
                '#542733',
                '#007034',
                '#5A6A62',
                '#C6D5CD',
                '#FDF200',
                '#588C73',
                '#F2E394',
                '#F2AE72',
                '#D96459',
                '#F38630',
                '#8C4646',
                '#5E412F',
                '#FCEBB6',
                '#78C0A8',
                '#E0E4CC',
                '#D75C37',
                '#67727A',
                '#6991AC',
                '#C3D7DF',
                '#C3D7DF',
                '#F5F5F5',
                '#A7DBDB',
                '#A2D7D8',
                '#BFE1BF'];
Chart.component = Object();

Chart.component.infoPanel = function() {
    //default option
    //genarate method
    //update functions
    //return method
};
/*
this a stand-alone piechart, used as a chart component
constructor: return a chart genarater
==============================================
method:
width: get, set panel width
pramaters: value for width
return: chart
height: get, set panel height
pramaters: value for hieght
return: chart
colorL get, set color-set
pramaters: an array color, for panel
return: chart
data: get, set data
pramaters: anarray as data set
return: chart
text: text filter
pramaters: a callback function
return: chart
style: get, set style
pramaters: a style object, by  css name - value 
return: chart
textStyle: get, set text style
pramaters: style object, set text style
return: chart
om: add a event listener
pramaters: event name, call backfunction
event name: click, mouseover, mouseout, mousemove
callback: a function width 2 pramater:  d, i
d: data element
i: index of data elemenh
this: event holder
return: chart
===========================================
usage:
html: <div> id="chart"></div>
js:
chart = Chart.pieChart();
you can also pre-define properties by, call method
chart = CHart.desPieChart()
    .width(500)
    .height(250)
    .data(dataset);
to update chart you can call
chart.data(newdata)
    .color(colorset);
*/
Chart.pieChart = function(){
    var width = 500,
        height = width,
        margin = 0,
        innerWidth = width - 2*margin,
        innerHeight = height - 2*margin,
        outerRadius = innerWidth/2,
        innerRadius = 0;
    var animate = 1000;    
    var colors = d3.scale.category20b();
    var data = [];
    
    var oneach,
        onclick,
        onmouseover,
        onmouseout,
        onmousemove;
        
    var visit,
        updateWidth,
        updateData;

    chart = function(selection){
        selection.each(function(){
            var arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);
            var pie = d3.layout.pie()
                .sort(null)
                .value(function(d){ return d.value; });
            var dom = d3.select(this);
            var svg = dom.append('svg')
                .attr('width', width)
                .attr('height', height)
                .attr('class', 'svg-pie');
            var g = svg.append('g')
                .attr('transform', 'translate(' + (margin +outerRadius) + ',' + (margin + outerRadius) +')');
            var garc = g.selectAll('.arc')
                .data(pie(data))
                .enter()
                .append('g')
                .attr('class', 'arc');
            var path = garc.append('path')
                .attr('d', arc)
                .style('fill', function(d, i){ return colors(i); })
                .each(function(d){ this._pie = d; }); 
             initEvent();     
            function initEvent(){
                path.on('click', function(d, i){
                    if(typeof onclick === 'function') onclick.call(this, data[i], i);
                });
                path.on('mouseover', function(d, i){
                    this.style.fill = d3.rgb(colors(i)).brighter();
                    if(typeof onmouseover === 'function') onmouseover.call(this, data[i], i);
                });
                path.on('mousemove', function(d, i){
                    if(typeof onmousemove === 'function') onmousemove.call(this, data[i], i);
                });
                path.on('mouseout', function(d, i){
                    this.style.fill = colors(i);
                    if(typeof onmouseout === 'function') onmouseout.call(this, data[i], i);
                });
            }
            visit = function(){
                if(typeof oneach !== 'function') return;
                path.each(function(d, i){
                    oneach.call(this, data[i], i);
                });
            }
            updateWidth = function(){
                arc.innerRadius(innerRadius)
                    .outerRadius(outerRadius);
                svg.transition()
                    .duration(animate)
                    .attr('width', width)
                    .attr('height', height);
                g.transition()
                    .duration(animate)
                    .attr('transform', 'translate(' + (margin +outerRadius) + ',' + (margin + outerRadius) +')');
                path.transition()
                    .duration(animate)
                    .attr('d', arc);
            };
            updateColor = function(){
                path.transition()
                    .duration(animate)
                    .style('fill', function(d, i){
                        return colors(i);
                    });
            }
            updateData = function(){
                if(data.length == garc[0].length){
                    function arcTween(a) {
                      var i = d3.interpolate(this._pie, a);
                      this._pie = i(0);
                      return function(t) {
                        return arc(i(t));
                      };
                    }
                    var update = garc.data(pie(data));
                    path = update.select('path')
                        .transition()
                        .duration(animate)
                        .attrTween('d', arcTween);
                } else {
                    garc.remove();
                    garc = g.selectAll('.arc')
                    .data(pie(data))
                    .enter()
                    .append('g')
                    .attr('class', 'arc');
                    path = garc.append('path')
                    .attr('d', arc)
                    .style('fill', function(d, i){ return colors(i); 
                    })
                    .each(function(d){ this._pie = d;});
                    initEvent();   
                }
            }
        });
    }

    chart.width = function(value){
        if(!arguments.length) return width;
        width = value;
        height = width,
        innerWidth = width - 2*margin,
        innerHeight = height - 2*margin,
        outerRadius = innerWidth/2,
        innerRadius = 0;
        if(typeof updateWidth === 'function') updateWidth();
        return chart;
    }

    chart.data = function(value){
        if(!arguments.length) return data;
        data = value;
        if(typeof updateData === 'function') updateData();
        return chart;
    }
    chart.margin = function(value){
        if(!arguments.length) return margin;
        margin = value;
        innerWidth = width - 2*margin,
        innerHeight = height - 2*margin,
        outerRadius = innerWidth/2,
        innerRadius = 0;
        if(typeof updateWidth === 'function') updateWidth();
        return chart;
    }
    chart.color = function(value){
        if(!arguments.length) return colors.range();
        if(!value.length) throw new Error("colors value must be an array");
        colors = d3.scale
            .ordinal()
            .domain([0, value.length])
            .range(value);
        if(typeof updateColor === 'function') updateColor();
        return chart;    
    }
    chart.on = function(event, callback){
        switch(event){
            case 'click': {
                onclick = callback;
            } break;
            case 'mouseover': {
                onmouseover = callback;
            } break;
            case 'mousemove':{
                onmousemove = callback;
            } break;
            case 'mouseout':{
                onmouseout = callback;
            } break;
            default: {
                throw new Error("event not defined");
            }
        }
        return chart;
    }
    chart.each = function(callback){
        if(!arguments.length) return oneach;
        oneach = callback;
        if(typeof visit === 'function') visit();
        return chart;
    }   
    return chart;
}

/*
this a stand-alone description panel, used as a chart component
constructor: return a genarater function
==============================================
method:
width: get, set panel width
pramaters: value for width
return: panel
height: get, set panel height
pramaters: value for hieght
return: panel
colorL get, set color-set
pramaters: an array color, for panel
return: cpanel
data: get, set data
pramaters: anarray as data set
return: panel
text: text filter
pramaters: a callback function
return: panel
style: get, set style
pramaters: a style object, by  css name - value 
return: panel
textStyle: get, set text style
pramaters: style object, set text style
return: panel
collum: get, set collum
pramaters: number of collum
return: panel
===========================================
usage:
html: <div> id="chart"></div>
js:
chart = Chart.desPieChart();
you can also pre-define properties by, call method
chart = CHart.desPieChart()
    .width(500)
    .height(250)
    .data(dataset);
to update chart you can call
chart.data(newdata)
    .color(colorset);
*/
Chart.component.descriptionPanel = function() {
    var width = 300,
        height = 150,
        margin = [4, 2],
        collum = 2,
        colors = d3.scale.category20b()
        type = 'svg',
        data = [],
        style = {
            fill: 'blue'
        },
        texStyle = {
            'fill': 'black',
            'font-size': 11 
        }
        animate = 1000;
    var itemPerCollum = Math.round(data.length/collum);
        innerWidth = width - 2*margin[0],
        innerHeight = height - 2*margin[1],
        itemWidth = innerWidth/collum,
        itemHeight = (data.length == 0)?innerHeight:(innerHeight/data.length)
        itemSpace = 2,
        collumSpace = 4
        rectWidth = innerWidth/5,
        rectHeight = innerHeight - itemSpace;

    var textFunc = function(d){
        return d.name;
    };         
    var updateSize,
        updateColor,
        updateData,
        updateText,
        updateTextStyle,
        updateStyle;    
    var panel = function(selection){
        selection.each(function(){
            var g = d3.select(this)
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .style(style);

            var gInner = g.append('g')
                .attr('width', innerWidth)
                .attr('height', innerHeight)
                .attr('transform', 'translate(' + 0 + ',' + 0 +')');

            var gItem = gInner.selectAll('.item')
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'item')
                .attr('width', itemWidth)
                .attr('height', itemHeight)
                .attr('transform', calcItemPos);

            var rect = gItem.append('rect')
                .attr('width', rectWidth)
                .attr('height', rectHeight)
                .attr('class', 'rect')
                .attr('transform', function(){
                    return 'translate(' + 0 + ',' + (itemSpace/2) + ')';
                })
                .style('fill', function(d, i){
                    return colors(i);
                });
            var text = gItem.append('text')
                .text(textFunc)
                .attr('transform', function(){

                    return 'translate(' + (rectWidth + 5) + ',' + rectHeight + ')';
                })
                .style(texStyle);        
            function calcItemPos(d, i){
                var col = Math.floor((i/itemPerCollum));
                var row = i%itemPerCollum;
                var dx = col*(itemWidth + collumSpace);
                var dy = row*(itemHeight) + 0;
                return 'translate(' + dx + ',' + dy + ')';  
            }         
            updateSize = function(){
                g.transition()
                    .duration(animate)
                    .attr('width', width)
                    .attr('height', height);
                gInner.transition()
                    .duration(animate)
                    .attr('width', innerWidth)
                    .attr('height', innerHeight)
                    .attr('transform', 'translate(' + margin[0] + ',' + margin[1] +')');
                gItem.transition()
                    .duration(animate)
                    .attr('width', itemWidth)
                    .attr('height', itemHeight)
                    .attr('transform', calcItemPos);
                rect.transition()
                    .duration(animate)
                    .attr('width', rectWidth)
                    .attr('height', rectHeight)
                    .attr('transform', function(){

                        return 'translate(' + 0 + ',' + (itemSpace/2) + ')';
                    });
                text.transition()
                    .duration(animate)
                    .attr('transform', function(){
                     return 'translate(' + (rectWidth + 5) + ',' + (rectHeight/1.5) + ')';
                    });
            };
            updateColor = function(){
                rect.style('fill', function(d, i){ return colors(i);})
            };
            updateData = function(){
                var update = gInner.selectAll('.item')
                    .data(data);

                update.attr('width', itemWidth)
                    .attr('height', itemHeight)
                    .attr('transform', calcItemPos);
                var newup = update.enter()
                    .append('g')
                    .attr('class', 'item')
                    .attr('width', itemWidth)
                    .attr('height', itemHeight)
                    .attr('transform', calcItemPos);

                newup.append('rect')
                .attr('width', rectWidth)
                .attr('height', rectHeight)
                .attr('class', 'rect')
                .attr('transform', function(){
                    return 'translate(' + 0 + ',' + (itemSpace/2) + ')';
                })
                .style('fill', function(d, i){
                    return colors(i);
                });

                newup.append('text')
                .text(textFunc)
                .attr('transform', function(){

                    return 'translate(' + (rectWidth + 5) + ',' + (rectHeight/1.5) + ')';
                })
                .style(texStyle);

                update.exit()
                    .remove();                 
            };

            updateText = function(){
                text.text(textFunc);
            };
            updateTextStyle = function(){
                text.style(texStyle);
            }
            updateStyle = function(){
                g.style(style);
            };
        });
    }
    function initData(){
        itemPerCollum = Math.round(data.length/collum);
        innerWidth = width - 2*margin[0];
        innerHeight = height - 2*margin[1];
        itemWidth = innerWidth/collum;
        itemHeight = innerHeight/itemPerCollum;
        itemSpace = 2;
        collumSpace = 4;
        rectWidth = itemWidth/5;
        rectHeight = itemHeight - itemSpace;
    }
    panel.width = function(value){
        if(!arguments.length) return width;
        width = value;
        initData();
        if(typeof updateSize === 'function') updateSize();
        return panel;
    };
    panel.height = function(value){
        if(!arguments.length) return height;
        height = value;
        initData();
        if(typeof updateSize === 'function') updateSize();
        return panel;
    }
    panel.data = function(value){
        if(!arguments.length) return data;
        data = value;
        initData();
        if(typeof updateData === 'function') updateData();
        return panel;
    }
    panel.collum = function(value){
        if(!arguments.length) return collum;
        collum = value;
        initData();
        if(typeof updateSize === 'function') updateSize();
        return panel;
    }   
    panel.color = function(value){
        if(!arguments.length) return colors.range();
        if(!value.length) throw new Error("colors value must be an array");
        colors = d3.scale
            .ordinal()
            .domain([0, value.length])
            .range(value);
        if(typeof updateColor === 'function') updateColor();
        return panel;
    }

    panel.texStyle = function(value){
        if(!arguments.length) return texStyle;
        texStyle = value;
        if(typeof updateTextStyle === 'function') updateTextStyle();
        return panel;
    }
    panel.style = function(value){
        if(!arguments.length) return style;
        style = value;
        if(typeof updateStyle === 'function') updateStyle();
        return panel;
    }
    panel.text = function(callback){
        if(!arguments.length) return textFunc;
        textFunc = callback;
        if(typeof updateText === 'function') updateText();
        return panel;
    }
    return panel;
};

Chart.desPieChart = function(){
    var width = 500,
        margin = [7, 5],
        data = [],
        colors = d3.scale.ordinal()
            .range(this.colors)
            .domain([0, this.colors.length]);
    
    var infoTitleFunc = function(d){
            return d.name;
        },
        infoContentFunc = function(d){
            return d.value;
        },
        desFunc = function(d){
            return d.name;
        },
        staticInfo ={
            title: "",
            content: ""
        };

    var height,
        pieWidth,
        pieHeight,
        descWidth, 
        desHeight,
        infoWidth, 
        infoHeight;

    var updateWidth,
        updateColor,
        updateDesc, 
        updateInfo;    
    var Chart = this;
    initData();        
    chart = function(selection){
        selection.each(function(){
            var dom = d3.select(this)
                .style('width', width + 'px')
                .style('height', height + 'px');    
  
            var divRight = dom.append('div')
                .style({
                    display: 'inline-block',
                    float: 'right'
                });
            var pie = Chart.pieChart().data(data).width(pieWidth).color(colors.range());
            dom.call(pie); 
            var info = divRight.append('div')
                .style({
                    width: infoWidth + 'px',
                    height: infoHeight + 'px',
                });
            var title = info.append('div')
                .style('font-size', '18px')
                .style('font-weight', 'bold')
                .style('text-align', 'center')
                .html(staticInfo.title);
            var content = info.append('div')
                .style('text-align', 'center')
                .html(staticInfo.content);


            pie.on('mouseover', function(d, i){
                var tit = infoTitleFunc.call(this, d);
                var cont = infoContentFunc.call(this, d);
                title.html(tit);
                content.html(cont)
            });
            pie.on('mouseout', function(d, i){
                title.html(staticInfo.title);
                content.html(staticInfo.content);
            });    
            var desc = Chart.component.descriptionPanel()
                .width(descWidth)
                .height(desHeight)
                .color(colors.range())
                .data(data);

            divRight.call(desc);

            updateData = function(){
                pie.data(data);
                desc.data(data);
            }
            updateWidth = function(){
                pie.width(pieWidth);
                des.width(descWidth);
                
                info.transition()
                    .duration(animate)
                    .style('width', infoWidth);
            }
            updateColor = function(value){
                pie.color(colors.domain());
                pie.color(colors.domain());
            }
            updateInfo = function(){
                title.html(staticInfo.title);
                content.html(staticInfo.content);
            }
            updateDesc = function(){

            }
        });
    }
    function initData(){
        height = width/1.5;
        pieWidth = width/1.5;
        pieHeight = pieWidth;
        descWidth = 0.3*width; 
        desHeight = 1*height/2;
        infoWidth = 0.3*width; 
        infoHeight = 1*height/2;
    };
    chart.width = function(value){
        if(!arguments.length) return width;
        width = value;
        initData();
        if(typeof updateWidth === 'function') updateWidth();
        return chart;
    };

    chart.margin = function(value){
        return chart;
    };
    chart.data = function(value){
        if(!arguments.length) return data;
        data = value;
        if(typeof updateData === 'function') updateData();
        return chart;
    };
    chart.color = function(){
        if(!arguments.length) return colors.range();
        if(!value.length) throw new Error("colors value must be an array");
        colors = d3.scale
            .ordinal()
            .domain([0, value.length])
            .range(value);
        if(typeof updateColor === 'function') updateColor();
        return chart;
    }
    chart.description = function(callback){
        if(!arguments.length) return desFunc;
        desFunc = callback;
        if(typeof updateDesc === 'function') updateDesc();
        return chart;
    }
    chart.staticInfo = function(title, content){
        if(!arguments.length) return staticInfo;
        staticInfo.title = title;
        staticInfo.content = content;
        if(typeof updateInfo === 'function') updateInfo();
        return chart;
    }
    chart.infoTitle = function(callback){
        if(!arguments.length) return infoTitleFunc;
        infoTitleFunc = callback;
        if(typeof updateInfo === 'function') updateInfo();
        return chart;
    }
    chart.infoContent = function(callback){
        if(!arguments.length) return infoContentFunc;
        infoContentFunc = callback;
        if(typeof updateInfo === 'function') updateInfo();
        return chart;
    }
    return chart;
}

/*
Chart.barChart use to creat a bar chart, base on d3js
================================
constructor: Chart.BarChar(options)
availble options:
options: {
    width: int, //chart width, 500 by default
    height; int, /chart height, 500 by default
    colors:  d3.scale, //function to init colors, Chart.colors by default
    fillColor: hexa color string, // background color, white by deault
    animate: int, // time duration of animation in milisecons, 1000 by default
    tooltip: false or Chart.Tooltip options (see Chart.tooltip)/ false by default
}
return a  chart genarater, invoke with d3.selection.call function
============================
we can update chart by sevaral function below:
width: get or set chart width
+pramaters: int
+return: chart instance

height: get or set chart height
+pramaters: int
+return: chart instance

data: get or set char dataset
+pramaters: an array of values to visual in the chart
++each data element has to have feilds: 
    dataNode{
        value: numberic value, //data value
        name: string, //full name of value
        label: string, //a label of data value, this field will be display as a tick in axis
    } 
we could also create some custom feild to dis play on  tooltip or to use leter;

tooltip: set tooltip option
+pamater: see Chart.Tooltip options, false to disable tooltip
+return: chart instance

getTooltip: get tooltip instance
return: tooltip instance
========================
usage:
html: <div id="chart"></div>
js:

var updatableChart = Chart.barChart().width(600).tooltip(true).data(dataset2)

d3.select('#chart')
    .call(updatableChart);

updateableChart.width(300);
updateableChart.width(dataset2);
*/
Chart.barChart = function(options) {
    if (typeof options === 'undefined') options = {};
    var width = options.width || 500,
        height = options.height || 500,
        colors = options.colors || d3.scale.category10(),
        fillColor = options.fillColor || 'white',
        animate = options.animate || 1000,
        data = [],
        xAxisHeight = 15,
        yAxisWidth = 50;

    var margin = width/ 70,
        innerWidth = width - 2 * margin,
        innerHeight = height - 2 * margin,
        chartWidth = innerWidth - yAxisWidth,
        chartHeight = innerHeight - xAxisHeight;
    var tooltip = options.tooltip || false,
        tip;

    var initTooltip,
        updateWidth,
        updateHeight,
        updateColor,
        updateData;

    function chart(selection){
        selection.each(function(){
            var maxValue = d3.max(data.map(function(d){
                return d.value;
            }));
            var xScale = d3.scale.ordinal()
                .domain(data.map(function(d) { return d.label; }))
                .rangeRoundBands([0, chartWidth], .1);

            var yScale = d3.scale.linear()
                .range([chartHeight, 0])
                .domain([0, maxValue]);  
        
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom');
            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .innerTickSize(-width)
                .outerTickSize(0)
                .tickPadding(10);
     
            var dom = d3.select(this);

            var svg = dom.append('svg')
                .attr('class', 'bar-chart')
                .attr('height', height)
                .attr('width', width)
                .style('fill', fillColor);

            var g = svg.append('g')
                .attr('width', innerWidth)
                .attr('height', innerHeight)
                .attr('transform', 'translate(' + margin + ',' + margin + ')');

            var gxAxis = g.append('g')
                .attr("class", "x edulevelAx")
                .attr("transform", "translate(" + yAxisWidth + "," + chartHeight + ")")
                .call(xAxis);

            var gyAxis = g.append('g')
                .attr("class", "y edulevelAx")
                .attr("transform", "translate(" + yAxisWidth + "," + 0 + ")")
                .call(yAxis); 
            var gbars = g.append('g')
                .attr('width', chartWidth)
                .attr('height', chartHeight)
                .attr('transform', 'translate(' + yAxisWidth + ',' + 0 + ')');

            initTooltip = function(){
                tip = Chart.component.Tooltip(tooltip);
                d3.select('body').call(tip);
            }  
            if(tooltip){
                initTooltip();
            }
            var bars = gbars.selectAll('rect.display-bar')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'display-bar')
                .attr('x', function(d){ return xScale(d.label); })
                .attr('y', function(d){ return yScale(d.value); })
                .attr('width', function(d){ return xScale.rangeBand(); })
                .attr('height', function(d){ return chartHeight - yScale(d.value); })
                .style('fill', function(d, i){ return colors(i); });  
                bars.on('mouseover', function(d, i){
                    this.style.fill = d3.rgb(colors(i)).darker();
                    if(tooltip){
                        tip.data(d, i);
                        tip.show();
                    }
                });
                bars.on('mousemove', function(){
                    if(tooltip){
                        var x = d3.event.pageX + 10,
                            y = d3.event.pageY + 10;
                        tip.move(x, y);    
                    }
                });
                bars.on('mouseout', function(d, i){
                    this.style.fill = colors(i);
                    if(tooltip){
                        tip.hide();
                    }
                });
  
            updateWidth = function(){
                xScale.rangeRoundBands([0, chartWidth], .1);
                gxAxis.transition()
                    .duration(animate)
                    .call(xAxis);
                svg.transition()
                    .duration(animate)
                    .attr('width', width);
                g.transition()
                    .duration(animate)
                    .attr('width', innerWidth)
                    .attr('transform', 'translate(' + margin + ',' + margin + ')');
                
                gbars.transition()
                    .duration(animate)
                    .attr('width', chartWidth);

                bars.data(data)
                    .transition()
                    .duration(animate)
                    .attr('x', function(d){ return xScale(d.label); })
                    .attr('width', function(d){ return xScale.rangeBand(); });   
            };

            updateHeight = function(){
                yScale.range([chartHeight, 0]);
                gyAxis.transition()
                    .duration(animate)
                    .call(yAxis);
                gxAxis.transition()
                    .duration(animate)
                    .attr("transform", "translate(" + yAxisWidth + "," + chartHeight + ")")
                svg.transition()
                    .duration(animate)
                    .attr('height', height);
                g.transition()
                    .duration(animate)
                    .attr('height', innerHeight);
                gbars.transition()
                    .duration(animate)
                    .attr('height', chartHeight);       
                bars.data(data)
                    .transition()
                    .duration(animate)
                    .attr('height', function(d){ return chartHeight - yScale(d.value)})
                    .attr('y', function(d){ return yScale(d.value); });  
            };

            updateColor = function(color){

            };

            updateData = function(){
                var maxValue = d3.max(data.map(function(d){
                    return d.value;
                }));
                yScale.domain([0, maxValue]);
                xScale.domain(data.map(function(d) { return d.label; }));

                gxAxis.call(xAxis);
                gyAxis.call(yAxis);

                var update = gbars.selectAll('rect.display-bar')
                    .data(data);

                update.transition()
                    .duration(animate)
                    .attr('height', function(d){ return chartHeight - yScale(d.value);})
                    .attr('y', function(d){ return yScale(d.value); });
                update.enter()
                    .append('rect')
                    .attr('class', 'display-bar')
                    .attr('x', function(d){ return xScale(d.label); })
                    .attr('y', function(d){ return yScale(d.value); })
                    .attr('width', function(d){ return xScale.rangeBand(); })
                    .attr('height', function(d){ return chartHeight - yScale(d.value); })
                    .style('fill', function(d, i){ return colors(i); });
                update.exit()
                    .transition()
                    .duration(.65 * animate)
                    .delay(function(d, i) {
                        return (data.length - i) * 20;
                    })
                    .style('opacity', 0)
                    .attr('height', 0)
                    .attr('x', 0)
                    .attr('width', 0)
                    .remove();            
            }
        });
    }

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        margin = width/ 70,
        innerWidth = width - 2 * margin,
        innerHeight = height - 2 * margin,
        chartWidth = innerWidth - yAxisWidth,
        chartHeight = innerHeight - xAxisHeight;
        if (typeof updateWidth === 'function') updateWidth();
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        innerHeight = height - 2 * margin,
        chartHeight = innerHeight - xAxisHeight;
        if (typeof updateHeight === 'function') updateHeight();
        return chart;
    };

    chart.fillColor = function(value) {
        if (!arguments.length) return fillColor;
        fillColor = value;
        if (typeof updateFillColor === 'function') updateFillColor();
        return chart;
    };

    chart.data = function(value) {
        if (!arguments.length) return data;
        data = value;
        if (typeof updateData === 'function') updateData();
        return chart;
    };

    chart.tooltip = function(options){
        if (!arguments.length) return tooltip;
        tooltip = options;
        if (typeof initTooltip === 'function') initTooltip();
        return chart;
    }
    chart.getTooltip = function(){
        return tip;
    }
    return chart;
}
/* Chart.component.Tooltip creat tooltip
constructor: Chart.component.Tooltip(options)
availble options:
TODO

a tooltip instance methodS:
show: show tip
hide: hide tip
move: move tip
data: set data
title: set title function which receive a data element and return  string (data member) to use as tooltip title
content: set content function which receive a data element and return  string (data member) to use as tooltip content
style: set style
*/
Chart.component.Tooltip = function(options) {
    var x, y ,width, height, data ,title, content;
    var titleCallback = function(d){
        return d.name;
    };
    var contentCallback = function(d){
        return d.value;
    };
    var showTip,
        hideTip,
        moveTip,
        setTitle,
        setContent,
        setStyle, 
        setSize;
    var tip = function(selection){
        selection.each(function(){
            var dom = d3.select(this);

            var divTip = dom.append('div').attr('class', 'tooltip');
            var divTitle = divTip.append('div')
                .html(title)
                .attr('class', 'tip-title');
            var divContent = divTip.append('div')
                .html(content)
                .attr('class', 'tip-content');

            showTip = function(){
                divTip.style({
                    display: 'block',
                    visibility: 'visible'
                });
            };

            hideTip = function(){
                 divTip.style({
                    display: 'none',
                    visibility: 'hidden'
                });
            };

            moveTip = function(){
                divTip.style({
                    top: y + 'px',
                    left: x + 'px'
                });
            };
            setTitle = function(){
                divTitle.html(title);
            };
            setContent = function(){
                divContent.html(content);
            };
            setStyle = function(style, value){
                divTip.style(style, value);
            }
            setSize = function(){
                divTip.style({
                    width: width,
                    height: height
                });
            }
        });        
    }

    tip.show = function(){
        showTip();
        return tip;
    };

    tip.hide = function(){
        hideTip();
        return tip;
    };

    tip.move = function(nx, ny){
        x = nx, y = ny;
        moveTip();
        return tip;
    };

    tip.content = function(callback){
        if(!arguments.length) return contentCallback;
        contentCallback = callback;
        return tip;
    };

    tip.title = function(callback){
        if(!arguments.length) return titleCallback;
        titleCallback = callback;
        return tip;
    };
    tip.data = function(value, index){
        title = titleCallback(value);
        content = contentCallback(value);
        setTitle();
        setContent();
        return tip;
    }

    tip.size = function(w, h){
        if(!arguments.length) return [width, height];
        width = w;
        height = h;
        setSize();
        return tip;
    };
    tip.style = function(style, value){
        setStyle(style, value);
        return tip;
    }

    return tip;
};
