import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "../../../components/MapComponents/Map";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("window");
const isMobile = width < 768;

interface FarmaciaData {
  id: number;
  nombre: string;
  latitude: number;
  longitude: number;
  direccion: string;
  abierto: boolean;
  horario24h: boolean;
  telefono: string | null;
  horarioTexto: string;
  distancia: number;
}

interface LocationData {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const calcularDistancia = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const parseOpeningHours = (
  openingHours: string | undefined
): { texto: string; abierto: boolean; es24h: boolean } => {
  if (!openingHours) {
    return {
      texto: "Horario no disponible",
      abierto: Math.random() > 0.3,
      es24h: false,
    };
  }

  if (openingHours === "24/7") {
    return { texto: "Abierto 24 horas", abierto: true, es24h: true };
  }

  const horaActual = new Date().getHours();
  const diaActual = new Date().getDay();

  const formatoSimple = openingHours.replace(/Mo-Fr|Mo-Sa|Mo-Su/gi, "L-V");

  const match = openingHours.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);
  if (match) {
    const horaApertura = parseInt(match[1]);
    const horaCierre = parseInt(match[3]);
    const estaAbierto = horaActual >= horaApertura && horaActual < horaCierre;

    return {
      texto: `${match[1]}:${match[2]} - ${match[3]}:${match[4]}`,
      abierto: estaAbierto,
      es24h: false,
    };
  }

  return {
    texto: formatoSimple || "Ver horarios",
    abierto: Math.random() > 0.3,
    es24h: false,
  };
};

