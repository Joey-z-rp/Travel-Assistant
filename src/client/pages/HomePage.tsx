import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as THREE from 'three';
import * as OrbitControls from 'three-orbitcontrols';
import * as d3 from 'd3';
import { feature as topojsonFeature } from 'topojson';

const mapStateToProps = () => ({
});

const mapDispatchToProps = () => ({

});

class HomePage extends React.Component {
    private mount;
    private scene;
    private camera;
    private renderer;
    private frameId;
    private earth;

    async componentDidMount() {
        const worldMap = await d3.json('public/world.json');

        const getCenterPoint = (face, geometry) => {
            return {
                x: (geometry.vertices[face.a].x + geometry.vertices[face.b].x + geometry.vertices[face.c].x) / 3,
                y: (geometry.vertices[face.a].y + geometry.vertices[face.b].y + geometry.vertices[face.c].y) / 3,
                z: (geometry.vertices[face.a].z + geometry.vertices[face.b].z + geometry.vertices[face.c].z) / 3,
            };
        };

        console.log({ worldMap });

        const countries = topojsonFeature(worldMap, worldMap.objects.countries);

        console.log({ countries });

        // for (let i = 0; i < countries.features.length; i++) {
        //     store[countries.features[i].id] = countries.features[i];
        // }

        const segments = 150;

        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const localPoint = new THREE.Vector3();
        const spherical = new THREE.Spherical();

        // ADD SCENE
        this.scene = new THREE.Scene();

        // ADD CAMERA
        this.camera = new THREE.PerspectiveCamera(
            70,
            width / height,
            1,
            5000,
        );
        this.camera.position.z = 1000;

        // Light
        const light = new THREE.HemisphereLight('#ffffff', '#666666', 1.5);
        light.position.set(0, 1000, 0);
        this.scene.add(light);

        // ADD RENDERER
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.mount.appendChild(this.renderer.domElement);

        // Base globe
        const sphere = new THREE.SphereGeometry(200, segments, segments);
        const blueMaterial = new THREE.MeshPhongMaterial({ color: '#2B3B59', transparent: true });
        const baseGlobe = new THREE.Mesh(sphere, blueMaterial);


        const pointInPolygon = (poly, point) => {

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
        };

        const store = sphere.faces.reduce((acc, face) => {
            const centerPoint = getCenterPoint(face, sphere);
            const localPoint = new THREE.Vector3(centerPoint.x, centerPoint.y, centerPoint.z);

            spherical.setFromVector3(localPoint);
            const lat = THREE.Math.radToDeg(Math.PI / 2 - spherical.phi);
            const lon = THREE.Math.radToDeg(spherical.theta);

            let match = false;

            let country;
            let coords;

            let result;

            for (let i = 0; i < countries.features.length; i++) {
                country = countries.features[i];
                if (country.geometry.type === 'Polygon') {
                    match = pointInPolygon(country.geometry.coordinates[0], [lon, lat]);
                    if (match) {
                        result = {
                            code: countries.features[i].id,
                            name: countries.features[i].properties.name,
                        };
                        break;
                    }
                } else if (country.geometry.type === 'MultiPolygon') {
                    coords = country.geometry.coordinates;
                    for (let j = 0; j < coords.length; j++) {
                        match = pointInPolygon(coords[j][0], [lon, lat]);
                        if (match) {
                            result = {
                                code: countries.features[i].id,
                                name: countries.features[i].properties.name,
                            };
                            break;
                        }
                    }
                }
            }


            acc[`${face.a}${face.b}${face.c}`] = result && result.code;
            return acc;
        }, {});

        console.log({ store })

        // add base map layer with all countries
        const worldTexture = mapTexture(countries);
        const mapMaterial  = new THREE.MeshPhongMaterial({ map: worldTexture, transparent: true });
        const baseMap = new THREE.Mesh(new THREE.SphereGeometry(201, segments, segments), mapMaterial);
        baseMap.rotation.y = Math.PI * 1.5;

        this.earth = new THREE.Object3D();
        this.earth.scale.set(2.5, 2.5, 2.5);
        this.earth.add(baseGlobe);
        this.earth.add(baseMap);
        this.scene.add(this.earth);


        

        const onMouseMove = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObject(baseGlobe);
            if (intersects.length === 0) return;
            const pointOfIntersection = intersects[0].point;
            console.log({pointOfIntersection});
            const face = intersects[0].face;
            console.log({before: Date.now()})
            const country = store[`${face.a}${face.b}${face.c}`];
            console.log({after: Date.now()})
            console.log({ country })
        
            // baseGlobe.worldToLocal(localPoint.copy(pointOfIntersection));
            // console.log({localPoint});

            // spherical.setFromVector3(localPoint);
            // const lat = THREE.Math.radToDeg(Math.PI / 2 - spherical.phi);
            // const lon = THREE.Math.radToDeg(spherical.theta);
            // console.log({lat, lon})

            // let match = false;

            // let country;
            // let coords;

            // let result;

            // for (let i = 0; i < countries.features.length; i++) {
            //     country = countries.features[i];
            //     if (country.geometry.type === 'Polygon') {
            //         match = pointInPolygon(country.geometry.coordinates[0], [lon, lat]);
            //         if (match) {
            //             result = {
            //                 code: countries.features[i].id,
            //                 name: countries.features[i].properties.name,
            //             };
            //             break;
            //         }
            //     } else if (country.geometry.type === 'MultiPolygon') {
            //         coords = country.geometry.coordinates;
            //         for (let j = 0; j < coords.length; j++) {
            //             match = pointInPolygon(coords[j][0], [lon, lat]);
            //             if (match) {
            //                 result = {
            //                     code: countries.features[i].id,
            //                     name: countries.features[i].properties.name,
            //                 };
            //                 break;
            //             }
            //         }
            //     }
            // }

            // console.log({ result });
        };

        this.mount.addEventListener('mousemove', onMouseMove);

        const orbitControls = new OrbitControls(this.camera);

        // const spotLight = new THREE.SpotLight(0xffffff, 1, 0, 10, 2);
        // spotLight.position.set(0, 1000, 0);
        // this.scene.add(spotLight);

        this.start();


    }

    componentWillUnmount() {
        this.stop();
        this.mount.removeChild(this.renderer.domElement);
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    }

    stop() {
        cancelAnimationFrame(this.frameId);
    }

    animate = () => {
        this.earth.rotation.y += 0.001;
        this.renderScene();
        this.frameId = window.requestAnimationFrame(this.animate);
    };

    renderScene() {
        this.renderer.render(this.scene, this.camera);
    }

    render() {
        return(
            <div
                style={{ width: window.innerWidth, height: window.innerHeight }}
                ref={(mount) => { this.mount = mount; }}
            />
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePage));

function mapTexture(geojson) {
    const projection = d3.geoEquirectangular()
        .translate([1024, 512])
        .scale(325);

    const canvas = d3.select('body').append('canvas')
        .style('display', 'none')
        .attr('width', '2048px')
        .attr('height', '1024px');

    const context = canvas.node().getContext('2d');

    const path = d3.geoPath(projection, context);

    context.strokeStyle = '#333';
    context.lineWidth = 1;
    context.fillStyle = '#CDB380';

    context.beginPath();

    path(geojson);

    context.fill();

    context.stroke();

    // DEBUGGING - Really expensive, disable when done.
    // console.log(canvas.node().toDataURL());

    const texture = new THREE.CanvasTexture(canvas.node());

    canvas.remove();

    return texture;
}
