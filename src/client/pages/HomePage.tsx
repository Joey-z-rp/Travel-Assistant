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

        console.log({ worldMap });

        const countries = topojsonFeature(worldMap, worldMap.objects.countries);

        console.log({ countries });

        const segments = 150;

        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

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
        baseGlobe.rotation.y = Math.PI;

        // add base map layer with all countries
        const worldTexture = mapTexture(countries);
        const mapMaterial  = new THREE.MeshPhongMaterial({ map: worldTexture, transparent: true });
        const baseMap = new THREE.Mesh(new THREE.SphereGeometry(200, segments, segments), mapMaterial);
        baseMap.rotation.y = Math.PI;

        this.earth = new THREE.Object3D();
        this.earth.scale.set(2.5, 2.5, 2.5);
        this.earth.add(baseGlobe);
        this.earth.add(baseMap);
        this.scene.add(this.earth);

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

export function mapTexture(geojson) {
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
