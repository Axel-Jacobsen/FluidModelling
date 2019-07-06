'use strict'

class Geometry {
    constructor(A, B) {
        self.A = A;
        self.B = B;
    }
    position_on_rotation(theta, xs, ys) {
        if (xs.length !== ys.length) {
            console.log('length of xs and ys must be equal');
            return false;
        }
        const xs_new = [];
        const ys_new = [];
        for (let i = 0; i < xs.length; i++) {
            let x = xs[i];
            let y = ys[i];
            let r = Math.sqrt(x * x + y * y);
            let f = theta * A * A / (B * B - A * A) * (B * B / r - r);
            xs_new.push(-Math.sin(theta) * f + x);
            ys_new.push(Math.cos(theta) * f + y);
        }
        return [xs_new, ys_new];
    }
    circ(N, x0 = 0, y0 = 0, scale = 1) {
        let xs = [];
        let ys = [];
        for (let i = 0; i < N; i++) {
            xs.push(Math.cos(2 * Math.PI * i / N) * scale + x0);
            ys.push(Math.sin(2 * Math.PI * i / N) * scale + y0);
        }
        return [xs, ys];
    }
}


const A = 2
const B = 10
let THETA = 0

const get_data = () => {
    const geo = new Geometry(A, B)
    let circle = geo.circ(1000, 3, 3)
    let rotated_circle = geo.position_on_rotation(THETA, circle[0], circle[1])


    const inner_circle = {
        x: geo.circ(100, 0, 0, A)[0],
        y: geo.circ(100, 0, 0, A)[1]
    }

    const outer_circle = {
        x: geo.circ(100, 0, 0, B)[0],
        y: geo.circ(100, 0, 0, B)[1]
    }

    const r0 = {
        x: circle[0],
        y: circle[1]
    }

    const r_rotated = {
        x: rotated_circle[0],
        y: rotated_circle[1],
        type: 'markers'
    }

    return [inner_circle, outer_circle, r0, r_rotated]
}

const DATA = get_data()

const layout = {
    autosize: true,
    width: 600,
    height: 600,
    show_legend: false,
    xaxis: {
        constrain: 'domain',
        range: [-11, 11]
    },
    yaxis: {
        scaleanchor: 'x',
        range: [-11, 11]
    }
}

document.onkeypress = e => {

    e = e || window.event

    // u = 117, d = 100
    if (e.keyCode === 117) {
        THETA = THETA + 0.1
    } else if (e.keyCode === 100) {
        THETA = THETA - 0.1
    } else {
        return
    }

    let div = document.getElementById('theta');
    div.innerHTML = THETA;

    DATA[3] = {
        x: get_data()[3].x,
        y: get_data()[3].y
    }

    Plotly.redraw('chart')
}

Plotly.newPlot('chart', DATA, layout)
