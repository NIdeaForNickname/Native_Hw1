const CalcOperations = {
    add: 'add',
    sub: 'sub',
    mul: 'mul',
    div: 'div',
    pow: 'pow',
    rot: 'rot',
    per: 'per',
} as const;

type CalcOperations = (typeof CalcOperations)[keyof typeof CalcOperations];

export default CalcOperations;