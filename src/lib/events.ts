import { EventFlag, SimConnectConstants, OpenEvent } from "node-simconnect";

/**
 * Sends a client event to the simulator.
 *
 * @param {OpenEvent} simConnection - The connection to the simulator.
 * @param {number} eventId - The event ID to send.
 * @returns {void}
 */
export async function sendEventToSim(simConnection: OpenEvent, eventId: number) {
    simConnection.handle.transmitClientEvent(
        SimConnectConstants.OBJECT_ID_USER,
        eventId,
        0, // Default - no group ID
        1, // Highest Priority
        EventFlag.EVENT_FLAG_GROUPID_IS_PRIORITY
    );
}