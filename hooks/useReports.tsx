import { collection, doc, getDoc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { enviarPushNotification } from "../services/notifications";
import { Reporte } from "../types/reports";

export function useReportes(
    usuario: { uid: string; nome: string } | null,
    apenasAtivos: boolean = false
) {
    const [reportes, setReportes] = useState<Reporte[]>([]);

    useEffect(() => {
        const q = apenasAtivos
            ? query(collection(db, "reportes"), where("status", "!=", "Resolvido"))
            : collection(db, "reportes");

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const dados = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Reporte));
            setReportes(dados);
        });
        return () => unsubscribe();
    }, [apenasAtivos]);

    async function handleColetar(reporteId: string) {
        if (!usuario) return;
        const reporteRef = doc(db, 'reportes', reporteId);
        const snap = await getDoc(reporteRef);
        const reporte = snap.data();
        if (!reporte) return;

        await updateDoc(reporteRef, {
            status: 'Em Coleta',
            coletorId: usuario.uid,
            coletorNome: usuario.nome,
        });

        const donoSnap = await getDoc(doc(db, 'usuarios', reporte.donoId));
        const dono = donoSnap.data();
        if (dono?.expoPushToken) {
            await enviarPushNotification(
                dono.expoPushToken,
                '🗑️ Alguém vai coletar seu reporte!',
                `${usuario.nome} se ofereceu para coletar: ${reporte.tipos?.join(', ')}`
            );
        }
    }

    async function handleConfirmarColeta(reporteId: string) {
        await updateDoc(doc(db, 'reportes', reporteId), {
            status: 'Resolvido',
            resolvidoEm: new Date().toISOString(),
        });
    }

    return { reportes, handleColetar, handleConfirmarColeta };
}