//Leaflet es una librería JavaScript de mapas interactivos para la web.
import {
  MapContainer,
  TileLayer,
  Marker as LeafletMarker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { View } from "react-native";

//importar iconos
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Forzar a Leaflet a usar este icono por defecto
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapView(props) {
  const { region, style, urlTemplate, children, ...rest } = props;

  const center = region ? [region.latitude, region.longitude] : [0, 0];
  // Convertir delta de región a zoom de Leaflet (aproximado)
  const zoom =
    region && region.latitudeDelta
      ? Math.round(Math.log(360 / region.latitudeDelta) / Math.LN2)
      : 10;

  // Usamos el urlTemplate de OpenStreetMap por defecto
  const tilesUrl =
    urlTemplate || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  // mapa ajustado
  return (
    <View style={style}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom={true}
        {...rest}
      >
        <TileLayer url={tilesUrl} />
        {children}
      </MapContainer>
    </View>
  );
}

// componente marker (lefleat Marker)
export const Marker = ({ coordinate, pinColor, title, description }) => {
  if (!coordinate) return null;

  let leafletIcon;

  // Si se proporciona pinColor, creamos un icono HTML DIV personalizado
  if (pinColor) {
    // Creamos un simple círculo HTML estilizado
    leafletIcon = L.divIcon({
      className: "custom-pin",
      html: `<div style="
                background-color: ${pinColor}; 
                width: 16px; 
                height: 16px; 
                border-radius: 50%; 
                border: 3px solid white;
                box-shadow: 0 0 5px rgba(0,0,0,0.5);
            "></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11], // Lo centramos
    });
  } else {
    // Usamos el icono PNG predeterminado (el que arreglamos arriba)
    leafletIcon = L.Marker.prototype.options.icon;
  }

  return (
    <LeafletMarker
      position={[coordinate.latitude, coordinate.longitude]}
      title={title}
      // Pasamos el icono personalizado o el por defecto
      icon={leafletIcon}
    />
  );
};
