import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Auth0Provider } from "expo-auth0";
import Home from "./src/Home";

export default function App() {
  return (
    <Auth0Provider
      clientId="YOUR_CLIENT_ID"
      domain="YOUR_DOMAIN"
      scopes={["profile", "email", "openid"]}
    >
      <View style={styles.container}>
        <Home />
      </View>
    </Auth0Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
