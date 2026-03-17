import { Tabs } from "expo-router";


export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false}}
        initialRouteName="mapa">
            <Tabs.Screen name="mapa"/>
            <Tabs.Screen name="perfil"/>
            <Tabs.Screen name="reportes"/>
        </Tabs>
    );
}