import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet';

// Fix for default marker icon in Leaflet + React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const WorkerHeatmap = () => {
    return (
        <div style={{ width: '100%', height: '100%', minHeight: '500px' }}>
            <MapContainer
                center={[18.5204, 73.8567]}
                zoom={13}
                style={{ width: '100%', height: '100%', borderRadius: '12px' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[18.5204, 73.8567]}>
                    <Popup>
                        Hotel Aga Khan Palace <br /> High Worker Density
                    </Popup>
                </Marker>
                <Marker position={[18.5304, 73.8767]}>
                    <Popup>
                        Kalyani Nagar <br /> Medium Worker Density
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default WorkerHeatmap;
