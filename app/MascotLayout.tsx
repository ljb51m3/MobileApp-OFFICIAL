import { Stack } from "expo-router";

export default function MascotLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="MascotHomepage"
        options={{
          headerTitle: "My Mascot",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Store/PetStore"
        options={{
          headerTitle: "Pet Store",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
