import {
    open,
    Protocol,
    SimConnectDataType,
    SimConnectPeriod,
    SimConnectConstants,
    DataRequestFlag,
    EventFlag,
} from "node-simconnect";
import { commandMap } from "./lib/commandMap.js";
import { getSimConnection } from "./simConnect/connect.js";
import { sendEventToSim } from "./lib/events.js";
import { sessionState } from "./data/sessionState.js";
import { DefinitionID, RequestID } from "./lib/types.js";

async function main() {
    // Fetch sim connection
    const { handle } = await getSimConnection();

    // Extract required data definitions and client events from commands
    const dataDefinitions = [...new Map(Object.values(commandMap).map((command) => [command.simVariable, command.unit]))].map(([simVariable, unit]) => ({simVariable, unit}));
    const clientEvents = Object.values(commandMap).map((command) => { return { eventId: command.eventId, eventName: command.eventName }});
    // Add data definitions
    dataDefinitions.forEach((dataDefinition) => {
        handle.addToDataDefinition(
            DefinitionID.LIVE_DATA,
            dataDefinition.simVariable,
            dataDefinition.unit,
            SimConnectDataType.INT32
        )
    })
    // Request defined data
    handle.requestDataOnSimObject(
        RequestID.LIVE_DATA,
        DefinitionID.LIVE_DATA,
        SimConnectConstants.OBJECT_ID_USER,
        SimConnectPeriod.SECOND,
        DataRequestFlag.DATA_REQUEST_FLAG_CHANGED
    );
    // Map client events to sim events
    clientEvents.forEach((clientEvent) => {
        handle.mapClientEventToSimEvent(
            clientEvent.eventId,
            clientEvent.eventName
        )
    })

    // Handle SimObject Data
    handle.on('simObjectData', recvSimObjectData => {
        if (recvSimObjectData.requestID === RequestID.LIVE_DATA) {
            // Load into session state.
            dataDefinitions.forEach((dataDefinition) => {
                sessionState[dataDefinition.simVariable] = recvSimObjectData.data.readInt32();
            })
            console.log(sessionState);
        }
    })

    // Handle System Events
    handle.on('event', function (recvEvent) {
        console.log(recvEvent);
    })
    // Handle Exceptions
    handle.on('exception', function (recvException) {
        console.log(recvException);
    });
    // Handle Quit
    handle.on('quit', function () {
        console.log('FS-2024 quit');
    });

    // Test event sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    const testEvent = commandMap.FLAPS_FULL;
    await sendEventToSim(handle, testEvent);

    await new Promise(resolve => setTimeout(resolve, 4000));
    const testEvent2 = commandMap.FLAPS_1;
    await sendEventToSim(handle, testEvent2);
}

main().catch(console.error);
