import * as d3 from 'd3';
import * as THREE from 'three';
import { feature as topojsonFeature } from 'topojson';

import { BaseGlobe } from './baseGlobe';
import {
    getCenterPoint,
    mapTexture,
    pointInPolygon,
} from './globeHelpers';

export class Globe extends BaseGlobe {
    private mapLayer;
    private selectedCountryOverlay;
    private lastCountry;

    constructor(mountingElement: HTMLElement) {
        super(mountingElement);
    }

    async init() {
        const countriesGeoJson = await this.getCountriesGeoJson();

        this.createMapLayer(countriesGeoJson);

        this.createSelectedHighlightLayer();

        this.configEarth();

        this.mountingElement.addEventListener(
            'mousemove',
            this.createMouseMoveListener(countriesGeoJson),
        );
    }

    private async getCountriesGeoJson() {
        const worldMapTopoJson = await d3.json('assets/world.json');

        return topojsonFeature(
            worldMapTopoJson,
            worldMapTopoJson.objects.countries,
        );
    }

    private createMapLayer(countries) {
        const worldTexture = mapTexture(countries, this.mountingElement);
        const material  = new THREE.MeshPhongMaterial({ opacity: 0.7, map: worldTexture, transparent: true });
        this.mapLayer = new THREE.Mesh(
            new THREE.SphereGeometry(this.RADIUS + 1, 50, 50),
            material,
        );
        this.mapLayer.rotation.y = this.Y_AXIS_OFFSET;
    }

    private createSelectedHighlightLayer() {
        this.selectedCountryOverlay = new THREE.Mesh(
            new THREE.SphereGeometry(this.RADIUS + 2, 40, 40),
            new THREE.MeshPhongMaterial({ opacity: 0, transparent: true }),
        );
        this.selectedCountryOverlay.rotation.y = this.Y_AXIS_OFFSET;
    }

    private configEarth() {
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

        return this.baseGlobeGeometry.faces.reduce(
            (accumulator, face) => {
                const centerPoint = getCenterPoint(face, this.baseGlobeGeometry.vertices);

                // Convert to spherical coordinate
                spherical.setFromVector3(new THREE.Vector3(centerPoint.x, centerPoint.y, centerPoint.z));

                const latitude = THREE.Math.radToDeg(Math.PI / 2 - spherical.phi);
                const longitude = THREE.Math.radToDeg(spherical.theta);

                // Find if the face is in any country
                accumulator[`${face.a}${face.b}${face.c}`] = countries.features.find((feature) => {
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

                return accumulator;
            },
            {},
        );
    }

    private highlightSelectedCountry(country) {
        if (this.shouldUpdateSelectedCountry(country)) {
            const isAnyCountrySelected = !!(country && country.id);

            this.rotationAngle = isAnyCountrySelected ? 0 : 0.001;

            this.selectedCountryOverlay.material = isAnyCountrySelected
                ? new THREE.MeshPhongMaterial({
                    map: mapTexture(country, this.mountingElement, 'rgba(200, 100, 100, 0.6)'),
                    transparent: true,
                })
                : new THREE.MeshPhongMaterial({ opacity: 0, transparent: true });
        }
    }

    private shouldUpdateSelectedCountry(country) {
        return (this.lastCountry && !country) ||
            (!this.lastCountry && country) ||
            (this.lastCountry && country && this.lastCountry.id !== country.id);
    }
}
