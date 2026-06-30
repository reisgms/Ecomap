import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="mapa"
                options={{
                    title: 'Mapa',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="map" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="reportes"
                options={{
                    title: 'Reportes',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="list" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="perfil"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}