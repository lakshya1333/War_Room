import { Server } from 'socket.io';
interface ReconParams {
    sessionId: string;
    url?: string;
    repo?: string;
    image?: {
        buffer: Buffer;
        mimetype: string;
        originalname: string;
    };
    io: Server;
}
export declare function startReconnaissance(params: ReconParams): Promise<void>;
export {};
//# sourceMappingURL=reconService.d.ts.map