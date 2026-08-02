import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProfileRecipes } from "@/hooks/useProfileRecipes";
import Card from "@/components/main/Card";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";

export default function Profile() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  // Custom hook to query only current user's contributed recipes
  const { recipes, isLoading, isRefreshing, error, refresh } = useProfileRecipes();

  const handleEditProfile = () => {
    router.push("/profiles" as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {error && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={20} color="#E53935" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Card recipe={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={refresh}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            {/* Title Header */}
            <Text style={styles.titleText}>Profile</Text>

            {/* Modular Profile Header */}
            <ProfileHeader
              name={user?.name || null}
              username={user?.username || null}
              profileImage={user?.profileImage || null}
            />

            {/* Modular Contribution Stats */}
            <ProfileStats count={recipes.length} />

            {/* Edit Profile Action button (No Share button) */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={handleEditProfile}
                activeOpacity={0.8}
              >
                <Ionicons name="create-outline" size={18} color="#FFFFFF" />
                <Text style={styles.editBtnText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

            {/* Contributions Header */}
            <View style={styles.sectionHeader}>
              <Ionicons name="flame" size={18} color="#F97B22" />
              <Text style={styles.sectionHeaderText}>My Contributed Recipes</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#F97B22" />
            </View>
          ) : (
            <View style={styles.centerContainer}>
              <Ionicons name="journal-outline" size={48} color="#C9B9AC" />
              <Text style={styles.emptyTitle}>No Recipes Yet</Text>
              <Text style={styles.emptySubtitle}>
                You haven't contributed any recipes. Create one on the "Create" tab to share it!
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF6EC",
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEEBEE",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  errorText: {
    color: "#C62828",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerContainer: {
    paddingTop: 16,
    alignItems: "center",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2B1A12",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  actionsContainer: {
    width: "100%",
    marginBottom: 24,
  },
  editBtn: {
    backgroundColor: "#F97B22",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 14,
    width: "100%",
  },
  editBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#F97B22",
    paddingBottom: 4,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2B1A12",
  },
  centerContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2B1A12",
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#8A7466",
    textAlign: "center",
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});
