const CalcButtonType = {
    digit: 'digit',
    operation: 'operation',
    equal: 'equal',
    memoryActive: 'memoryActive',
    memoryDisabled: 'memoryDisabled',
} as const;

type CalcButtonType = (typeof CalcButtonType)[keyof typeof CalcButtonType];

export default CalcButtonType;