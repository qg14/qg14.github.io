const ratio = 1, cardinal_number = 80;// control node size and top-margin


let sprint = {
    l0: {
        name: "Pathfinding",
        offset: 0 * cardinal_number,
        nodes: [{
            id: 'α', color: 'gray-0.5', sub_left: "Product"
        }, {
            id: 'β', color: 'gray-0.5'
        }, {
            id: 'γ', color: 'gray-0.5'
        }]
    },
    l1: {
        name: "Designer",
        offset: 1 * cardinal_number,
        nodes: [{
            id: 'A', color: 'blue', deliverable: 'A-a', sup_left: "A0"
        }, {
            id: 'B', color: 'blue', deliverable: 'B-a', sup_left: "E0"
        }, {
            id: 'C', color: 'blue', deliverable: 'C-a', sup_left: "E1", sup_right: "E2"
        }]
    },
    l2: {
        name: "ERA",
        offset: 2 * cardinal_number,
        nodes: [{
            id: '0', color: 'gray-0.5'
        }, {
            id: '1', color: 'blue', deliverable: '1-L2-a 1-L2-b 1-L2-c\n1-L2-d 1-L2-e\n1-L2-f 1-L2-g'
            , sup_left: "E3"

        }, {
            id: '2', color: 'blue', deliverable: '2-L2-a 2-L2-b 2-L2-c\n2-L2-d 2-L2-e 2-L2-f\n2-L2-g 2-L2-h 2-L2-i', ball: 'yellow'
        }, {
            id: '3', color: 'blue', deliverable: '3-L2-a 3-L2-b 3-L2-c\n3-L2-d3-L2-e\n3-L2-f 3-L2-g', ball: 'yellow'
        }, {
            id: '4', color: 'gray-0.5'
        }]
    },
    l3: {
        name: "TRA",
        offset: 3 * cardinal_number,
        nodes: [{
            id: 'D2', color: 'blue', deliverable: 'D1-a\nD2-a', sup_left: "D1"
        }, {
            id: '13', color: 'green', deliverable: '13-a\n13-b\n13-c'
        }, {
            id: '14', color: 'blank', deliverable: '14-a\n14-b'
        }, {
            id: '15', color: 'blank', deliverable: '15-a\n15-b', sup_right: "HVM"
        }]
    }
}
let COLOR = {
    'red': 0x9e2e23,
    'yellow': 0xe2af42,
    'blue': 0x418ab3,
    'green': 0x407d53,
    'blank': 0x404140,
    'grey': 0xa5a5a5
}//0xDAE4E6


