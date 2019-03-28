import * as d3 from 'd3';
import * as THREE from 'three';
import { feature as topojsonFeature } from 'topojson';

import { ICallbacks } from '../../interfaces/components/globe';
import { BaseGlobe } from './baseGlobe';
import { mapTexture } from './globeHelpers';
import Worker from './workers/mapFacesToCountries.worker.ts';

export class Globe extends BaseGlobe {
    private mapLayer;
    private selectedCountryOverlay;
    private lastCountry;
    private currentCountry;
    private hoverOn: Function;
    private navigateToRecordJourney: Function;

    constructor(mountingElement: HTMLElement, callbacks: ICallbacks) {
        super(mountingElement);

        this.hoverOn = callbacks.hoverOn;
        this.navigateToRecordJourney = callbacks.navigateToRecordJourney;
    }

    async init() {
        const countriesGeoJson = await this.getCountriesGeoJson();

        this.createMapLayer(countriesGeoJson);

        this.createSelectedHighlightLayer();

        this.configEarth();

        // This method is async(not promise)
        this.addMouseEventListener(countriesGeoJson);
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

    private addMouseEventListener(countriesGeoJson) {
        // Mapping faces to countries is processor intensive
        const mapFacesToCountriesWorker = new Worker();
        mapFacesToCountriesWorker.postMessage({ countriesGeoJson, globeGeometry: this.baseGlobeGeometry });
        mapFacesToCountriesWorker.onmessage = (event) => {
            this.mountingElement.addEventListener(
                'mousemove',
                this.createMouseMoveListener(event.data),
            );

            this.mountingElement.addEventListener(
                'click',
                () => {
                    if (this.currentCountry && this.currentCountry.id) {
                        this.navigateToRecordJourney();
                    }
                },
            );

            mapFacesToCountriesWorker.terminate();
        };
    }

    private createMouseMoveListener(facesToCountriesMapping) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        return (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObject(this.baseGlobe);

            if (intersects.length === 0) return;

            const face = intersects[0].face!;
            this.currentCountry = facesToCountriesMapping[`${face.a}${face.b}${face.c}`];

            if (this.shouldUpdateSelectedCountry(this.currentCountry)) {
                this.hoverOn(this.currentCountry && this.currentCountry.id);
            }

            this.highlightSelectedCountry(this.currentCountry);

            this.lastCountry = this.currentCountry;
        };
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
