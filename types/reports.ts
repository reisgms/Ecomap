// src/types/reporte.ts
export type StatusReporte = "Pendente" | "Em Coleta" | "Resolvido" | "Cancelado";

export type Reporte = {
    id: string;
    descricao: string;
    tipos: string[];
    imagem: string | null;
    timestamp: string;
    localizacao: { latitude: number; longitude: number };
    status: StatusReporte;
    donoId: string;
    donoNome: string;
    coletorId?: string | null;
    coletorNome?: string | null;
    resolvidoEm?: string | null;
    canceladoEm?: string | null;
};