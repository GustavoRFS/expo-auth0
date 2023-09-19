import { useAuth0 } from "expo-auth0";
import { View, Text, Button, Image } from "react-native";

const Home = () => {
  const { user, authorize, clearSession } = useAuth0();

  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {user ? (
        <>
          <Image
            source={{ uri: user.picture }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <Text>{user.name}</Text>
          <Text>{user.nickname}</Text>
          <Text>{user.email}</Text>
          <Button title="Logout" onPress={clearSession} />
        </>
      ) : (
        <Button title="Login" onPress={authorize} />
      )}
    </View>
  );
};

export default Home;
