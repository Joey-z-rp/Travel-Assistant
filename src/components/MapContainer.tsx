import {
    GoogleApiWrapper,
    InfoWindow,
    Map,
    Marker,
} from 'google-maps-react';
import * as React from 'react';

export class MapContainer extends React.Component<any> {
    render() {
        return (
            <Map google={this.props.google} initialCenter={this.props.initialCenter} zoom={14}>

                <Marker
                    onClick={() => {}}
                    name={'Current location'}
                />

                <InfoWindow onClose={() => {}}>
                    <div>
                        <h1>Info</h1>
                    </div>
                </InfoWindow>
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: '',
})(MapContainer);
