class SCATTER_PLOT {
    constructor(container, chart, callback = function () { }) {
        this.container = container;//necessary
        this.callback = callback;
        this.data = chart.data;//necessary
        this.obj = chart;
        this.xrange = (function () {
            let [xmin, xmax] = [chart.data[0]['x'], 0];
            chart.data.map(n => {
                xmin > n.x && (xmin = n.x);
                xmax < n.x && (xmax = n.x);
            })
            return [xmin-xmin*0.05, xmax+xmax*0.05];
        })();//[40, 90];//necessary
        this.yrange = (function () {
            let [ymin, ymax] = [chart.data[0]['y'], 0];
            chart.data.map(n => {
                ymin > n.y && (ymin = n.y);
               ymax < n.y && (ymax = n.y);
            })
            return [ymin-ymin*0.05, ymax+ymax*0.05];

        })();// [140, 190];//necessary
        this.offset = { l: 70, t: 50, b: 90, r: 30 };//default
        this.viewbox = [0, 0, document.getElementById(container).clientWidth, document.getElementById(container).clientHeight];
        this.size = [document.getElementById(container).clientWidth, document.getElementById(container).clientHeight];
        this.ele = {};
        this.chart = null;
        this.points = {};
        this.error_message = [];
        this.theme = localStorage.getItem('Theme');
        this.raw_data = {};
        this.lowlight = {
            Shape: [],
            Color: []
        };



        console.time(2);
        this.init();
        console.timeEnd(2);
    }
      format() {
    var arg = arguments[0] || "";
    var arr = arguments[1] || []
    return arg.replace(/\{(\d+)\}/ig,
        function (a, b) {

            return arr[b] || "";
        });

}
dateFormat () {
    var dd = arguments[0] || new Date();//
    return this.format('{0}-{1}-{2} {3}:{4}:{5}',
        ['' + dd.getFullYear()
            , ('0' + (dd.getMonth() + 1)).slice(-2)
            , ('0' + dd.getDate()).slice(-2)
            , ('0' + dd.getHours()).slice(-2)
            , ('0' + dd.getMinutes()).slice(-2)
            , ('0' + dd.getSeconds()).slice(-2)

        ])
}
    init(reset_zoom_flag = false) {
        let that = this;
        that.chart = SVG().addTo('#' + that.container).size(...that.size).viewbox(...that.viewbox).attr({ id: that.container + "_svg", class: that.theme });
        let [a, b, c] = [[that.offset.l, that.offset.t], [that.offset.l, that.size[1] - that.offset.b],
        [that.size[0] - that.offset.r, that.size[1] - that.offset.b]];
        that.points = {
            a: a,
            b: b,
            c: c
        }

        //title

        that.chart.text(that.obj.title.text ? that.obj.title.text:'').move(that.viewbox[2] / 2, 5).font({
            fill: '#333',
            size: 16,
            family: 'Inconsolata',
            anchor: 'middle'
        }).attr('class', 'title');
        //subtitle
        that.chart.text(that.obj.subtitle.text ? that.obj.subtitle.text:'').move(that.viewbox[2] / 2, 28).font({
            fill: '#666',
            size: 12,
            family: 'Inconsolata',
            anchor: 'middle'
        });


        that.liney(a, b, c);
        that.linex(a, b, c);
        that.plot(a, b, c);
        that.legend();
        that.bind();
        that.square(this.container);
        if (reset_zoom_flag) {
            let zoom = document.createElement('BUTTON');
            zoom.setAttribute('class', 'zoom');
            zoom.innerText = 'Reset Zoom';
            zoom.onclick = function () {

                that.xrange = that.raw_data.xrange.concat();
                that.yrange = that.raw_data.yrange.concat();
                that.data = that.raw_data.data.concat();
                that.raw_data = {};
                document.getElementById(that.container).innerHTML = "";
                that.init();

            }
            document.getElementById(that.container).appendChild(zoom)
        }


        setTimeout(function () {
            if (that.theme == 'Dark') {
                document.getElementById(that.container).style.backgroundColor = '#373C47';
                [...document.querySelectorAll(`#${that.container} text`)].map(n => {

                    n.style.fill = '#ddd';
                })
            }

        }, 0)
    }
    bind() {

        let that = this;
        $('[point]').mouseover(function () {
            let target = event.target, id = target.getAttribute('id');
            let tooltip = "No message";
            try {//
                tooltip = that.data.filter(n => { return n.id == id })[0]['tooltip'].replace(/;/g, '<br/>');
            } catch (e) {
                that.error_message.push({
                    type: 'no tooltip',
                    target: id,
                    date: new Date

                })
            }

                $('#' + that.container).prepend(`        <div class="tag" id="tooltip">
          ${tooltip}
        </div>`);
                //+ $('#' + that.container).offset().top
            $('#tooltip').css({
                'top': target.getAttribute('y') - 75 + 'px',
                'left': target.getAttribute('x') - 30 + 'px'

            })
        })
        $('[point]').mouseout(function () {

            $('#tooltip').remove()
        })

    }
    legend() {
        let that = this;
        that.ele.legend = that.chart.group().attr('id', 'legend');
        //Shape: 'circle',
        //    Name: 'product Output',
        //        Color: '#409EFF'
        //{
        //    Shape: 'square',
        //        Name: 'Aging WIP'
        //}
        //    ,
        //{

        //    Name: 'Test',
        //        Color: '#67C23A'
        //}
        let distance = 20;
        that.obj.legend.map(n => {
            if (n.Color) {
                that.ele.legend.rect(10, 10).fill(n.Color).radius(3).move(distance, that.size[1] - 20).attr({
                    type: 'Color',
                    category: n.Color,
                    class:'legend'
                });
                distance += 15;
            } else if (n.Shape) {
                switch (n.Shape) {
                    case "circle":
                        that.ele.legend.circle(10).fill('steelblue').move(distance, that.size[1] - 20).attr({
                            type: 'Shape',
                            category: n.Shape,
                            class: 'legend'
                          
                        });
                        distance += 15;

                        break;
                    case "square":
                        that.ele.legend.rect(10, 10).fill('steelblue').move(distance, that.size[1] - 20).attr({
                            type: 'Shape',
                            category: n.Shape,
                            class: 'legend'
                        });
                        distance += 15;

                        break;
                    case "triangle":
                        that.ele.legend.polyline(`0,0 ${10},${10 * 1.414} ${-10 / 4},${10 * 1.414}`).fill('steelblue').move(distance, that.size[1] - 20).attr({
                            type: 'Shape',
                            category: n.Shape,
                            class: 'legend'
                        });
                        distance += 15;

                        break;
                }
            }
            
            that.ele.legend.text(n.Name).move(distance, that.size[1] - 22).font({ size: '12px', fill: n.Color });
            distance += 8 * n.Name.length;
        })
        that.ele.legend.transform({

            translateX: (that.size[0] - distance) / 2

        });

        //[...document.querySelectorAll('.legend')].map(n => {
        //    n.click = function () {
        //        let [type, category] = [n.getAttribute('type'), n.getAttribute('category')];
        //        console.log([type, category]);
        //    }
        //})

    }
    liney(a, b, c) {
        let that = this;
        that.ele.liney = that.chart.group().attr('id', 'liney');
        //   that.ele.liney.line(...a, ...b).stroke({ width: 2, color: '#555' });
        Array(11).fill(b[1]).map((n, i) => {
            let scale = n - (b[1] - a[1]) / 10 * i;
            that.ele.liney.line(that.offset.l - 10, scale, c[0], scale).stroke({ width: that.obj.yAxis.gridLineWidth, color: '#bbb' });
            that.ele.liney.text('' + (that.valueToPixel([b[1], a[1]], that.yrange, scale) | 0)).move(that.offset.l - 40, scale - 10).font({ size: '10px', fill: '#000', family: 'Inconsolata' });
            if (i == 10) {
                that.ele.liney.text('' + that.obj.yAxis.title).move(that.offset.l - 70, that.size[1] / 2 - ('' + that.obj.yAxis.title).length).font({ size: '10px', fill: '#000', family: 'Inconsolata' }).transform({rotate:270});//that.offset.l +20, scale -30
            }
            return scale;
        })
    }
    linex(a, b, c) {
        let that = this;
        that.ele.linex = that.chart.group().attr('id', 'linex');
        // that.ele.linex.line(...a, ...b).stroke({ width: 2, color: '#777' });
        that.ele.linex.line(...b, ...c).stroke({ width: 0.5, color: '#bbb' })

        Array(11).fill(c[0]).map((n, i) => {
            let scale = n - (c[0] - b[0]) / 10 * i;
            that.ele.linex.line(scale, b[1] + 10, scale, b[0]-20).stroke({ width: that.obj.xAxis.gridLineWidth, color: '#999' });
            let xName = that.valueToPixel([b[0], c[0]], that.xrange, scale);
            switch (that.obj.xAxis.category||"") {
                case "Date":
                    xName = that.dateFormat( new Date(xName));
                    break;
                default:
                    xName = '' + xName;
                    break;
            }
            that.ele.linex.text(xName).move(scale - 18, b[1] + 10).font({ size: '10px', fill: '#000', family: 'Inconsolata' });
            //scale - 18, b[1] + 10
            if (i == 0) {
                that.ele.linex.text('' + that.obj.xAxis.title).move(that.size[0] / 2 - xName.length, b[1]+20 ).font({ size: '10px', fill: '#000', family: 'Inconsolata' });
                //scale-28 , b[1] -20
            }
            return scale;
        })
    }
    plot(a, b, c,data=null) {
        let that = this;
        if (!data) { data = that.data; }

        data.map((n, i) => {
            //DisplayDataLabel
           
            if (that.obj.DisplayDataLabel) {
                try {
                    that.ele[n.id + '_text'] = that.chart.text(n.lable).move(that.valueToPixel(that.xrange, [b[0], c[0]], n.x) - n.lable.length * 2, that.valueToPixel(that.yrange, [b[1], a[1]], n.y) - 15).font({
                        size: '10px', fill: '#777', family: 'Inconsolata', shape: n.shape,
                        color: "_" + n.color.replace('#', '')
                    });
                } catch (e) {
                    that.error_message.push({
                        type: 'show label',
                        target: n.id,
                        date: new Date

                    })
                    if (that.error_message.length > 10000) {

                        that.error_message.shift();//止溢
                    }

                }
            }
            switch (n.shape) {
                case "square":
                    that.ele[n.id] = that.chart.rect(n.size / 4, n.size / 4).fill(n.color).move(that.valueToPixel(that.xrange, [b[0], c[0]], n.x) | 0, that.valueToPixel(that.yrange, [b[1], a[1]], n.y) | 0)
                        .attr({
                            id: n.id,
                            shape: n.shape,
                            color: "_" + n.color.replace('#',''),point:true
                            //weight: n.x,
                            //height: n.y
                        }).radius(n.size / 64)
                    break;
                case "triangle":
                    that.ele[n.id] = that.chart.polyline(`0,0 ${n.size / 4},${n.size / 4 * 1.414} ${-n.size / 4},${n.size / 4 * 1.414}`).fill(n.color).move(that.valueToPixel(that.xrange, [b[0], c[0]], n.x) | 0, that.valueToPixel(that.yrange, [b[1], a[1]], n.y) | 0)
                        .attr({
                            x: that.valueToPixel(that.xrange, [b[0], c[0]], n.x),
                            y: that.valueToPixel(that.yrange, [b[1], a[1]], n.y),
                            id: n.id,
                            shape: n.shape,
                            color: "_" + n.color.replace('#', ''), point: true
                        })
                    break;
                default:
                    that.ele[n.id] = that.chart.circle(n.size / 4).fill(n.color).move(that.valueToPixel(that.xrange, [b[0], c[0]], n.x) | 0, that.valueToPixel(that.yrange, [b[1], a[1]], n.y) | 0)
                        .attr({
                            x: that.valueToPixel(that.xrange, [b[0], c[0]], n.x),
                            y: that.valueToPixel(that.yrange, [b[1], a[1]], n.y),
                            id: n.id,
                            shape: n.shape,
                            color: "_" + n.color.replace('#', ''), point: true
                        })
                    break;
            }
        })






    }
    update(data,interval=4500) {
        let that = this;
        let [a, b, c] = [that.points.a, that.points.b, that.points.c];
        let newplot = [], oldplot = [];
        setTimeout(function () {
            that.data = JSON.parse(JSON.stringify(data));
            data.map((n, i) => { 
            if (!!that.ele[n.id]) {
                switch (n.shape) {
                    case "square":
                        that.ele[n.id].size(n.size / 4, n.size / 4);

                        break;
                    case "circle":
                        that.ele[n.id].radius(n.size / 4, n.size / 4);
                        break;
                    case "triangle":
                        that.ele[n.id].plot(`0,0 ${n.size / 4},${n.size / 4 * 1.414} ${-n.size / 4},${n.size / 4 * 1.414}`);
                        break;
                }
                }
            })

        }, interval);
     
        data.map((n, i) => {
            that.data.filter(a => { return a.id == n.id }).length==0 && newplot.push(n.id);
            try {
               !!that.ele[n.id] && that.ele[n.id].animate(interval).move(that.valueToPixel(that.xrange, [b[0], c[0]], n.x) | 0, that.valueToPixel(that.yrange, [b[1], a[1]], n.y) | 0);
                !!that.ele[n.id + '_text'] && that.ele[n.id + '_text'].animate(interval).move(that.valueToPixel(that.xrange, [b[0], c[0]], n.x) - n.lable.length * 2, that.valueToPixel(that.yrange, [b[1], a[1]], n.y) - 15);
            
                  
                //if (!!that.ele[n.id]) {
                //    switch (n.shape) {
                //        case "square":
                //            that.ele[n.id].animate(interval).move(that.valueToPixel(that.xrange, [b[0], c[0]], n.x) | 0, that.valueToPixel(that.yrange, [b[1], a[1]], n.y) | 0).size(n.size / 4, n.size / 4);

                //            break;
                //        case "circle":
                //            that.ele[n.id].animate(interval).move(that.valueToPixel(that.xrange, [b[0], c[0]], n.x) | 0, that.valueToPixel(that.yrange, [b[1], a[1]], n.y) | 0).radius(n.size / 4, n.size / 4);
                //            break;
                //        case "triangle":
                //            that.ele[n.id].animate(interval).move(that.valueToPixel(that.xrange, [b[0], c[0]], n.x) | 0, that.valueToPixel(that.yrange, [b[1], a[1]], n.y) | 0).plot(`0,0 ${n.size / 4},${n.size / 4 * 1.414} ${-n.size / 4},${n.size / 4 * 1.414}`);
                //            break;
                //    }
                //}




            } catch (e) {
                that.error_message.push({
                    type: 'run',
                    target: n.id,
                    date: new Date

                })
                if (that.error_message.length > 10000) {

                    that.error_message.shift();//止溢
                }
            }

        })
       
        //if exist new plot,render it  1113
        let extra_data = data.filter(n => {
            return newplot.includes(n.id)
        });
        console.log('extra', extra_data);
        that.plot(that.points.a, that.points.b, that.points.c, extra_data)

        //if a existed plot have no in new data ,remove it  1113
       data.map(n => {
            oldplot.push(n.id);
        })
        
        let disappear_data = that.data.filter(n => {
            return !oldplot.includes(n.id)
        })
        disappear_data.map(n => {
            that.ele[n.id].remove();
            that.ele[n.id+'_text'].remove();
        })
       
        console.log('disappear_data', extra_data);
    }
    valueToPixel(a = [0, 0], b = [1, 1], c = 1) {

        return Math.floor((c - a[0]) / ((a[1] - a[0]) / (b[1] - b[0])) + b[0])

    }
    pixelToValue(a = [0, 0], b = [1, 1], d = 1) {

        return (d - b[0]) * ((a[1] - a[0]) / (b[1] - b[0])) + a[0]

    }
    remove(arr,b) {
        var a = arr.indexOf(b);
        if (a >= 0) {
            arr.splice(a, 1);
            return true;
        }
        return false;
    };
    square(container, flag) {
        let that = this;
        if (flag == 'clear') {
            document.getElementById(container).onmouseup = function () { };
            document.getElementById(container).onmousedown = function () { };
            document.getElementById(container).onmousemove = function () { };
            return;
        }
        var wId = "w";
        var index = 0;
        var startX = 0, startY = 0;
        var flag = false;
        var retcLeft = "0px", retcTop = "0px", retcHeight = "0px", retcWidth = "0px";
        let [ax1, ax2, ay1, ay2, div] = [0, 0, 0, 0, null];
        document.getElementById(container).onmousedown = function (e) {
            flag = true;
            try {
                var evt = window.event || e;
                [ax1, ay1] = [evt.clientX, evt.clientY];

                var scrollTop = -$('#' + container).offset().top; //document.getElementById(container).scrollTop || document.documentElement.scrollTop;
                var scrollLeft = -$('#' + container).offset().left; //document.getElementById(container).scrollLeft || document.documentElement.scrollLeft;
                startX = evt.clientX + scrollLeft;
                startY = evt.clientY + scrollTop;
                index++;
                div = document.createElement("div");
                div.id = wId + index;
                div.className = "square";
                div.style.marginLeft = startX + "px";
                div.style.marginTop = startY + "px";
                document.getElementById(container).appendChild(div);
            } catch (e) {
                //alert(e);
            }
        }
        document.getElementById(container).onmouseup = function () {
            try {
                var evt = window.event || e;
                [ax2, ay2] = [evt.clientX, evt.clientY];
                let dd = Math.sqrt((ax1 - ax2) * (ax1 - ax2) + (ay1 - ay2) * (ay1 - ay2));
                if (dd < 10) {
                    //  document.getElementById(that.container).removeChild(div);
                    $('.square').remove();

                    let n = evt.target;
                    if ($(n).attr('point')) {
                        //click point
                        let id = n.getAttribute('id');
                        that.callback(that.data.filter(n => { return n.id === id  }))


                    }
                    switch ($(n).attr('class')) {

                        case "legend":
              let [type, category] = [n.getAttribute('type'), n.getAttribute('category')];
                            console.log([type, category]);

                            switch (type) {
                                case 'Shape':
                                    if ($(n).attr('flag') == 'lowlegend')//变亮
                                    {
                                        that.remove(that.lowlight.Shape, category);
                                        $(n).removeAttr('flag');

                                    } else
                                    {
                                        that.lowlight.Shape.push(category);
                                        $(n).attr('flag','lowlegend')
                                    }
                                    break;
                                case 'Color':
                                    if ($(n).attr('flag') == 'lowlegend')//变亮
                                    {
                                        that.remove(that.lowlight.Color, category);
                                        $(n).removeAttr('flag');

                                    } else {
                                        that.lowlight.Color.push(category); $(n).attr('flag', 'lowlegend');
                                    }
                                    break;
                                    

                            }

                            //循环
                            $('.lowlight').removeClass('lowlight');
                            that.lowlight.Shape.map(n => {
                                $(`[shape=${n}]`).addClass('lowlight');
                            })
                            that.lowlight.Color.map(n => {
                                $(`[color*=_${n.replace('#','')}]`).addClass('lowlight');
                            })
                            break;
                        default:
                            break;
                    }




                    return;
                }
                document.getElementById(container).removeChild(Q(wId + index));
                var div = document.createElement("div");
                div.className = "retc";
                div.style.marginLeft = retcLeft;
                div.style.marginTop = retcTop;
                div.style.width = retcWidth;
                div.style.height = retcHeight;
                let [x1, y1] = [+retcLeft.replace('px', ''), +retcTop.replace('px', '')],
                    [w, h] = [+retcWidth.replace('px', ''), +retcHeight.replace('px', '')],
                    [x2, y2] = [x1 + w, y1 + h],
                    [a, b, c] = [that.points.a, that.points.b, that.points.c]
                    ;
                [x1, y1, x2, y2] = [Math.ceil(that.pixelToValue(that.xrange, [b[0], c[0]], x1) ),
                that.pixelToValue(that.yrange, [b[1], a[1]], y1) | 0,
                Math.ceil(that.pixelToValue(that.xrange, [b[0], c[0]], x2)),
                Math.ceil(that.pixelToValue(that.yrange, [b[1], a[1]], y2))
                ]
                console.log(x1, y1, x2, y2);
                if (Object.keys(that.raw_data).length == 0) {
                    that.raw_data.xrange = that.xrange;
                    that.raw_data.yrange = that.yrange;
                    that.raw_data.data = JSON.parse(JSON.stringify(that.data))

                }
                that.xrange = [x1, x2];
                that.yrange = [y2, y1];
                that.data = _.filter(that.data, function (n) { return x1 < n.x < x2 && y2 < n.y < y1; })
                document.getElementById(that.container).innerHTML = "";
                that.init(true);

                //that.chart.animate(1500).viewbox(+retcLeft.replace('px', ''), +retcTop.replace('px', ''), +retcWidth.replace('px', ''), +retcHeight.replace('px', ''))
                //  document.getElementById(container).appendChild(div);
            } catch (e) {
                //alert(e);
            }
            flag = false;
        }
        document.getElementById(container).onmousemove = function (e) {
            if (flag) {
                try {
                    var evt = window.event || e;
                    var scrollTop = -$('#' + container).offset().top; // document.body.scrollTop || document.documentElement.scrollTop;
                    var scrollLeft = -$('#' + container).offset().left; // document.body.scrollLeft || document.documentElement.scrollLeft;
                    retcLeft = (startX - evt.clientX - scrollLeft > 0 ? evt.clientX + scrollLeft : startX) + "px";
                    retcTop = (startY - evt.clientY - scrollTop > 0 ? evt.clientY + scrollTop : startY) + "px";
                    retcHeight = Math.abs(startY - evt.clientY - scrollTop) + "px";
                    retcWidth = Math.abs(startX - evt.clientX - scrollLeft) + "px";
                    Q(wId + index).style.marginLeft = retcLeft;
                    Q(wId + index).style.marginTop = retcTop;
                    Q(wId + index).style.width = retcWidth;
                   Q(wId + index).style.height = retcHeight;
                } catch (e) {
                    //alert(e);
                }
            }
        }
        var Q = function (id) {
            return document.getElementById(id);
        }
    }
}