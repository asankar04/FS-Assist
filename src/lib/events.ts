import { EventFlag, SimConnectConstants, SimConnectConnection } from "node-simconnect";
import { commandMap, Command } from "./commandMap.js";
import { sessionState, SessionState } from "../data/sessionState.js";

/**
 * Sends a client event to the simulator.
 *
 * @param {SimConnectConnection} handle - The connection to the simulator.
 * @param {Command} command - The command to send (Sim event)
 * @returns {boolean} - True if the command was set successfully, false if it timed out
 */
export async function sendEventToSim(handle: SimConnectConnection, command: Command): Promise<boolean> {
    const simVariable = command.simVariable as keyof SessionState;
    const expectedValue = command.expectedValue;
    const eventName = command.eventName;
    const eventId = command.eventId;

    // Check if the command output is already set
    if (sessionState[simVariable] === expectedValue) {
        console.log(`Command ${eventName} is already set to ${expectedValue}`);
        return true;
    }
    
    // Transmit Client Event
    try {
        handle.transmitClientEvent(
            SimConnectConstants.OBJECT_ID_USER,
            eventId,
            0, // Default - no group ID
            1, // Highest Priority
            EventFlag.EVENT_FLAG_GROUPID_IS_PRIORITY
        );
    } catch (error) {
        console.error('Error sending event to sim:', error);
        return false;
    }

    // Verify the event 
    if (!await waitForEvent(sessionState, command)) {
        console.error(`Failed to set command: ${eventName}, Timed out`);
        return false;
    }

    // Log & return success
    console.log(`Command ${eventName} set to ${expectedValue}`);
    return true;
}

async function waitForEvent(sessionState: SessionState, command: Command) {
    let passedTime: number = 0;
    while (sessionState[command.simVariable as keyof SessionState] != command.expectedValue) {
        if (passedTime >= 2000) {
            return false;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
        passedTime += 100;
    }
    return true;
}
