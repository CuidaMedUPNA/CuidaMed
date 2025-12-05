import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
  Dimensions,
  RefreshControl,
  PanResponder,
  Animated,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "../../../components/MapComponents/Map";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingFarmacias, setLoadingFarmacias] = useState(false);
  const [radioFiltro, setRadioFiltro] = useState(3000);
  const [disponibilidadFiltro, setDisponibilidadFiltro] = useState("todos");
  const [modalFiltro, setModalFiltro] = useState<string | null>(null);
  const [nombreFiltro, setNombreFiltro] = useState("");
  const [errorLocation, setErrorLocation] = useState(false);

  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const initialLoadDone = useRef(false);
  const prevRadioRef = useRef(radioFiltro);
  const [refreshing, setRefreshing] = useState(false);

  // Animación para el modal deslizable
  const modalTranslateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          modalTranslateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          // Cerrar modal si se desliza más de 100px o con velocidad
          Animated.timing(modalTranslateY, {
            toValue: 500,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setModalFiltro(null);
            modalTranslateY.setValue(0);
          });
        } else {
          // Volver a la posición original
          Animated.spring(modalTranslateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 8,
          }).start();
        }
      },
    })
  ).current;

  // Obtener farmacias (puede ser más lento)
  const obtenerFarmacias = useCallback(
    async (lat: number, lon: number) => {
      try {
        setLoadingFarmacias(true);

        const query = `
        [out:json];
        (
          node[amenity=pharmacy](around:${radioFiltro},${lat},${lon});
          way[amenity=pharmacy](around:${radioFiltro},${lat},${lon});
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
            const elLat = el.lat || el.center?.lat;
            const elLon = el.lon || el.center?.lon;

            if (!elLat || !elLon) return null;

            const distancia = calcularDistancia(lat, lon, elLat, elLon);
            const horarioInfo = parseOpeningHours(el.tags?.["opening_hours"]);

            return {
              id: el.id,
              nombre: el.tags?.name || "Farmacia",
              latitude: elLat,
              longitude: elLon,
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
      } finally {
        setLoadingFarmacias(false);
      }
    },
    [radioFiltro, t]
  );

  // Obtener ubicación (rápido)
  const obtenerUbicacion = useCallback(async () => {
    try {
      setLoadingLocation(true);
      setErrorLocation(false);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert(t("maps.location_permission_denied"));
        setErrorLocation(true);
        setLoadingLocation(false);
        return null;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // Más rápido que High
      });
      const { latitude, longitude } = loc.coords;

      const newLocation = {
        latitude,
        longitude,
        latitudeDelta: isMobile ? 0.05 : 0.01,
        longitudeDelta: isMobile ? 0.05 : 0.01,
      };

      setLocation(newLocation);
      setLoadingLocation(false);
      return { latitude, longitude };
    } catch (err) {
      console.log("Error ubicación:", err);
      setErrorLocation(true);
      setLoadingLocation(false);
      return null;
    }
  }, [t]);

  // Cargar todo al inicio
  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;

    const inicializar = async () => {
      const coords = await obtenerUbicacion();
      if (coords) {
        obtenerFarmacias(coords.latitude, coords.longitude);
      }
    };
    inicializar();
  }, [obtenerUbicacion, obtenerFarmacias]);

  // Recargar farmacias cuando cambia el radio (solo si ya hay ubicación)
  useEffect(() => {
    if (prevRadioRef.current !== radioFiltro && location) {
      prevRadioRef.current = radioFiltro;
      obtenerFarmacias(location.latitude, location.longitude);
    }
  }, [radioFiltro, location, obtenerFarmacias]);

  // Función para refrescar (pull-to-refresh)
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const coords = await obtenerUbicacion();
    if (coords) {
      await obtenerFarmacias(coords.latitude, coords.longitude);
    }
    setRefreshing(false);
  }, [obtenerUbicacion, obtenerFarmacias]);

  // Reset modal animation cuando se abre
  useEffect(() => {
    if (modalFiltro) {
      modalTranslateY.setValue(0);
    }
  }, [modalFiltro, modalTranslateY]);

  const filtrados = farmacias.filter((f) => {
    const coincideNombre =
      nombreFiltro === "" ||
      f.nombre.toLowerCase().includes(nombreFiltro.toLowerCase());
    const coincideDisponibilidad =
      disponibilidadFiltro === "todos" ||
      (disponibilidadFiltro === "abierto" && f.abierto) ||
      (disponibilidadFiltro === "cerrado" && !f.abierto) ||
      (disponibilidadFiltro === "24h" && f.horario24h);
    return coincideNombre && coincideDisponibilidad;
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FF6B6B", "#FF8E53", "#FFA07A"]}
        style={[styles.heroHeader, { paddingTop: insets.top + 16 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              {t("maps.title", { defaultValue: "Farmacias Cercanas" })}
            </Text>
            <View style={styles.subtitleContainer}>
              <View style={styles.subtitleBadge}>
                <Text style={styles.subtitleBadgeText}>{filtrados.length}</Text>
              </View>
              <Text style={styles.headerSubtitle}>
                {t("maps.nearby", { defaultValue: "cerca de ti" })}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.filterHeaderButton}
            onPress={() => setModalFiltro("filtros")}
            activeOpacity={0.8}
          >
            <View style={styles.filterHeaderButtonInner}>
              <MaterialIcons name="tune" size={24} color="#FF6B6B" />
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <MaterialIcons
              name="search"
              size={22}
              color="#8E8E93"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder={t("maps.search_placeholder")}
              placeholderTextColor="#8E8E93"
              style={styles.searchInput}
              value={nombreFiltro}
              onChangeText={setNombreFiltro}
            />
            {nombreFiltro.length > 0 && (
              <TouchableOpacity onPress={() => setNombreFiltro("")}>
                <MaterialIcons name="close" size={20} color="#8E8E93" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {(radioFiltro !== 3000 || disponibilidadFiltro !== "todos") && (
          <View style={styles.activeFiltersContainer}>
            {radioFiltro !== 3000 && (
              <View style={styles.filterChip}>
                <MaterialIcons name="place" size={14} color="#FF6B6B" />
                <Text style={styles.filterChipText}>
                  {radioFiltro / 1000} km
                </Text>
                <TouchableOpacity onPress={() => setRadioFiltro(3000)}>
                  <MaterialIcons name="close" size={16} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            )}
            {disponibilidadFiltro !== "todos" && (
              <View style={styles.filterChip}>
                <MaterialIcons
                  name={
                    disponibilidadFiltro === "abierto"
                      ? "check-circle"
                      : disponibilidadFiltro === "cerrado"
                      ? "cancel"
                      : "schedule"
                  }
                  size={14}
                  color="#FF6B6B"
                />
                <Text style={styles.filterChipText}>
                  {disponibilidadFiltro === "abierto"
                    ? t("maps.open")
                    : disponibilidadFiltro === "cerrado"
                    ? t("maps.closed")
                    : "24h"}
                </Text>
                <TouchableOpacity
                  onPress={() => setDisponibilidadFiltro("todos")}
                >
                  <MaterialIcons name="close" size={16} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.content}>
        {loadingLocation ? (
          <View style={styles.loadingContainer}>
            <LinearGradient
              colors={["#fff0f0", "#fee0e0"]}
              style={styles.loadingIconBg}
            >
              <MaterialIcons name="my-location" size={48} color="#FF6B6B" />
            </LinearGradient>
            <ActivityIndicator
              size="large"
              color="#FF6B6B"
              style={styles.spinner}
            />
            <Text style={styles.loadingText}>
              {t("maps.getting_location", {
                defaultValue: "Obteniendo ubicación",
              })}
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
                  pinColor="#FF6B6B"
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
                    pinColor={f.abierto ? "#4CAF50" : "#9E9E9E"}
                  />
                ))}
              </MapView>
              {loadingFarmacias && (
                <View style={styles.mapLoadingOverlay}>
                  <ActivityIndicator size="small" color="#FF6B6B" />
                  <Text style={styles.mapLoadingText}>
                    {t("maps.loading_farmacies")}
                  </Text>
                </View>
              )}
            </View>

            <ScrollView
              style={styles.pharmacyList}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#FF6B6B"]}
                  tintColor="#FF6B6B"
                  title={t("maps.pull_to_refresh", {
                    defaultValue: "Actualizar",
                  })}
                  titleColor="#8E8E93"
                />
              }
            >
              <View style={styles.listHeader}>
                <MaterialIcons name="local-pharmacy" size={20} color="#FFF" />
                <Text style={styles.listHeaderText}>
                  {loadingFarmacias
                    ? t("maps.searching", { defaultValue: "Buscando..." })
                    : `${filtrados.length} ${
                        filtrados.length === 1
                          ? t("maps.pharmacy")
                          : t("maps.pharmacies")
                      }`}
                </Text>
                {loadingFarmacias && (
                  <ActivityIndicator
                    size="small"
                    color="#FFF"
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </View>

              {filtrados.map((f, index) => (
                <TouchableOpacity
                  key={f.id}
                  style={styles.pharmacyCard}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardContent}>
                    <View style={styles.pharmacyIconContainer}>
                      <LinearGradient
                        colors={
                          f.abierto
                            ? ["#E8F5E9", "#C8E6C9"]
                            : ["#F5F5F5", "#EEEEEE"]
                        }
                        style={styles.pharmacyIconBg}
                      >
                        <MaterialIcons
                          name="local-pharmacy"
                          size={24}
                          color={f.abierto ? "#4CAF50" : "#9E9E9E"}
                        />
                      </LinearGradient>
                    </View>

                    <View style={styles.pharmacyInfo}>
                      <View style={styles.pharmacyNameRow}>
                        <Text style={styles.pharmacyName} numberOfLines={1}>
                          {f.nombre}
                        </Text>
                        {f.horario24h && (
                          <View style={styles.badge24h}>
                            <Text style={styles.badge24hText}>24h</Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.pharmacyDetailRow}>
                        <MaterialIcons
                          name="schedule"
                          size={14}
                          color="#8E8E93"
                        />
                        <Text style={styles.pharmacyDetailText}>
                          {f.horarioTexto}
                        </Text>
                      </View>

                      <View style={styles.pharmacyDetailRow}>
                        <MaterialIcons name="place" size={14} color="#8E8E93" />
                        <Text
                          style={styles.pharmacyDetailText}
                          numberOfLines={1}
                        >
                          {f.direccion}
                        </Text>
                      </View>

                      {f.telefono && (
                        <View style={styles.pharmacyDetailRow}>
                          <MaterialIcons
                            name="phone"
                            size={14}
                            color="#8E8E93"
                          />
                          <Text style={styles.pharmacyPhoneText}>
                            {f.telefono}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.pharmacyRight}>
                      <View
                        style={[
                          styles.statusBadge,
                          f.abierto ? styles.statusOpen : styles.statusClosed,
                        ]}
                      >
                        <View
                          style={[
                            styles.statusDot,
                            f.abierto ? styles.dotOpen : styles.dotClosed,
                          ]}
                        />
                        <Text
                          style={[
                            styles.statusText,
                            f.abierto ? styles.textOpen : styles.textClosed,
                          ]}
                        >
                          {f.abierto ? t("maps.open") : t("maps.closed")}
                        </Text>
                      </View>
                      <View style={styles.distanceBadge}>
                        <Text style={styles.distanceText}>
                          {f.distancia.toFixed(1)} km
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : errorLocation ? (
          <View style={styles.errorContainer}>
            <LinearGradient
              colors={["#fff0f0", "#fee0e0"]}
              style={styles.errorIconBg}
            >
              <MaterialIcons name="location-off" size={56} color="#FF6B6B" />
            </LinearGradient>
            <Text style={styles.errorTitle}>{t("maps.unknown_address")}</Text>
            <Text style={styles.errorText}>
              {t("maps.location_permission_denied")}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={async () => {
                const coords = await obtenerUbicacion();
                if (coords) {
                  obtenerFarmacias(coords.latitude, coords.longitude);
                }
              }}
            >
              <MaterialIcons name="refresh" size={20} color="#FFF" />
              <Text style={styles.retryButtonText}>{t("maps.retry")}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      <Modal
        visible={!!modalFiltro}
        transparent
        animationType="slide"
        onRequestClose={() => setModalFiltro(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalFiltro(null)}
          activeOpacity={1}
        >
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: modalTranslateY }] },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View {...panResponder.panHandlers}>
              <View style={styles.modalHandle} />
              <Text style={styles.swipeHint}>
                {t("maps.swipe_to_close", {
                  defaultValue: "Desliza para cerrar",
                })}
              </Text>
            </View>

            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{t("maps.filters.title")}</Text>
                <Text style={styles.modalSubtitle}>
                  {t("maps.filters.customize_search")}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalFiltro(null)}
                style={styles.modalCloseButton}
              >
                <MaterialIcons name="close" size={24} color="#1A1A2E" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Filtro por nombre */}
              <View style={styles.filterSection}>
                <View style={styles.filterSectionHeader}>
                  <MaterialIcons
                    name="local-pharmacy"
                    size={20}
                    color="#FF6B6B"
                  />
                  <Text style={styles.filterSectionTitle}>
                    {t("maps.filters.pharmacy_name")}
                  </Text>
                </View>
                <View style={styles.modalInputWrapper}>
                  <MaterialIcons name="search" size={20} color="#8E8E93" />
                  <TextInput
                    placeholder={t("maps.search_placeholder")}
                    placeholderTextColor="#8E8E93"
                    style={styles.modalInput}
                    value={nombreFiltro}
                    onChangeText={setNombreFiltro}
                  />
                </View>
              </View>

              <View style={styles.filterSection}>
                <View style={styles.filterSectionHeader}>
                  <MaterialIcons name="place" size={20} color="#FF6B6B" />
                  <Text style={styles.filterSectionTitle}>
                    {t("maps.filters.distance")}
                  </Text>
                </View>
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
                      <Text
                        style={[
                          styles.optionNumber,
                          radioFiltro === km * 1000 &&
                            styles.optionNumberActive,
                        ]}
                      >
                        {km}
                      </Text>
                      <Text
                        style={[
                          styles.optionLabel,
                          radioFiltro === km * 1000 && styles.optionLabelActive,
                        ]}
                      >
                        km
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <View style={styles.filterSectionHeader}>
                  <MaterialIcons name="schedule" size={20} color="#FF6B6B" />
                  <Text style={styles.filterSectionTitle}>
                    {t("maps.filters.availability")}
                  </Text>
                </View>
                <View style={styles.optionsGrid}>
                  {[
                    {
                      key: "todos",
                      label: t("maps.filters.all"),
                      icon: "store",
                    },
                    {
                      key: "abierto",
                      label: t("maps.filters.open"),
                      icon: "check-circle",
                    },
                    {
                      key: "cerrado",
                      label: t("maps.filters.closed"),
                      icon: "cancel",
                    },
                    { key: "24h", label: "24h", icon: "schedule" },
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
                      <MaterialIcons
                        name={disp.icon as any}
                        size={24}
                        color={
                          disponibilidadFiltro === disp.key
                            ? "#FF6B6B"
                            : "#8E8E93"
                        }
                      />
                      <Text
                        style={[
                          styles.optionLabel,
                          disponibilidadFiltro === disp.key &&
                            styles.optionLabelActive,
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
                <LinearGradient
                  colors={["#FF6B6B", "#FF8E53"]}
                  style={styles.applyButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <MaterialIcons name="check" size={20} color="#FFF" />
                  <Text style={styles.applyButtonText}>
                    {t("maps.filters.apply_filters")}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
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

  heroHeader: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: -0.5,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  subtitleBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subtitleBadgeText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 15,
    fontWeight: "500",
  },
  filterHeaderButton: {
    marginLeft: 16,
  },
  filterHeaderButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A2E",
    fontWeight: "500",
  },
  activeFiltersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "#FFD0D0",
  },
  filterChipText: {
    color: "#FF6B6B",
    fontSize: 13,
    fontWeight: "600",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 24,
    marginVertical: 20,
    padding: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  loadingIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  spinner: {
    marginTop: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: "#1A1A2E",
    fontWeight: "700",
    textAlign: "center",
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
    textAlign: "center",
  },

  mapContainer: {
    flex: 1,
  },
  mapWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    position: "relative",
  },
  map: {
    height: isMobile ? 220 : 300,
  },
  mapLoadingOverlay: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapLoadingText: {
    fontSize: 13,
    color: "#1A1A2E",
    fontWeight: "600",
  },

  pharmacyList: {
    flex: 1,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A2E",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 12,
    gap: 10,
  },
  listHeaderText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },

  pharmacyCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  pharmacyIconContainer: {
    marginRight: 14,
  },
  pharmacyIconBg: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  pharmacyInfo: {
    flex: 1,
  },
  pharmacyNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A2E",
    flex: 1,
  },
  badge24h: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badge24hText: {
    color: "#E65100",
    fontSize: 11,
    fontWeight: "800",
  },
  pharmacyDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  pharmacyDetailText: {
    fontSize: 13,
    color: "#8E8E93",
    flex: 1,
    fontWeight: "500",
  },
  pharmacyPhoneText: {
    fontSize: 13,
    color: "#FF6B6B",
    fontWeight: "600",
  },
  pharmacyRight: {
    alignItems: "flex-end",
    gap: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 5,
  },
  statusOpen: {
    backgroundColor: "#E8F5E9",
  },
  statusClosed: {
    backgroundColor: "#F5F5F5",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotOpen: {
    backgroundColor: "#4CAF50",
  },
  dotClosed: {
    backgroundColor: "#9E9E9E",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  textOpen: {
    color: "#2E7D32",
  },
  textClosed: {
    color: "#757575",
  },
  distanceBadge: {
    backgroundColor: "#FFF0F0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  distanceText: {
    color: "#FF6B6B",
    fontSize: 12,
    fontWeight: "700",
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 24,
    marginVertical: 20,
    padding: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  errorIconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 12,
    textAlign: "center",
  },
  errorText: {
    fontSize: 15,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 20,
    fontWeight: "500",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B6B",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: height * 0.85,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#D0D0D0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 8,
  },
  swipeHint: {
    fontSize: 12,
    color: "#BDBDBD",
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "500",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A2E",
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
    fontWeight: "500",
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },

  filterSection: {
    marginBottom: 24,
  },
  filterSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  modalInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  modalInput: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A2E",
    fontWeight: "500",
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionButton: {
    flex: 1,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: "#E8E8E8",
  },
  optionActive: {
    backgroundColor: "#FFF0F0",
    borderColor: "#FF6B6B",
  },
  optionNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#8E8E93",
    marginBottom: 2,
  },
  optionNumberActive: {
    color: "#FF6B6B",
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
    marginTop: 4,
  },
  optionLabelActive: {
    color: "#FF6B6B",
  },

  applyButton: {
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  applyButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
