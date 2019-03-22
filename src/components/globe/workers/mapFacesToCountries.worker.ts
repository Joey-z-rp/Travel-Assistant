import * as THREE from 'three';
import { getCenterPoint, pointInPolygon } from '../globeHelpers';

const mapFacesToCountries = (countries, globeGeometry) => {
    const spherical = new THREE.Spherical();

    return globeGeometry.faces.reduce(
        (accumulator, face) => {
            const centerPoint = getCenterPoint(face, globeGeometry.vertices);

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
};

const context: Worker = self as any;

context.addEventListener('message', (event) => {

    context.postMessage(mapFacesToCountries(event.data.countriesGeoJson, event.data.globeGeometry));
});
