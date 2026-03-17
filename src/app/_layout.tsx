import {Stack} from "expo-router";
import { AuthContext, AuthProvider } from "../contexts/AuthContext";
import { useContext } from "react";


export default function Layout() {
  return (
    <AuthProvider>
      <Navigator/>
    </AuthProvider>
  );
}

function Navigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="index"/>
          <Stack.Screen name="login"/>
          <Stack.Screen name="cadastro"/>
        </>
      ) : (
        <Stack.Screen name="(tabs)"/>
      )}
    </Stack>
  );
}
