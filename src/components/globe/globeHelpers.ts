import * as d3 from 'd3';
import * as THREE from 'three';

export function pointInPolygon(poly, point) {

    const x = point[0];
    const y = point[1];

    let inside = false;
    let xi;
    let xj;
    let yi;
    let yj;
    let xk;

    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        xi = poly[i][0];
        yi = poly[i][1];
        xj = poly[j][0];
        yj = poly[j][1];

        xk = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (xk) {
            inside = !inside;
        }
    }

    return inside;
}

export function getCenterPoint(face, vertices) {
    return {
        x: getAverage(face, vertices, 'x'),
        y: getAverage(face, vertices, 'y'),
        z: getAverage(face, vertices, 'z'),
    };
}

function getAverage(face, vertices, axis: string) {
    return (vertices[face.a][axis] + vertices[face.b][axis] + vertices[face.c][axis]) / 3;
}

export function mapTexture(geojson, mountingElement, color = 'rgba(255, 255, 255, 0)') {
    const projection = d3.geoEquirectangular()
        .translate([1024, 512])
        .scale(325);

    const canvas = d3.select(mountingElement).append('canvas')
        .style('display', 'none')
        .attr('width', '2048px')
        .attr('height', '1024px');

    const context = canvas.node().getContext('2d');

    const path = d3.geoPath(projection, context);

    context.strokeStyle = '#333';
    context.lineWidth = 1;
    context.fillStyle = color;

    context.beginPath();

    path(geojson);

    context.fill();

    context.stroke();

    const texture = new THREE.CanvasTexture(canvas.node());

    canvas.remove();

    return texture;
}
