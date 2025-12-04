import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ModalAddMedicine } from "./_components/ModalAddMedicine";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createIntakeMutation, getAllMedicines } from "@cuidamed-api/client";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { t } from "i18next";

export const AddMedicinePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<number | null>(null);
  const [allMedicines, setAllMedicines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { treatmentId: treatmentIdStr } = useLocalSearchParams();
  const treatmentId = treatmentIdStr
    ? parseInt(treatmentIdStr as string, 10)
    : undefined;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        setIsLoading(true);
        const response = await getAllMedicines({ throwOnError: true });
        setAllMedicines(response.data || []);
      } catch (error) {
        console.error("Error loading medicines:", error);
        setAllMedicines([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadMedicines();
  }, []);

  const mutation = useMutation(createIntakeMutation());

  const handleAddMedicineClick = (formData: {
    medicineId: number | null;
    startDate: string;
    endDate: string | null;
    doseAmount: number | null;
    doseUnit: string;
    dosingTimes: any[];
  }) => {
    if (
      !formData.startDate ||
      !formData.doseAmount ||
      !formData.doseUnit ||
      formData.dosingTimes.length === 0 ||
      selectedMedicine === null ||
      !treatmentId
    ) {
      return;
    }

    const body: any = {
      medicineId: selectedMedicine,
      doseAmount: formData.doseAmount,
      doseUnit: formData.doseUnit,
      dosingTimes: formData.dosingTimes,
      startDate: formData.startDate,
      treatmentId: treatmentId,
    };

    if (formData.endDate) {
      body.endDate = formData.endDate;
    }

    mutation.mutate({
      body,
      path: { treatmentId: treatmentId },
    });
    setOpenModal(false);
  };

  const filteredMedicines = allMedicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={styles.medicineItem}
      onPress={() => {
        setSelectedMedicine(Number(item.id));
        setOpenModal(true);
      }}
      activeOpacity={0.6}
      accessibilityRole="button"
    >
      <View style={styles.medicineContent}>
        <View style={[styles.medicineIndex, { backgroundColor: getColorForIndex(index) }]}>
          <Text style={styles.medicineIndexText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.medicineTextContainer}>
          <Text style={styles.medicineName} numberOfLines={1}>{item.name}</Text>
          {item.pictureUrl ? (
            <Text style={styles.medicineSubtext} numberOfLines={1}>{item.pictureUrl}</Text>
          ) : null}
        </View>
      </View>
      <MaterialIcons name="add-circle" size={28} color="#FF6B6B" />
    </TouchableOpacity>
  );

  const getColorForIndex = (index: number) => {
    const colors = ["#FF6B6B", "#FF8E53", "#FFA07A", "#FF7043", "#E57373", "#FF5722", "#FF8A65"];
    return colors[index % colors.length];
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header compacto */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t("treatments.addMedicine.title", { defaultValue: "Añadir medicamento" })}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Barra de búsqueda destacada */}
      <View style={styles.searchSection}>
        <LinearGradient
          colors={["#FF6B6B", "#FF8E53"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.searchGradientBorder}
        >
          <View style={styles.searchInputWrapper}>
            <MaterialIcons name="search" size={24} color="#FF6B6B" />
            <TextInput
              style={[
                styles.searchInput,
                Platform.OS === "web"
                  ? ({ outlineWidth: 0, outlineColor: "transparent" } as any)
                  : {},
              ]}
              placeholder={t("treatments.addMedicine.searchPlaceholder", { defaultValue: "Buscar medicamento..." })}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#999"
              selectionColor="#FF6B6B"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <MaterialIcons name="cancel" size={20} color="#CCC" />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
        
        <Text style={styles.resultsText}>
          {filteredMedicines.length} {filteredMedicines.length === 1 ? "resultado" : "resultados"}
        </Text>
      </View>

      {/* Lista de medicamentos */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Cargando medicamentos...</Text>
        </View>
      ) : filteredMedicines.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="magnify-close" size={64} color="#DDD" />
          <Text style={styles.emptyTitle}>
            {searchQuery ? "Sin resultados" : "No hay medicamentos"}
          </Text>
          <Text style={styles.emptyText}>
            {searchQuery 
              ? `No se encontraron medicamentos con "${searchQuery}"`
              : "No se pudieron cargar los medicamentos"
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredMedicines}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      <ModalAddMedicine
        visible={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleAddMedicineClick}
        treatmentId={treatmentId as number}
        medicineId={selectedMedicine || 0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  headerSpacer: {
    width: 40,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchGradientBorder: {
    borderRadius: 16,
    padding: 2,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A2E",
  },
  resultsText: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 10,
    marginLeft: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  medicineItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  medicineContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  medicineIndex: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  medicineIndexText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  },
  medicineTextContainer: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  medicineSubtext: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
  },
  separator: {
    height: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 15,
    color: "#8E8E93",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A2E",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 15,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
});
