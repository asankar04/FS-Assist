import {
    open,
    Protocol,
    OpenEvent
} from "node-simconnect";

let simConnection: Promise<OpenEvent> | null = null;

export function getSimConnection(): Promise<OpenEvent> {
    if (!simConnection) {
        simConnection = open('FS-2024', Protocol.SunRise).then(({ recvOpen, handle }) => {
            console.log('Connected to', recvOpen.applicationName); // Sunrise (MSFS 2024)
            handle.on("close", () => (simConnection = null));
            handle.on("quit", () => (simConnection = null));
            return { recvOpen, handle };
        }).catch((error) => {
            console.error('Error connecting to sim:', error);
            simConnection = null;
            throw error;
        });
    }
    return simConnection;
}