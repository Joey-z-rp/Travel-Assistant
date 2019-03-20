import * as THREE from 'three';
import * as OrbitControls from 'three-orbitcontrols';

export class BaseGlobe {
    protected SEGMENT = 150;
    protected RADIUS = 200;
    protected Y_AXIS_OFFSET = Math.PI * 1.5;
    protected mountingElement;
    protected width;
    protected height;
    protected scene;
    protected camera;
    protected renderer;
    protected light;
    protected baseGlobe;
    protected baseGlobeGeometry;
    protected earth;
    private frameId;
    protected rotationAngle = 0.001;

    constructor(mountingElement: HTMLElement) {
        this.mountingElement = mountingElement;

        this.width = this.mountingElement.clientWidth;
        this.height = this.mountingElement.clientHeight;

        this.scene = new THREE.Scene();

        this.setupCamera();

        // Setup orbit control
        new OrbitControls(this.camera);

        this.setupLight();

        this.setupRenderer();

        this.createBaseGlobe();

        // Create an object to hold all layers
        this.earth = new THREE.Object3D();
    }

    private setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            70,
            this.width / this.height,
            1,
            5000,
        );
        this.camera.position.z = 1000;
    }

    private setupLight() {
        this.light = new THREE.HemisphereLight('#ffffff', '#666666', 1.5);
        this.light.position.set(0, 1000, 0);
    }

    private setupRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);
        this.mountingElement.appendChild(this.renderer.domElement);
    }

    private createBaseGlobe() {
        this.baseGlobeGeometry = new THREE.SphereGeometry(this.RADIUS, this.SEGMENT, this.SEGMENT);
        const material = new THREE.MeshPhongMaterial({ color: '#2B3B59', transparent: true });
        this.baseGlobe = new THREE.Mesh(this.baseGlobeGeometry, material);
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    }

    private animate = () => {
        this.earth.rotation.y += this.rotationAngle;
        this.renderer.render(this.scene, this.camera);
        this.frameId = requestAnimationFrame(this.animate);
    }

    cleanUp() {
        cancelAnimationFrame(this.frameId);
        this.mountingElement.removeChild(this.renderer.domElement);
    }
}