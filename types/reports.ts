export type Reporte = {
    id: string;
    descricao: string;
    tipos: string[];
    imagem: string | null;
    timestamp: string;
    localizacao: { latitude: number; longitude: number };
    status: "Pendente" | "Em Coleta" | "Resolvido";
    donoId: string;
    donoNome: string;
    coletorId?: string;
    coletorNome?: string;
    resolvidoEm?: string;
};