export default function TuFarmaciaPage() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [farmacias, setFarmacias] = useState<FarmaciaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [radioFiltro, setRadioFiltro] = useState(3000);
  const [disponibilidadFiltro, setDisponibilidadFiltro] = useState("todos");
  const [modalFiltro, setModalFiltro] = useState<string | null>(null);
  const [nombreFiltro, setNombreFiltro] = useState("");
  const [errorLocation, setErrorLocation] = useState(false);

  const { t } = useTranslation();

  const obtenerFarmacias = async () => {
    try {
      setLoading(true);
      setErrorLocation(false);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert(t("maps.location_permission_denied"));
        setErrorLocation(true);
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      setLocation({
        latitude,
        longitude,
        latitudeDelta: isMobile ? 0.05 : 0.01,
        longitudeDelta: isMobile ? 0.05 : 0.01,
      });

      const query = `
        [out:json];
        (
          node[amenity=pharmacy](around:${radioFiltro},${latitude},${longitude});
          way[amenity=pharmacy](around:${radioFiltro},${latitude},${longitude});
        );
        out center;
      `;

      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
        query
      )}`;
      const response = await fetch(url);
      const data = await response.json();

      const farmaciasMapeadas: FarmaciaData[] = data.elements
        .map((el: any) => {
          const lat = el.lat || el.center?.lat;
          const lon = el.lon || el.center?.lon;

          if (!lat || !lon) return null;

          const distancia = calcularDistancia(latitude, longitude, lat, lon);
          const horarioInfo = parseOpeningHours(el.tags?.["opening_hours"]);

          return {
            id: el.id,
            nombre: el.tags?.name || "Farmacia",
            latitude: lat,
            longitude: lon,
            direccion: el.tags?.["addr:street"]
              ? `${el.tags["addr:street"]}${
                  el.tags["addr:housenumber"]
                    ? " " + el.tags["addr:housenumber"]
                    : ""
                }`
              : el.tags?.["addr:city"] || t("maps.unknown_address"),
            abierto: horarioInfo.abierto,
            horario24h: horarioInfo.es24h,
            telefono: el.tags?.phone || null,
            horarioTexto: horarioInfo.texto,
            distancia: distancia,
          };
        })
        .filter((f: any) => f !== null)
        .sort((a: FarmaciaData, b: FarmaciaData) => a.distancia - b.distancia)
        .slice(0, 21);

      setFarmacias(farmaciasMapeadas);
    } catch (err) {
      console.log(t("maps.error"), err);
      setErrorLocation(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerFarmacias();
  }, [radioFiltro]);

  const filtrados = farmacias.filter((f) => {
    const coincideNombre =
      nombreFiltro === "" ||
      f.nombre.toLowerCase().includes(nombreFiltro.toLowerCase());
    const coincideDisponibilidad =
      disponibilidadFiltro === t("maps.filters.all") ||
      (disponibilidadFiltro === t("maps.filters.open") && f.abierto) ||
      (disponibilidadFiltro === t("maps.filters.closed") && !f.abierto) ||
      (disponibilidadFiltro === t("maps.filters.24h") && f.horario24h);
    return coincideNombre && coincideDisponibilidad;
  });

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerGradient}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerText}>Mapa Farmacias</Text>
          </View>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              placeholder={t("maps.search_placeholder")}
              placeholderTextColor="#999"
              style={styles.input}
              value={nombreFiltro}
              onChangeText={setNombreFiltro}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setModalFiltro("filtros")}
          >
            <Text style={styles.filterIcon}>⚙️</Text>
            {!isMobile && <Text style={styles.filterButtonText}>Filtros</Text>}
          </TouchableOpacity>
        </View>

        {(radioFiltro !== 3000 ||
          disponibilidadFiltro !== t("maps.filters.all")) && (
          <View style={styles.activeFiltersContainer}>
            {radioFiltro !== 3000 && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>
                  📍 {radioFiltro / 1000} km
                </Text>
                <TouchableOpacity onPress={() => setRadioFiltro(3000)}>
                  <Text style={styles.filterChipClose}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            {disponibilidadFiltro !== t("maps.filters.all") && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>
                  {disponibilidadFiltro === t("maps.filters.open")
                    ? t("maps.filters.open_emoji")
                    : disponibilidadFiltro === t("maps.filters.closed")
                    ? t("maps.filters.closed_emoji")
                    : t("maps.filters.24h_emoji")}
                </Text>
                <TouchableOpacity
                  onPress={() => setDisponibilidadFiltro(t("maps.filters.all"))}
                >
                  <Text style={styles.filterChipClose}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            {/* <Animated.View
              style={[
                styles.pharmacyLoaderContainer,
                { transform: [{ scale: pulseAnim }, { rotate: spin }] },
              ]}
            >
              <Text style={styles.pharmacyLoader}>💊</Text>
            </Animated.View> */}
            <ActivityIndicator
              size="large"
              color="#ED3729"
              style={styles.spinner}
            />
            <Text style={styles.loadingText}>
              {t("maps.loading_farmacies")}
            </Text>
            <Text style={styles.loadingSubtext}>
              {t("maps.loading_farmacies_subtext")}
            </Text>
          </View>
        ) : location ? (
          <View style={styles.mapContainer}>
            <View style={styles.mapWrapper}>
              <MapView
                style={styles.map}
                region={location}
                showsUserLocation
                showsCompass
              >
                <Marker
                  coordinate={location}
                  title={t("maps.your_location")}
                  pinColor="#474d8bff"
                />
                {filtrados.map((f) => (
                  <Marker
                    key={f.id}
                    coordinate={{
                      latitude: f.latitude,
                      longitude: f.longitude,
                    }}
                    title={f.nombre}
                    description={f.direccion}
                    pinColor={f.abierto ? "#00ffaaff" : "#8b6464ff"}
                  />
                ))}
              </MapView>
            </View>

            <ScrollView
              style={styles.pharmacyList}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.listHeader}>
                <Text style={styles.listHeaderEmoji}>📍</Text>
                <Text style={styles.listHeaderText}>
                  {filtrados.length}{" "}
                  {filtrados.length === 1
                    ? t("maps.pharmacy")
                    : t("maps.pharmacies")}
                </Text>
              </View>

              {filtrados.map((f, index) => (
                <TouchableOpacity
                  key={f.id}
                  style={[
                    styles.pharmacyCard,
                    index < 3 && styles.pharmacyCardTop,
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardTopRow}>
                    <View style={styles.pharmacyNameContainer}>
                      <Text style={styles.pharmacyName}>{f.nombre}</Text>
                      {f.horario24h && (
                        <View style={styles.badge24h}>
                          <Text style={styles.badge24hText}>24h</Text>
                        </View>
                      )}
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        f.abierto
                          ? styles.statusBadgeOpen
                          : styles.statusBadgeClosed,
                      ]}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          f.abierto
                            ? styles.statusDotOpen
                            : styles.statusDotClosed,
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          f.abierto
                            ? styles.statusTextOpen
                            : styles.statusTextClosed,
                        ]}
                      >
                        {f.abierto ? t("maps.open") : t("maps.closed")}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardInfoRow}>
                    <Text style={styles.infoIcon}>⏰</Text>
                    <Text style={styles.pharmacySchedule}>
                      {f.horarioTexto}
                    </Text>
                  </View>

                  <View style={styles.cardInfoRow}>
                    <Text style={styles.infoIcon}>📍</Text>
                    <Text style={styles.pharmacyAddress}>{f.direccion}</Text>
                    <View style={styles.distanceBadge}>
                      <Text style={styles.distanceText}>
                        {f.distancia.toFixed(1)} km
                      </Text>
                    </View>
                  </View>

                  {f.telefono && (
                    <View style={styles.cardInfoRow}>
                      <Text style={styles.infoIcon}>📞</Text>
                      <Text style={styles.pharmacyPhone}>{f.telefono}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : errorLocation ? (
          <View style={styles.errorContainer}>
            <View style={styles.errorIconContainer}>
              <Text style={styles.errorIcon}>📍</Text>
            </View>
            <Text style={styles.errorTitle}>{t("maps.unknown_address")}</Text>
            <Text style={styles.errorText}>
              {t("maps.location_permission_denied")}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={obtenerFarmacias}
            >
              <Text style={styles.retryButtonText}>{t("maps.retry")}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      <Modal
        visible={!!modalFiltro}
        transparent
        animationType={isMobile ? "slide" : "fade"}
        onRequestClose={() => setModalFiltro(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalFiltro(null)}
          activeOpacity={1}
        >
          <View
            style={[styles.modalContent, isMobile && styles.modalContentMobile]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>{t("maps.filters.title")}</Text>
                <Text style={styles.modalSubtitle}>
                  {t("maps.filters.customize_search")}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalFiltro(null)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Filtro por Farmacia */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>
                  {t("maps.filters.pharmacy_name")}
                </Text>
                <View style={styles.modalInputWrapper}>
                  <Text style={styles.modalInputIcon}>🔍</Text>
                  <TextInput
                    placeholder={t("maps.search_placeholder")}
                    placeholderTextColor="#999"
                    style={styles.modalInput}
                    value={nombreFiltro}
                    onChangeText={setNombreFiltro}
                  />
                </View>
              </View>

              {/* Filtro por Distancia */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>
                  {t("maps.filters.distance")}
                </Text>
                <View style={styles.optionsGrid}>
                  {[1, 2, 3, 5].map((km) => (
                    <TouchableOpacity
                      key={km}
                      onPress={() => setRadioFiltro(km * 1000)}
                      style={[
                        styles.optionButton,
                        radioFiltro === km * 1000 && styles.optionActive,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.optionKm}>{km}</Text>
                      <Text
                        style={[
                          styles.optionText,
                          radioFiltro === km * 1000 && styles.optionTextActive,
                        ]}
                      >
                        {t("maps.filters.km")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>
                  {t("maps.filters.availability")}
                </Text>
                <View style={styles.optionsGrid}>
                  {[
                    { key: "todos", label: t("maps.filters.all"), icon: "🏥" },
                    {
                      key: "abierto",
                      label: t("maps.filters.open"),
                      icon: "✅",
                    },
                    {
                      key: "cerrado",
                      label: t("maps.filters.closed"),
                      icon: "❌",
                    },
                    { key: "24h", label: t("maps.filters.24h"), icon: "⏰" },
                  ].map((disp) => (
                    <TouchableOpacity
                      key={disp.key}
                      onPress={() => setDisponibilidadFiltro(disp.key)}
                      style={[
                        styles.optionButton,
                        disponibilidadFiltro === disp.key &&
                          styles.optionActive,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.optionEmoji}>{disp.icon}</Text>
                      <Text
                        style={[
                          styles.optionText,
                          disponibilidadFiltro === disp.key &&
                            styles.optionTextActive,
                        ]}
                      >
                        {disp.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setModalFiltro(null)}
                activeOpacity={0.8}
              >
                <Text style={styles.applyButtonText}>
                  {t("maps.filters.apply_filters")}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    overflow: "hidden",
  },
  headerGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: isMobile ? 16 : 24,
    paddingVertical: 16,
    paddingTop: isMobile ? 48 : 24,
    backgroundColor: "#fff",
    shadowColor: "#ED3729",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuButton: {
    marginRight: 12,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FEE5E3",
    justifyContent: "center",
    alignItems: "center",
  },
  menuIcon: {
    fontSize: 20,
    color: "#ED3729",
    fontWeight: "600",
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerText: {
    fontSize: isMobile ? 22 : 26,
    fontWeight: "800",
    color: "#1f2937",
    letterSpacing: -0.8,
  },
  headerSubtext: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 3,
    fontWeight: "500",
  },
  pharmacyIconGradient: {
    width: 52,
    height: 52,
    backgroundColor: "#ED3729",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ED3729",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  pharmacyIconText: {
    fontSize: 30,
  },
  filterContainer: {
    marginHorizontal: isMobile ? 16 : 24,
    marginTop: 20,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(237, 55, 41, 0.1)",
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#1f2937",
    paddingVertical: isMobile ? 15 : 17,
    fontSize: 15,
    fontWeight: "500",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ED3729",
    paddingHorizontal: isMobile ? 16 : 22,
    paddingVertical: isMobile ? 15 : 17,
    borderRadius: 18,
    gap: 8,
    shadowColor: "#ED3729",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  filterIcon: {
    fontSize: 18,
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  activeFiltersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 14,
    gap: 10,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#ED3729",
    gap: 8,
    shadowColor: "#ED3729",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterChipText: {
    color: "#ED3729",
    fontSize: 13,
    fontWeight: "600",
  },
  filterChipClose: {
    color: "#ED3729",
    fontSize: 16,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    marginHorizontal: isMobile ? 16 : 24,
  },
  mapContainer: {
    flex: 1,
  },
  mapWrapper: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  map: {
    height: isMobile ? 240 : 340,
  },
  pharmacyList: {
    flex: 1,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f2937",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 18,
    marginBottom: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  listHeaderEmoji: {
    fontSize: 20,
  },
  listHeaderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  listHeaderBadge: {
    backgroundColor: "#ED3729",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  listHeaderBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },
  pharmacyCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    position: "relative",
  },
  pharmacyCardTop: {
    borderLeftWidth: 4,
    borderLeftColor: "#ED3729",
  },
  topBadge: {
    position: "absolute",
    top: -8,
    right: 16,
    backgroundColor: "#ED3729",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#ED3729",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  topBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  pharmacyNameContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginRight: 10,
  },
  pharmacyName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1f2937",
    flex: 1,
    letterSpacing: -0.3,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    gap: 6,
  },
  statusBadgeOpen: {
    backgroundColor: "#d1fae5",
  },
  statusBadgeClosed: {
    backgroundColor: "#f1f5f9",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusDotOpen: {
    backgroundColor: "#10b981",
  },
  statusDotClosed: {
    backgroundColor: "#64748b",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statusTextOpen: {
    color: "#059669",
  },
  statusTextClosed: {
    color: "#64748b",
  },
  badge24h: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badge24hText: {
    color: "#92400e",
    fontSize: 11,
    fontWeight: "800",
  },
  cardInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  infoIcon: {
    fontSize: 15,
  },
  pharmacySchedule: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
    flex: 1,
  },
  pharmacyAddress: {
    fontSize: 14,
    color: "#6b7280",
    flex: 1,
    fontWeight: "500",
  },
  pharmacyPhone: {
    fontSize: 14,
    color: "#ED3729",
    fontWeight: "700",
    flex: 1,
  },
  distanceBadge: {
    backgroundColor: "#FEE5E3",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  distanceText: {
    color: "#ED3729",
    fontSize: 12,
    fontWeight: "700",
  },
  pharmacyLoaderContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#FEE5E3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#ED3729",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  pharmacyLoader: {
    fontSize: 55,
  },
  spinner: {
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 28,
    marginVertical: 20,
    padding: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 17,
    color: "#1f2937",
    fontWeight: "700",
    textAlign: "center",
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 28,
    marginVertical: 20,
    padding: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  errorIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FEE5E3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  errorIcon: {
    fontSize: 45,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 14,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  errorText: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 24,
    paddingHorizontal: 20,
    fontWeight: "500",
  },
  retryButton: {
    backgroundColor: "#ED3729",
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 18,
    shadowColor: "#ED3729",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: isMobile ? "flex-end" : "center",
    alignItems: "center",
  },
  modalContent: {
    width: isMobile ? width : width * 0.5,
    maxWidth: 520,
    backgroundColor: "#fff",
    borderRadius: isMobile ? 0 : 28,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    maxHeight: isMobile ? height * 0.88 : height * 0.85,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  modalContentMobile: {
    width: width,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1f2937",
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
    fontWeight: "500",
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  modalCloseText: {
    fontSize: 20,
    color: "#6b7280",
    fontWeight: "700",
  },
  filterSection: {
    marginBottom: 28,
  },
  filterSectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 14,
  },
  modalInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
  },
  modalInputIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  modalInput: {
    flex: 1,
    color: "#1f2937",
    paddingVertical: 15,
    fontSize: 15,
    fontWeight: "500",
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  optionButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    paddingHorizontal: 0,
    borderColor: "#e5e7eb",
  },
  optionActive: {
    backgroundColor: "#FEE5E3",
    borderColor: "#ED3729",
    shadowColor: "#ED3729",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  optionKm: {
    fontSize: 26,
    fontWeight: "800",
    color: "#6b7280",
    marginBottom: 2,
  },
  optionEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  optionText: {
    color: "#6b7280",
    fontSize: 13,
    fontWeight: "600",
  },
  optionTextActive: {
    color: "#ED3729",
    fontWeight: "800",
  },
  applyButton: {
    backgroundColor: "#ED3729",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#ED3729",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
