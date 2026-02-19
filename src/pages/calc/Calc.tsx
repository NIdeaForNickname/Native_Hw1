import { Text, useWindowDimensions, View } from "react-native";
import { useState } from "react";
import CalcStyle from "./css/CalcStyle";
import CalcButton from "./ui/button/CalcButton";
import CalcButtonType from "./ui/button/CalcButtonType";
import ICalcButtonData from "./ui/button/ICalcButtonData";
import CalcOperations from "./model/CalcOperations";

const divZeroMessage = "Cannot divide by zero";
const dotSymbol = '.';
const minusSymbol = '-';
const addSymbol = '+';
const divSymbol = '÷';
const mulSymbol = '×';
const subSymbol = '-';
const rotSymbol = 'ˣ√a';
const powSymbol = 'aˣ';
const perSymbol = '%';
const maxDigits = 16;

interface ICalcState {
    result: string,                           // вміст основного поля калькулятора - "екрану"
    expression: string,                       // вираз, що формується вище "результату"
    needClearResult: boolean,                 // потреба стерти результат при початку введення (після операцій)
    needClearExpression: boolean,             // потреба стерти вираз при початку введення (після операцій)
    isError: boolean,                         // чи знаходиться калькулятор в аварійному стані (показ помилки)
    operation?: CalcOperations | undefined,   // операція, що була натиснена (+/-/*...)
    prevArgument?: number | undefined,        // аргумент, що був перед натисненням операції
    memory?: number | undefined,
};

const initialState:ICalcState = {
    result: "0",
    expression: "",
    needClearResult: false,
    needClearExpression: false,
    isError: false,
};

