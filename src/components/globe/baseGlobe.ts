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
    private terrainLayer;
    private atmosphere;
    private atmosphereGlow;
    private galaxy;
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

        this.createTerrainLayer();

        this.createAtmosphere();

        this.createAtmosphereGlow();

        this.createEarth();

        this.createGalaxy();

        this.addResizeListener();
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
        const material = new THREE.MeshBasicMaterial({ opacity: 0 });
        this.baseGlobe = new THREE.Mesh(this.baseGlobeGeometry, material);
    }

    private createTerrainLayer() {
        const geometry = new THREE.SphereGeometry(this.RADIUS + 1, 50, 50);
        const map = new THREE.TextureLoader().load('assets/2k_earth_daymap.jpg');
        const material = new THREE.MeshPhongMaterial({ map });
        this.terrainLayer = new THREE.Mesh(geometry, material);
        this.terrainLayer.rotation.y = this.Y_AXIS_OFFSET;
    }

    private createAtmosphere() {
        const geometry = new THREE.SphereGeometry(this.RADIUS + 4, 40, 40);
        const map = new THREE.TextureLoader().load('assets/earthcloudmap.jpg');
        const alphaMap = new THREE.TextureLoader().load('assets/earthcloudmaptrans.jpg');
        const material = new THREE.MeshPhongMaterial({
            map,
            alphaMap,
            opacity: 0.3,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
        });
        this.atmosphere = new THREE.Mesh(geometry, material);

    }

    private createAtmosphereGlow() {
        const geometry = new THREE.SphereGeometry(this.RADIUS + 4, 40, 40);
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                c: {
                    type: 'f',
                    value: 0.8,
                },
                p: {
                    type: 'f',
                    value: 2,
                },
                glowColor: {
                    type: 'c',
                    value: new THREE.Color('#93cfef'),
                },
                viewVector: {
                    type: 'v3',
                    value: this.camera.position,
                },
            },
            vertexShader: `
                uniform vec3 viewVector;
                uniform float c;
                uniform float p;
                varying float intensity;
                void main() {
                  vec3 vNormal = normalize( normalMatrix * normal );
                  vec3 vNormel = normalize( normalMatrix * viewVector );
                  intensity = pow( c - dot(vNormal, vNormel), p );
                  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`,
            fragmentShader: `
                uniform vec3 glowColor;
                varying float intensity;
                void main()
                {
                  vec3 glow = glowColor * intensity;
                  gl_FragColor = vec4( glow, 1.0 );
                }`,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
        });
        this.atmosphereGlow = new THREE.Mesh(geometry, glowMaterial);
    }

    private createEarth() {
        this.earth = new THREE.Object3D();
        this.earth.scale.set(2.5, 2.5, 2.5);
        this.earth.add(this.baseGlobe);
        this.earth.add(this.terrainLayer);
        this.earth.add(this.atmosphere);
        this.earth.add(this.atmosphereGlow);
    }

    private createGalaxy() {
        const geometry = new THREE.SphereGeometry(2000, 40, 40);
        const map = new THREE.TextureLoader().load('assets/starfield.png');
        const material = new THREE.MeshBasicMaterial({ map, side: THREE.BackSide });
        this.galaxy = new THREE.Mesh(geometry, material);
        this.scene.add(this.galaxy);
    }

    private addResizeListener() {
        const onWindowResize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', onWindowResize);
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    }

    private animate = () => {
        this.earth.rotation.y += this.rotationAngle;
        this.atmosphere.rotation.y += 0.0002;
        this.galaxy.rotation.y += this.rotationAngle;
        this.renderer.render(this.scene, this.camera);
        this.frameId = requestAnimationFrame(this.animate);
    }

    cleanUp() {
        cancelAnimationFrame(this.frameId);
        this.mountingElement.removeChild(this.renderer.domElement);
    }
}
