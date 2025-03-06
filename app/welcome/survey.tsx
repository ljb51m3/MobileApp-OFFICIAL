import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { TouchableOpacity, StyleSheet, View, Text, Image } from "react-native";

export default function SurveyScreen() {
  const router = useRouter();

  return (
    <View>
      <Text style={{ fontSize: 60, marginTop: 60 }}>Survey screen</Text>
      <TouchableOpacity onPress={() => router.push("/welcome/welcome")}>
        <View>
          <Text>welcome screen</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