export default function Calc() {
    const {width, height} = useWindowDimensions();
    const [calcState, setCalcState] = useState<ICalcState>(initialState);

    const operationClick = (btn:ICalcButtonData) => {
        const newState:ICalcState = {...calcState,
            needClearResult: true,
            needClearExpression: false,
            operation:
                btn.text == divSymbol ? CalcOperations.div
                    : btn.text == mulSymbol ? CalcOperations.mul
                        : btn.text == addSymbol ? CalcOperations.add
                            : btn.text == subSymbol ? CalcOperations.sub
                                : btn.text == rotSymbol ? CalcOperations.rot
                                    : btn.text == powSymbol ? CalcOperations.pow
                                        : btn.text == perSymbol ? CalcOperations.per
                                            : undefined,
        };
        if(calcState.operation) {   // повторне натискання -- є попередня невиконана операція, слід обчислити
            const prevResult = doOperationWithState();
            const res = numToResult(prevResult);
            newState.expression = res + ' ' + btn.text;
            newState.result = res;
            newState.prevArgument = prevResult;
        }
        else {
            newState.expression = calcState.result + ' ' + btn.text;
            newState.prevArgument = resToNumber();
        }
        setCalcState(newState);
    };

    const equalClick = (_?:ICalcButtonData) => {
        if(calcState.operation) {
            setCalcState({...calcState,
                expression: calcState.expression + ' ' + calcState.result + ' =',
                needClearResult: true,
                needClearExpression: true,
                prevArgument: undefined,
                operation: undefined,
                result: numToResult( doOperationWithState() ),
            });
        }
    };

    const doOperationWithState = ():number => {
        const arg = resToNumber();
        return calcState.operation == CalcOperations.div ? calcState.prevArgument! / arg
            :  calcState.operation == CalcOperations.mul ? calcState.prevArgument! * arg
                :  calcState.operation == CalcOperations.add ? calcState.prevArgument! + arg
                    :  calcState.operation == CalcOperations.sub ? calcState.prevArgument! - arg
                        :  calcState.operation == CalcOperations.pow ? calcState.prevArgument! ** arg
                            :  calcState.operation == CalcOperations.per ? calcState.prevArgument! * arg / 100
                                :  calcState.operation == CalcOperations.rot ? calcState.prevArgument! ** (1 / arg)
                                    :  Number.NaN
    };

    const digitClick = (btn:ICalcButtonData) => {
        var res = calcState.result;
        if(res === "0" || calcState.needClearResult || calcState.isError) {
            res = "";
            calcState.needClearResult = false;
            calcState.isError = false;
        }
        if(calcState.needClearExpression) {
            calcState.needClearExpression = false;
            calcState.expression = "";
        }

        // Обмежити введення 16 (maxDigits) цифрами (саме цифрами, точку та знак (мінус) ігнорувати)
        if(res.replace(dotSymbol, '').replace(minusSymbol, '').length >= maxDigits) return;

        setCalcState({...calcState, result: res + btn.text});
    };

    const backspaceClick = (_:ICalcButtonData) => {
        setCalcState(prevState => {
            if(prevState.needClearExpression) {
                prevState.needClearExpression = false;
                prevState.expression = "";
            }
            if(prevState.isError) {
                prevState.isError = false;
                prevState.result = "0";
                prevState.expression = "";
            }
            if(prevState.needClearResult) {
                prevState.needClearResult = false;
                prevState.result = "0";
            }
            else {
                prevState.result = calcState.result.length > 1
                    ? calcState.result.substring(0, calcState.result.length - 1)
                    : "0"
            }
            return {...prevState};
        });
    }

    const dotClick = (btn:ICalcButtonData) => {
        const newState = {...calcState};

        if(calcState.needClearExpression) {
            newState.expression = "";
            newState.needClearExpression = false;
        }

        if(calcState.needClearResult) {
            newState.result = "0" + dotSymbol;
            newState.needClearResult = false;
        }
        else if(! calcState.result.includes(btn.text)) {
            newState.result = calcState.result + btn.text;
        }
        setCalcState(newState);
    };

    const inverseClick = (_:ICalcButtonData) => {
        var arg = resToNumber();
        if (calcState.operation) {
            arg = doOperationWithState();
            setCalcState({...calcState,
                prevArgument: undefined,
                operation: undefined,
                expression: `1/(${doOperationWithState()})`,
                needClearExpression: true,
                needClearResult: arg == 0,
                isError: arg == 0,
                result: arg == 0
                    ? divZeroMessage
                    : numToResult(1.0 / doOperationWithState())
            });
        }
        else {
            setCalcState({
                ...calcState,
                expression: `1/(${calcState.result})`,
                needClearExpression: true,
                needClearResult: arg == 0,
                isError: arg == 0,
                result: arg == 0
                    ? divZeroMessage
                    : numToResult(1.0 / resToNumber())
            });
        }
    };

    const clearClick = (_:ICalcButtonData) => {
        setCalcState({...calcState,
            expression: "",
            isError: false,
            result: "0",
            operation: undefined,
            prevArgument: undefined
        });
    }

    const resToNumber = (): number => {
        var res = calcState.result.replace(dotSymbol, '.').replace(minusSymbol, '-');
        return Number(res);
    };

    const numToResult = (num: number): string => {
        var res = num.toString();
        if(num >= 1e-6) {   // <= 9.9e-7 автоматично спрацьовує ехр-форма
            res = res.substring(0, maxDigits + 1);   // +1 - на символ коми
        }
        res = res.replace('.', dotSymbol);   // замінюємо стандарту десятичну точку на dotSymbol
        return res;
    }

    const formatDisplay = (val: string): string => {
        const [integer, fraction] = val.split('.');

        const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, "\u2009");

        return fraction !== undefined ? `${formattedInteger}.${fraction}` : formattedInteger;
    };

    const portraitView = () => <View style={CalcStyle.calc}>
        <Text style={CalcStyle.expression}>{calcState.expression}</Text>
        <Text style={[CalcStyle.result, {fontSize: (calcState.result.length <= 12 ? 50 : (width - 20) / calcState.result.length * 1.8 )}]}>{formatDisplay(calcState.result)}</Text>
        <View style={CalcStyle.memoryRow}>
            <CalcButton data={{text:"MC", buttonType: calcState.isError ? CalcButtonType.memoryDisabled : CalcButtonType.memoryActive, action: () => setCalcState({...calcState, memory: undefined})}}/>
            <CalcButton data={{text:"MS", buttonType: calcState.isError ? CalcButtonType.memoryDisabled : CalcButtonType.memoryActive, action: () => setCalcState({...calcState, memory: resToNumber()})}}/>
            <CalcButton data={{text:"MR", buttonType: calcState.isError || calcState.memory == undefined ? CalcButtonType.memoryDisabled : CalcButtonType.memoryActive, action: () => setCalcState({...calcState, result: numToResult(calcState.memory!)})}}/>
            <CalcButton data={{text:"M+", buttonType: calcState.isError || calcState.memory == undefined ? CalcButtonType.memoryDisabled : CalcButtonType.memoryActive, action: () => setCalcState({...calcState, result: numToResult(calcState.memory! + resToNumber())})}}/>
            <CalcButton data={{text:"M-", buttonType: calcState.isError || calcState.memory == undefined ? CalcButtonType.memoryDisabled : CalcButtonType.memoryActive, action: () => setCalcState({...calcState, result: numToResult(calcState.memory! - resToNumber())})}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:perSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: operationClick}}/>
            <CalcButton data={{text:"CE", buttonType: CalcButtonType.operation}}/>
            <CalcButton data={{text:"C",  buttonType: CalcButtonType.operation, action: clearClick}}/>
            <CalcButton data={{text:"⌫", buttonType: CalcButtonType.operation, action: backspaceClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"1/x", buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: inverseClick}}/>
            <CalcButton data={{text:rotSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: operationClick}}/>
            <CalcButton data={{text:powSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: operationClick}}/>
            <CalcButton data={{text:divSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: operationClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"7", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"8", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"9", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:mulSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: operationClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"4", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"5", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"6", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:subSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: operationClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"1", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"2", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"3", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:addSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: operationClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"+/-", buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.digit}}/>
            <CalcButton data={{text:"0", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:dotSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.digit, action: dotClick}}/>
            <CalcButton data={{text:"=", buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.equal, action: equalClick}}/>
        </View>
    </View>;

    const landscapeView = () => <View style={CalcStyle.calc}>
        <View style={CalcStyle.containerResExpMem}>
            <View style={CalcStyle.containerExpMem}>
                <Text style={CalcStyle.expression}>{calcState.expression}</Text>
                <View style={CalcStyle.memoryRow}>
                    <CalcButton data={{text:"MC", buttonType: calcState.isError ? CalcButtonType.memoryDisabled : CalcButtonType.memoryActive, action: () => setCalcState({...calcState, memory: undefined})}}/>
                    <CalcButton data={{text:"MS", buttonType: calcState.isError ? CalcButtonType.memoryDisabled : CalcButtonType.memoryActive, action: () => setCalcState({...calcState, memory: resToNumber()})}}/>
                    <CalcButton data={{text:"MR", buttonType: calcState.isError || calcState.memory == undefined ? CalcButtonType.memoryDisabled : CalcButtonType.memoryActive, action: () => setCalcState({...calcState, result: numToResult(calcState.memory!)})}}/>
                    <CalcButton data={{text:"M+", buttonType: calcState.isError || calcState.memory == undefined ? CalcButtonType.memoryDisabled : CalcButtonType.memoryActive, action: () => setCalcState({...calcState, result: numToResult(calcState.memory! + resToNumber())})}}/>
                    <CalcButton data={{text:"M-", buttonType: calcState.isError || calcState.memory == undefined ? CalcButtonType.memoryDisabled : CalcButtonType.memoryActive, action: () => setCalcState({...calcState, result: numToResult(calcState.memory! - resToNumber())})}}/>
                </View>
            </View>
            <Text style={[CalcStyle.result, {fontSize: (calcState.result.length <= 12 ? 50 : (width - 20) / calcState.result.length * 1.8 )}]}>{formatDisplay(calcState.result)}</Text>
        </View>

        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"7", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"8", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"9", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:divSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: operationClick}}/>
            <CalcButton data={{text:perSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: operationClick}}/>
            <CalcButton data={{text:"⌫", buttonType: CalcButtonType.operation, action: backspaceClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"4", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"5", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"6", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:mulSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: operationClick}}/>
            <CalcButton data={{text:"1/x", buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: inverseClick}}/>
            <CalcButton data={{text:"CE", buttonType: CalcButtonType.operation}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"1", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"2", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"3", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:subSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: operationClick}}/>
            <CalcButton data={{text:rotSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: operationClick}}/>
            <CalcButton data={{text:"C",  buttonType: CalcButtonType.operation, action: clearClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:minusSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.digit, action: inverseClick}}/>
            <CalcButton data={{text:"0", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:dotSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.digit, action: dotClick}}/>
            <CalcButton data={{text:addSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: operationClick}}/>
            <CalcButton data={{text:powSymbol, buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.operation, action: operationClick}}/>
            <CalcButton data={{text:"=", buttonType: calcState.isError ? CalcButtonType.disabled : CalcButtonType.equal}}/>
        </View>
    </View>;

    return width < height ? portraitView() : landscapeView();
}