function generator_arrow(click_object, v_type, dates=[{ "PRODUCT_START": "2021-10-06", "TTM_DUE": "2021-02-13", "PRODUCT_DONE": "2021-10-22" }]) {
   


    sprint.l1.nodes[2].sup_center = null;
    sprint.l2.nodes[2].sup_center = null;
    sprint.l3.nodes[1].sup_center = null;
    switch (v_type) {
        case "Source":
            sprint.l1.nodes[2].sup_center = 'Sara';
            break;
        case "Process":
            sprint.l2.nodes[2].sup_center = 'Izzie';
            break;
        case "Input":
            sprint.l2.nodes[2].sup_center = 'Jacky\nLinda';
            break;
        case "Customer":
            sprint.l3.nodes[1].sup_center = 'DH JD\nShinlun';
            
            break;

    }

    var group = new THREE.Group();
    Object.keys(sprint).map((s, i) => { 
    
    var arrow_text = new THREE.Group();
    var arrow_body = new THREE.Group();
    sprint[s].nodes.map((n, index) => {
        /*
         @[n] node item
         @[index] node index
         @[counter]
         */
        let [left, top, before] = [
            sprint[s].offset + index * ratio * cardinal_number * 1.5,
            i * cardinal_number * ratio,
            i * cardinal_number * ratio
        ];
        // ratio = 1, depth = 5, material
        /*************************   x-y axis    ******************************* */
        /////////////add   arrow

        var arrow = arrow_generator(1, n.color.includes('-') ? null : 10, (c => {
            let [color, opicity] = (c + '-1').split('-'); opicity = + opicity;
            //MeshPhongMaterial
            //MeshLambertMaterial
            return new THREE.MeshPhongMaterial({
                color: COLOR[color], side: THREE.FrontSide,
                //opacity: opicity,
                wireframe: opicity != 1
                // transparent: opicity != 1,
            });

        })(n.color));
        arrow.position.x = left;

        arrow.position.y = top;
        arrow.position.z = -15;
        arrow_body.add(arrow);
        /////////////add   symbol
        var symbol = text_3d(n.id, 20, 3, n.ball ? COLOR.yellow : 0xffffff);
        symbol.position.x = left + 50;

        symbol.position.y = top + 13;
        symbol.position.z = 1;
        //1217
        arrow_text.add(symbol);
        /////////////add   left right symbol
        if (n.sup_left) {
            var symbol_left = text_3d(n.sup_left, 20, 3)
            symbol_left.position.x = left;

            symbol_left.position.y = top + 48;//40
            symbol_left.position.z = 1;
            arrow_text.add(symbol_left);
        }
        if (n.sub_left) {
            var symbol_left = text_3d(n.sub_left, 20, 3)
            symbol_left.position.x = left;

            symbol_left.position.y = top-34;//40
            symbol_left.position.z = 1;
            arrow_text.add(symbol_left);
        }
        if (n.sup_right) {
            var symbol_right = text_3d(n.sup_right, 20, 3)
            symbol_right.position.x = left + cardinal_number * ratio;

            symbol_right.position.y = top + 40;
            symbol_right.position.z = 1;
            arrow_text.add(symbol_right);
        }

        if (n.sup_center) {
            let symbol_center = text_3d(n.sup_center, 14, 3)
            symbol_center.position.x = left;

            symbol_center.position.y = top + 30;
            symbol_center.name = v_type + "_" + n.id;
            symbol_center.position.z = 1;
            click_object.push(symbol_center);

            arrow_text.add(symbol_center);
        }







    })
    group.add(arrow_body);
        group.add(arrow_text);
        let m1 = new THREE.Mesh(new THREE.CylinderGeometry(8, 0, 12, 18, 3), new THREE.MeshStandardMaterial({
            color: 0xf85051,
            roughness: .9,
            emissive: COLOR['green'],
            flatShading : THREE.FlatShading
        }))
        m1.position.x = 80;
        m1.position.z = -2;
        m1.position.y = 3; m1.name = "milestone_1";
        group.add(m1);
        var ms1 = text_3d(familiar(dates[0]['PRODUCT_START']),10);
        ms1.position.set(60+30,2,-2);
        group.add(ms1);
        let m2 = new THREE.Mesh(new THREE.CylinderGeometry(8, 0, 12, 18, 3), new THREE.MeshStandardMaterial({
            color: 0xf85051,
            roughness: .9,
            emissive: COLOR['green'],
            flatShading : THREE.FlatShading
        }))
        m2.position.z = -2; m2.position.x = 120 * 6; m2.position.y = 3; m2.name = "milestone_3";
        group.add(m2);
        var ms2 = text_3d(familiar(dates[0]['TTM_DUE']),10);
        ms2.position.set(120*5+10, 2, -2);
        group.add(ms2);
        let m3 = new THREE.Mesh(new THREE.CylinderGeometry(8, 0, 12, 18, 3), new THREE.MeshStandardMaterial({
            color: 0xf85051,
            roughness: .9,
            emissive: COLOR['green'],
            flatShading : THREE.FlatShading
        }))
        m3.position.z = -2; m3.position.x = 120 * 5; m3.position.y = 3; m3.name = "milestone_2";
        group.add(m3);
        var ms3 = text_3d(familiar(dates[0]['PRODUCT_DONE']),10);
        ms3.position.set(120 * 6 +10, 2, -2);
        group.add(ms3);
       // click_object.push(m1); click_object.push(m2); click_object.push(m3);
    })
   
    return group;
}
function familiar(d = '2011-01-01') {

    let m = [][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]][([][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]] + [])[!+[] + !+[] + !+[]] + (!![] + [][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]])[+!+[] + [+[]]] + ([][[]] + [])[+!+[]] + (![] + [])[!+[] + !+[] + !+[]] + (!![] + [])[+[]] + (!![] + [])[+!+[]] + ([][[]] + [])[+[]] + ([][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]] + [])[!+[] + !+[] + !+[]] + (!![] + [])[+[]] + (!![] + [][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]])[+!+[] + [+[]]] + (!![] + [])[+!+[]]]((!![] + [])[+!+[]] + (!![] + [])[!+[] + !+[] + !+[]] + (!![] + [])[+[]] + ([][[]] + [])[+[]] + (!![] + [])[+!+[]] + ([][[]] + [])[+!+[]] + ([] + [])[(![] + [])[+[]] + (!![] + [][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]])[+!+[] + [+[]]] + ([][[]] + [])[+!+[]] + (!![] + [])[+[]] + ([][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]] + [])[!+[] + !+[] + !+[]] + (!![] + [][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]])[+!+[] + [+[]]] + (![] + [])[!+[] + !+[]] + (!![] + [][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]])[+!+[] + [+[]]] + (!![] + [])[+!+[]]]()[+!+[] + [!+[] + !+[]]] + ([+[]] + (!![] + [])[+[]] + [+!+[]] + [+!+[]] + [!+[] + !+[]] + (![] + [])[+!+[]] + ([][[]] + [])[+!+[]] + [+[]] + (!![] + [])[+[]] + [+!+[]] + [+[]] + [!+[] + !+[] + !+[] + !+[] + !+[] + !+[]] + (!![] + [])[!+[] + !+[] + !+[]] + (!![] + [])[+[]] + [+!+[]] + [!+[] + !+[] + !+[] + !+[]] + [!+[] + !+[]] + [+[]] + (!![] + [])[+[]] + [+!+[]] + [+!+[]] + [!+[] + !+[] + !+[] + !+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+!+[]] + [+[]] + (!![] + [])[+[]] + [+!+[]] + [+[]] + [+!+[]] + (!![] + [])[+[]] + [+!+[]] + [!+[] + !+[] + !+[] + !+[] + !+[] + !+[]] + [+[]] + (!![] + [])[+!+[]] + [+[]] + (!![] + [])[+[]] + [+!+[]] + [+!+[]] + [!+[] + !+[] + !+[] + !+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]] + [+!+[]] + [!+[] + !+[] + !+[] + !+[] + !+[] + !+[] + !+[]] + [+!+[]] + [+[]] + (!![] + [])[+[]] + [+!+[]] + [+!+[]] + [!+[] + !+[]] + ([][[]] + [])[+[]] + ([][[]] + [])[+!+[]] + [+[]] + (!![] + [])[+[]] + [+!+[]] + [+!+[]] + [!+[] + !+[]] + ([][[]] + [])[+[]] + (![] + [])[!+[] + !+[]] + [+[]] + (!![] + [])[+[]] + [+!+[]] + [+[]] + [+!+[]] + ([][[]] + [])[+[]] + (!![] + [])[+[]] + [+!+[]] + [!+[] + !+[] + !+[] + !+[]] + [!+[] + !+[] + !+[] + !+[] + !+[] + !+[] + !+[]] + [+[]] + (!![] + [])[+[]] + [+!+[]] + [!+[] + !+[]] + [!+[] + !+[] + !+[]] + (!![] + [])[!+[] + !+[] + !+[]] + (!![] + [])[+[]] + [+!+[]] + [!+[] + !+[] + !+[] + !+[] + !+[] + !+[]] + [+[]] + [+[]] + (!![] + [])[+[]] + [+!+[]] + [+!+[]] + [!+[] + !+[] + !+[] + !+[] + !+[] + !+[] + !+[]] + (!![] + [])[+[]] + [+!+[]] + [!+[] + !+[] + !+[] + !+[]] + [!+[] + !+[] + !+[]] + (!![] + [])[+[]] + [+!+[]] + [!+[] + !+[] + !+[] + !+[] + !+[] + !+[]] + [!+[] + !+[] + !+[] + !+[]] + [+[]] + (+[![]] + [])[+[]] + (!![] + [])[+[]] + [+!+[]] + [!+[] + !+[] + !+[] + !+[] + !+[]] + [!+[] + !+[] + !+[] + !+[] + !+[] + !+[] + !+[]] + (!![] + [])[+[]] + [+!+[]] + [!+[] + !+[] + !+[] + !+[] + !+[] + !+[]] + [!+[] + !+[] + !+[] + !+[] + !+[] + !+[]] + [+[]] + (!![] + [])[+[]] + [+!+[]] + [+[]] + [!+[] + !+[] + !+[] + !+[]] + (!![] + [])[!+[] + !+[] + !+[]] + (!![] + [])[+[]] + [+!+[]] + [!+[] + !+[] + !+[] + !+[]] + [!+[] + !+[] + !+[]])[(![] + [])[!+[] + !+[] + !+[]] + (+(!+[] + !+[] + [+!+[]] + [+!+[]]))[(!![] + [])[+[]] + (!![] + [][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]])[+!+[] + [+[]]] + ([] + [])[([][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]] + [])[!+[] + !+[] + !+[]] + (!![] + [][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]])[+!+[] + [+[]]] + ([][[]] + [])[+!+[]] + (![] + [])[!+[] + !+[] + !+[]] + (!![] + [])[+[]] + (!![] + [])[+!+[]] + ([][[]] + [])[+[]] + ([][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]] + [])[!+[] + !+[] + !+[]] + (!![] + [])[+[]] + (!![] + [][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]])[+!+[] + [+[]]] + (!![] + [])[+!+[]]][([][[]] + [])[+!+[]] + (![] + [])[+!+[]] + ((+[])[([][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]] + [])[!+[] + !+[] + !+[]] + (!![] + [][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]])[+!+[] + [+[]]] + ([][[]] + [])[+!+[]] + (![] + [])[!+[] + !+[] + !+[]] + (!![] + [])[+[]] + (!![] + [])[+!+[]] + ([][[]] + [])[+[]] + ([][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]] + [])[!+[] + !+[] + !+[]] + (!![] + [])[+[]] + (!![] + [][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]])[+!+[] + [+[]]] + (!![] + [])[+!+[]]] + [])[+!+[] + [+!+[]]] + (!![] + [])[!+[] + !+[] + !+[]]]](!+[] + !+[] + !+[] + [+!+[]])[+!+[]] + (![] + [])[!+[] + !+[]] + ([![]] + [][[]])[+!+[] + [+[]]] + (!![] + [])[+[]]]((!![] + [])[+[]])[([][(!![] + [])[!+[] + !+[] + !+[]] + ([][[]] + [])[+!+[]] + (!![] + [])[+[]] + (!![] + [])[+!+[]] + ([![]] + [][[]])[+!+[] + [+[]]] + (!![] + [])[!+[] + !+[] + !+[]] + (![] + [])[!+[] + !+[] + !+[]]]() + [])[!+[] + !+[] + !+[]] + (!![] + [][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]])[+!+[] + [+[]]] + ([![]] + [][[]])[+!+[] + [+[]]] + ([][[]] + [])[+!+[]]](([][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]][([][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]] + [])[!+[] + !+[] + !+[]] + (!![] + [][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]])[+!+[] + [+[]]] + ([][[]] + [])[+!+[]] + (![] + [])[!+[] + !+[] + !+[]] + (!![] + [])[+[]] + (!![] + [])[+!+[]] + ([][[]] + [])[+[]] + ([][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]] + [])[!+[] + !+[] + !+[]] + (!![] + [])[+[]] + (!![] + [][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]])[+!+[] + [+[]]] + (!![] + [])[+!+[]]]((!![] + [])[+!+[]] + (!![] + [])[!+[] + !+[] + !+[]] + (!![] + [])[+[]] + ([][[]] + [])[+[]] + (!![] + [])[+!+[]] + ([][[]] + [])[+!+[]] + (![] + [+[]])[([![]] + [][[]])[+!+[] + [+[]]] + (!![] + [])[+[]] + (![] + [])[+!+[]] + (![] + [])[!+[] + !+[]] + ([![]] + [][[]])[+!+[] + [+[]]] + ([][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]] + [])[!+[] + !+[] + !+[]] + (![] + [])[!+[] + !+[] + !+[]]]()[+!+[] + [+[]]] + ![] + (![] + [+[]])[([![]] + [][[]])[+!+[] + [+[]]] + (!![] + [])[+[]] + (![] + [])[+!+[]] + (![] + [])[!+[] + !+[]] + ([![]] + [][[]])[+!+[] + [+[]]] + ([][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]] + [])[!+[] + !+[] + !+[]] + (![] + [])[!+[] + !+[] + !+[]]]()[+!+[] + [+[]]])()[([][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]] + [])[!+[] + !+[] + !+[]] + (!![] + [][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]])[+!+[] + [+[]]] + ([][[]] + [])[+!+[]] + (![] + [])[!+[] + !+[] + !+[]] + (!![] + [])[+[]] + (!![] + [])[+!+[]] + ([][[]] + [])[+[]] + ([][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]] + [])[!+[] + !+[] + !+[]] + (!![] + [])[+[]] + (!![] + [][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]])[+!+[] + [+[]]] + (!![] + [])[+!+[]]]((![] + [+[]])[([![]] + [][[]])[+!+[] + [+[]]] + (!![] + [])[+[]] + (![] + [])[+!+[]] + (![] + [])[!+[] + !+[]] + ([![]] + [][[]])[+!+[] + [+[]]] + ([][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]] + [])[!+[] + !+[] + !+[]] + (![] + [])[!+[] + !+[] + !+[]]]()[+!+[] + [+[]]]) + [])[+!+[]]) + ([] + [])[(![] + [])[+[]] + (!![] + [][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]])[+!+[] + [+[]]] + ([][[]] + [])[+!+[]] + (!![] + [])[+[]] + ([][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]] + [])[!+[] + !+[] + !+[]] + (!![] + [][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]])[+!+[] + [+[]]] + (![] + [])[!+[] + !+[]] + (!![] + [][(![] + [])[+[]] + (![] + [])[!+[] + !+[]] + (![] + [])[+!+[]] + (!![] + [])[+[]]])[+!+[] + [+[]]] + (!![] + [])[+!+[]]]()[+!+[] + [!+[] + !+[]]])(); m = m.split('0'); d = d.split('-');
    return `${m[+d[1]]}/${d[2]}'${d[0].slice(-2)}`;
}
function text_3d(text = "", size = 4, height = 0.1, color = 0xffffff, border_color = 0xd5d5d5) {
    let that = this;
    //220111
    // text = "1";
    var textGeo = new THREE.TextGeometry(text, {
        font: font,
        size: size,
        height: height

    });

    textGeo.computeBoundingBox();

    const centerOffset = - 0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

    return new THREE.Mesh(textGeo, [
        new THREE.MeshPhongMaterial({ color: color, flatShading: true, side: THREE.FrontSide }), // front
        new THREE.MeshPhongMaterial({ color: border_color, side: THREE.FrontSide  }) // side
    ]);
}
function arrow_generator(ratio = 1, depth = 5, material) {
    let that = this;
    var rectShape = new THREE.Shape();
    rectShape.moveTo(0, 0);


    rectShape.lineTo(100 * ratio, 0);
    rectShape.lineTo(120 * ratio, 20 * ratio);
    rectShape.lineTo(100 * ratio, 40 * ratio);
    rectShape.lineTo(0, 40 * ratio);
    rectShape.lineTo(20 * ratio, 20 * ratio);
    rectShape.lineTo(0, 0);
    //MeshPhongMaterial
    //ExtrudeGeometry
    var geometry1 = new THREE.ExtrudeGeometry(//拉伸造型
        rectShape,//二维轮廓
        //拉伸参数
        {
            depth: depth,
            bevelEnabled: false
        });

    return new THREE.Mesh(geometry1, material);

}

