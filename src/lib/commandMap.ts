type Command = {
    eventId: number,
    eventName: string,
    simVariable: string,
    unit: string,
    expectedValue: number,
};

export const commandMap = {
    LANDING_LIGHTS_ON:  { eventId: 1,  eventName: "LANDING_LIGHTS_ON",  simVariable: "LIGHT LANDING",        unit: "Bool",    expectedValue: 1 },
    LANDING_LIGHTS_OFF: { eventId: 2,  eventName: "LANDING_LIGHTS_OFF", simVariable: "LIGHT LANDING",        unit: "Bool",    expectedValue: 0 },
    TAXI_LIGHTS_ON:     { eventId: 3,  eventName: "TAXI_LIGHTS_ON",     simVariable: "LIGHT TAXI",           unit: "Bool",    expectedValue: 1 },
    TAXI_LIGHTS_OFF:    { eventId: 4,  eventName: "TAXI_LIGHTS_OFF",    simVariable: "LIGHT TAXI",           unit: "Bool",    expectedValue: 0 },
    STROBE_LIGHTS_ON:   { eventId: 5,  eventName: "STROBES_ON",         simVariable: "LIGHT STROBE",         unit: "Bool",    expectedValue: 1 },
    STROBE_LIGHTS_OFF:  { eventId: 6,  eventName: "STROBES_OFF",        simVariable: "LIGHT STROBE",         unit: "Bool",    expectedValue: 0 },
    FLAPS_UP:           { eventId: 7,  eventName: "FLAPS_UP",           simVariable: "FLAPS HANDLE INDEX",   unit: "Number",  expectedValue: 0 },
    FLAPS_1:            { eventId: 8,  eventName: "FLAPS_1",            simVariable: "FLAPS HANDLE INDEX",   unit: "Number",  expectedValue: 1 },
    FLAPS_2:            { eventId: 9,  eventName: "FLAPS_2",            simVariable: "FLAPS HANDLE INDEX",   unit: "Number",  expectedValue: 2 },
    FLAPS_3:            { eventId: 10, eventName: "FLAPS_3",            simVariable: "FLAPS HANDLE INDEX",   unit: "Number",  expectedValue: 3 },
    FLAPS_FULL:         { eventId: 11, eventName: "FLAPS_DOWN",         simVariable: "FLAPS HANDLE PERCENT", unit: "Percent", expectedValue: 100 },
} as const satisfies Record<string, Command>;

export type CommandName = keyof typeof commandMap;
export type SimVariables = typeof commandMap[CommandName]["simVariable"];
