// src/hooks/usePermissoesReporte.ts
import { Reporte } from '../types/reports';

export function usePermissoesReporte(
    reporte: Reporte | null,
    uid: string | undefined
) {
    if (!reporte || !uid) return {
        podeColetar: false,
        podeConfirmar: false,
        podeCancelar: false,
        isDono: false,
    };

    const isDono = reporte.donoId === uid;
    const isOutro = !isDono;

    return {
        isDono,
        podeColetar: isOutro && reporte.status === 'Pendente',
        podeConfirmar: isDono && reporte.status === 'Em Coleta',
        podeCancelar: isDono && reporte.status === 'Em Coleta',
    };
}