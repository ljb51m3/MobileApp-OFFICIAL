import { Stack } from "expo-router";
import { PointsProvider } from "../components/PointsSystem";

export default function MascotLayout() {
  return (
    <PointsProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "My Mascot",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="store"
          options={{
            headerTitle: "Pet Store",
            headerShown: true,
            presentation: "modal",
          }}
        />
      </Stack>
    </PointsProvider>
  );
}
