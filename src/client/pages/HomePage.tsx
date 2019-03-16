import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as THREE from 'three';

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

    componentDidMount() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        // ADD SCENE
        this.scene = new THREE.Scene();

        // ADD CAMERA
        this.camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000,
        );
        this.camera.position.z = 4;

        // ADD RENDERER
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor('#000000');
        this.renderer.setSize(width, height);
        this.mount.appendChild(this.renderer.domElement);

        // ADD CUBE
        const geometry = new THREE.SphereGeometry(1, 10, 10);
        const material = new THREE.MeshBasicMaterial({ color: '#433F81' });
        this.earth = new THREE.Mesh(geometry, material);
        this.scene.add(this.earth);
        this.start();
    }

    componentWillUnmount() {
        this.stop();
        this.mount.removeChild(this.renderer.domElement)
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
        this.earth.rotation.x += 0.01;
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
