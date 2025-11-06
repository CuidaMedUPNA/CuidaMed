import { View } from "react-native";

let MapContainer = null;
let TileLayer = null;
let LeafletMarker = null;
let L = null;
let DefaultIcon = null;

if (typeof window !== "undefined") {
  const leafletImports = require("react-leaflet");
  MapContainer = leafletImports.MapContainer;
  TileLayer = leafletImports.TileLayer;
  LeafletMarker = leafletImports.Marker;

  require("leaflet/dist/leaflet.css");
  L = require("leaflet");

  const icon = require("leaflet/dist/images/marker-icon.png");
  const iconShadow = require("leaflet/dist/images/marker-shadow.png");

  DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  L.Marker.prototype.options.icon = DefaultIcon;
}

export default function MapView(props) {
  if (typeof window === "undefined") {
    return <View style={props.style} />;
  }

  const { region, style, urlTemplate, children, ...rest } = props;

  const center = region ? [region.latitude, region.longitude] : [0, 0];
  const zoom =
    region && region.latitudeDelta
      ? Math.round(Math.log(360 / region.latitudeDelta) / Math.LN2)
      : 10;

  const tilesUrl =
    urlTemplate || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

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

export const Marker = ({ coordinate, pinColor, title, description }) => {
  if (typeof window === "undefined" || !LeafletMarker) {
    return null;
  }

  if (!coordinate) return null;

  let leafletIcon;

  if (pinColor) {
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
