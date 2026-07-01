import { collection, doc, getDoc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { enviarPushNotification } from "../services/notifications";
import { Reporte, StatusReporte } from "../types/reports";

export function useReportes(
    usuario: { uid: string; nome: string } | null,
    apenasAtivos: boolean = false,
    apenasDoUsuario: boolean = false
) {
    const [reportes, setReportes] = useState<Reporte[]>([]);
    const [filtroStatus, setFiltroStatus] = useState<StatusReporte | "Todos">("Todos");
    const [filtroTipos, setFiltroTipos] = useState<string[]>([]);

    useEffect(() => {
        let q;

        if (apenasDoUsuario && usuario) {
            // Aba Reportes: apenas os reportes do usuário logado, todos os status
            q = query(
                collection(db, "reportes"),
                where("donoId", "==", usuario.uid)
            );
        } else if (apenasAtivos) {
            // Mapa: todos os reportes ativos (excluí resolvidos e cancelados)
            q = query(
                collection(db, "reportes"),
                where("status", "not-in", ["Resolvido", "Cancelado"])
            );
        } else {
            q = collection(db, "reportes");
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const dados = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Reporte));
            setReportes(dados);
        });
        return () => unsubscribe();
    }, [apenasAtivos, apenasDoUsuario, usuario?.uid]);

    const reportesFiltrados = reportes.filter(r => {
        const passaStatus = filtroStatus === "Todos" || r.status === filtroStatus;
        const passaTipo = filtroTipos.length === 0 || r.tipos.some(t => filtroTipos.includes(t));
        return passaStatus && passaTipo;
    });

    function diasPendente(timestamp: string): number {
        const criado = new Date(timestamp).getTime();
        const agora = Date.now();
        return Math.floor((agora - criado) / (1000 * 60 * 60 * 24));
    }

    async function tentarNotificar(expoPushToken: string | null | undefined, titulo: string, corpo: string) {
        if (!expoPushToken) return;
        try {
            await enviarPushNotification(expoPushToken, titulo, corpo);
        } catch (e) {
            console.warn('Falha ao enviar notificação push:', e);
        }
    }

    async function handleColetar(reporteId: string) {
        if (!usuario) return;
        const reporteRef = doc(db, 'reportes', reporteId);
        const snap = await getDoc(reporteRef);
        const reporte = snap.data();
        if (!reporte) return;

        if (reporte.status !== 'Pendente') {
            throw new Error('Este reporte já foi coletado por outro usuário.');
        }

        try {
            await updateDoc(reporteRef, {
                status: 'Em Coleta',
                coletorId: usuario.uid,
                coletorNome: usuario.nome,
            });
        } catch (e: any) {
            if (e?.code === 'permission-denied') {
                throw new Error('Este reporte já foi coletado por outro usuário.');
            }
            throw e;
        }

        const donoSnap = await getDoc(doc(db, 'usuarios', reporte.donoId));
        const dono = donoSnap.data();
        await tentarNotificar(
            dono?.expoPushToken,
            '♻️ Alguém quer coletar seu reporte!',
            `${usuario.nome} se ofereceu para coletar: ${reporte.tipos?.join(', ')}`
        );
    }

    async function handleConfirmarColeta(reporteId: string) {
        if (!usuario) return;
        const reporteRef = doc(db, 'reportes', reporteId);
        const snap = await getDoc(reporteRef);
        const reporte = snap.data();
        if (!reporte) return;
        if (reporte.donoId !== usuario.uid) return;

        await updateDoc(reporteRef, {
            status: 'Resolvido',
            resolvidoEm: new Date().toISOString(),
        });

        if (reporte.coletorId) {
            const coletorSnap = await getDoc(doc(db, 'usuarios', reporte.coletorId));
            const coletor = coletorSnap.data();
            await tentarNotificar(
                coletor?.expoPushToken,
                '✅ Coleta confirmada!',
                `${usuario.nome} confirmou que você coletou: ${reporte.tipos?.join(', ')}`
            );
        }
    }

    async function handleCancelarColeta(reporteId: string) {
        if (!usuario) return;
        const reporteRef = doc(db, 'reportes', reporteId);
        const snap = await getDoc(reporteRef);
        const reporte = snap.data();
        if (!reporte) return;

        await updateDoc(reporteRef, {
            status: 'Pendente',
            coletorId: null,
            coletorNome: null,
            canceladoEm: new Date().toISOString(),
        });

        if (reporte.coletorId) {
            const coletorSnap = await getDoc(doc(db, 'usuarios', reporte.coletorId));
            const coletor = coletorSnap.data();
            await tentarNotificar(
                coletor?.expoPushToken,
                '❌ Coleta cancelada',
                `${usuario.nome} cancelou a coleta: ${reporte.tipos?.join(', ')}`
            );
        }
    }

    return {
        reportes: reportesFiltrados,
        filtroStatus,
        setFiltroStatus,
        filtroTipos,
        setFiltroTipos,
        diasPendente,
        handleColetar,
        handleConfirmarColeta,
        handleCancelarColeta,
    };
}
