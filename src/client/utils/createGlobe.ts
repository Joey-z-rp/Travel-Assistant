import * as d3 from 'd3';
import * as THREE from 'three';
import * as OrbitControls from 'three-orbitcontrols';
import { feature as topojsonFeature } from 'topojson';

import {
    getCenterPoint,
    mapTexture,
    pointInPolygon,
} from './globeHelpers';

export class Globe {
    private SEGMENT = 150;
    private RADIUS = 200;
    private frameId;
    private mountingElement;
    private width;
    private height;
    private baseGlobe;
    private baseGlobeGeometry;
    private earth;
    private scene;
    private camera;
    private renderer;
    private light;
    private mapLayer;
    private selectedCountryOverlay;
    private lastCountry;
    private rotationAngle = 0.001;

    constructor(mountingElement: HTMLElement) {
        this.mountingElement = mountingElement;
    }

    async init() {
        this.width = this.mountingElement.clientWidth;
        this.height = this.mountingElement.clientHeight;

        this.scene = new THREE.Scene();

        this.setupCamera();

        this.setupLight();

        this.setupRenderer();

        this.createBaseGlobe();

        const countriesGeoJson = await this.getCountriesGeoJson();

        this.createMapLayer(countriesGeoJson);

        this.createSelectedHighlightLayer();

        this.createEarth();

        // Setup orbit control
        new OrbitControls(this.camera);

        this.mountingElement.addEventListener(
            'mousemove',
            this.createMouseMoveListener(countriesGeoJson),
        );
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

    private async getCountriesGeoJson() {
        const worldMapTopoJson = await d3.json('public/world.json');

        return topojsonFeature(
            worldMapTopoJson,
            worldMapTopoJson.objects.countries,
        );
    }

    private createMapLayer(countries) {
        const worldTexture = mapTexture(countries, this.mountingElement);
        const material  = new THREE.MeshPhongMaterial({ map: worldTexture, transparent: true });
        this.mapLayer = new THREE.Mesh(
            new THREE.SphereGeometry(this.RADIUS + 1, this.SEGMENT, this.SEGMENT),
            material,
        );
        this.mapLayer.rotation.y = Math.PI * 1.5;
    }

    private createSelectedHighlightLayer() {
        this.selectedCountryOverlay = new THREE.Mesh(
            new THREE.SphereGeometry(this.RADIUS + 2, 40, 40),
            new THREE.MeshPhongMaterial({ opacity: 0, transparent: true }),
        );
        this.selectedCountryOverlay.rotation.y = Math.PI * 1.5;
    }

    private createEarth() {
        this.earth = new THREE.Object3D();
        this.earth.scale.set(2.5, 2.5, 2.5);
        this.earth.add(this.baseGlobe);
        this.earth.add(this.mapLayer);
        this.earth.add(this.selectedCountryOverlay);
        this.scene.add(this.earth);
        this.scene.add(this.light);
    }

    private createMouseMoveListener(countriesGeoJson) {
        const facesToCountriesMapping = this.mapFacesToCountries(countriesGeoJson);

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        return (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObject(this.baseGlobe);

            if (intersects.length === 0) return;

            const face = intersects[0].face!;
            const currentCountry = facesToCountriesMapping[`${face.a}${face.b}${face.c}`];

            console.log({ currentCountry });

            this.highlightSelectedCountry(currentCountry);

            this.lastCountry = currentCountry;
        };
    }

    private mapFacesToCountries(countries) {
        const spherical = new THREE.Spherical();

        const store = this.baseGlobeGeometry.faces.reduce(
            (accumulator, face) => {
                const centerPoint = getCenterPoint(face, this.baseGlobeGeometry.vertices);

                // Convert to spherical coordinate
                spherical.setFromVector3(new THREE.Vector3(centerPoint.x, centerPoint.y, centerPoint.z));

                const latitude = THREE.Math.radToDeg(Math.PI / 2 - spherical.phi);
                const longitude = THREE.Math.radToDeg(spherical.theta);

                // Find if the face is in any country
                const result = countries.features.find((feature) => {
                    if (feature.geometry.type === 'Polygon') {
                        return pointInPolygon(feature.geometry.coordinates[0], [longitude, latitude]);
                    }

                    if (feature.geometry.type === 'MultiPolygon') {
                        return !!feature.geometry.coordinates.find((coordinate) => {
                            return pointInPolygon(coordinate[0], [longitude, latitude]);
                        });
                    }

                    return false;
                });

                accumulator[`${face.a}${face.b}${face.c}`] = result;

                return accumulator;
            },
            {},
        );

        return store;
    }

    private highlightSelectedCountry(country) {
        if (this.shouldUpdateSelectedCountry(country)) {
            const isAnyCountrySelected = !!(country && country.id);

            this.rotationAngle = isAnyCountrySelected ? 0 : 0.001;

            const material = isAnyCountrySelected
                ? new THREE.MeshPhongMaterial({
                    map: mapTexture(country, this.mountingElement, 'red'),
                    transparent: true,
                })
                : new THREE.MeshPhongMaterial({ opacity: 0, transparent: true });

            this.selectedCountryOverlay.material = material;
        }
    }

    private shouldUpdateSelectedCountry(country) {
        return (this.lastCountry && !country) ||
            (!this.lastCountry && country) ||
            (this.lastCountry && country && this.lastCountry.id !== country.id);
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    }

    private animate = () => {
        this.earth.rotation.y += this.rotationAngle;
        this.renderer.render(this.scene, this.camera);
        this.frameId = window.requestAnimationFrame(this.animate);
    }

    cleanUp() {
        cancelAnimationFrame(this.frameId);
        this.mountingElement.removeChild(this.renderer.domElement);
    }
}
