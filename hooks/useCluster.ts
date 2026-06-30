import { useMemo } from 'react';
import { Reporte } from '../types/reports';

export type Cluster = {
    id: string;
    coordinates: { latitude: number; longitude: number };
    reportes: Reporte[];
};

function distanciaMetros(
    lat1: number, lon1: number,
    lat2: number, lon2: number,
): number {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Agrupa reportes próximos em clusters.
 * Reportes dentro de `raioMetros` entre si formam um único cluster.
 * Clusters com 1 reporte usam o id do reporte; clusters com N>1 usam "cluster_N".
 */
export function useCluster(reportes: Reporte[], raioMetros: number = 40): Cluster[] {
    return useMemo(() => {
        const visitados = new Set<string>();
        const clusters: Cluster[] = [];

        for (const reporte of reportes) {
            if (visitados.has(reporte.id)) continue;

            const grupo: Reporte[] = [reporte];
            visitados.add(reporte.id);

            for (const outro of reportes) {
                if (visitados.has(outro.id)) continue;
                const dist = distanciaMetros(
                    reporte.localizacao.latitude,
                    reporte.localizacao.longitude,
                    outro.localizacao.latitude,
                    outro.localizacao.longitude,
                );
                if (dist <= raioMetros) {
                    grupo.push(outro);
                    visitados.add(outro.id);
                }
            }

            // Centro geométrico do cluster
            const lat = grupo.reduce((s, r) => s + r.localizacao.latitude, 0) / grupo.length;
            const lng = grupo.reduce((s, r) => s + r.localizacao.longitude, 0) / grupo.length;

            clusters.push({
                id: grupo.length === 1 ? grupo[0].id : `cluster_${clusters.length}`,
                coordinates: { latitude: lat, longitude: lng },
                reportes: grupo,
            });
        }

        return clusters;
    }, [reportes, raioMetros]);
}
