import { Text, useWindowDimensions, View } from "react-native";
import { useState } from "react";
import CalcStyle from "./css/CalcStyle";
import CalcButton from "./ui/button/CalcButton";
import CalcButtonType from "./ui/button/CalcButtonType";
import ICalcButtonData from "./ui/button/ICalcButtonData";

export default function Calc() {
    const {width, height} = useWindowDimensions();const [result, setResult] = useState<string>("0");
    const [expression, setExpression] = useState<string>("");
    const dotSymbol = '.';
    const minusSymbol = '-';

    const formatDisplay = (val: string): string => {
        const [integer, fraction] = val.split('.');

        const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, "\u2009");

        return fraction !== undefined ? `${formattedInteger}.${fraction}` : formattedInteger;
    };

    const digitClick = (btn:ICalcButtonData) => {
        // Обмежити введення 16 цифрами (саме цифрами, точку та знак (мінус) ігнорувати)
        if(result.replace(dotSymbol, '').replace(minusSymbol, '').length >= 16) return;

        var res = result;
        console.log(res);
        if(res === "0") {
            res = "";
        }
        setResult(res + btn.text);
    };

    const backspaceClick = (_:ICalcButtonData) => {
        if(result.length > 1) {
            setResult(result.substring(0, result.length - 1));
        }
        else {
            setResult("0");
        }
    }

    const dotClick = (btn:ICalcButtonData) => {
        // десятична кома (точка):
        // якщо на рез. "0", то він не стирається, буде "0,"
        // якщо у рез. вже є кома, то натиснення ігнорується
        // Символ коми відповідає тексту на кнопці
        if(!result.includes(btn.text)) {
            setResult(result + btn.text);
        }
    };// parseFloat(result).toLocaleString('en-US').replace(/,/g, '\u2009')

    const portraitView = () => <View style={CalcStyle.calc}>
        <Text style={CalcStyle.expression}>{expression}</Text>
        <Text style={[CalcStyle.result, {fontSize: (result.length <= 12 ? 50 : (width - 20) / result.length * 1.8 )}]}>{formatDisplay(result)}</Text>
        <View style={CalcStyle.memoryRow}>
            <CalcButton data={{text:"MC", buttonType: CalcButtonType.memoryActive}}/>
            <CalcButton data={{text:"MS", buttonType: CalcButtonType.memoryActive}}/>
            <CalcButton data={{text:"MR", buttonType: CalcButtonType.memoryDisabled}}/>
            <CalcButton data={{text:"M+", buttonType: CalcButtonType.memoryDisabled}}/>
            <CalcButton data={{text:"M-", buttonType: CalcButtonType.memoryDisabled}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"aˣ",  buttonType: CalcButtonType.operation, action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"CE", buttonType: CalcButtonType.operation}}/>
            <CalcButton data={{text:"C",  buttonType: CalcButtonType.operation}}/>
            <CalcButton data={{text:"⌫", buttonType: CalcButtonType.operation, action: backspaceClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"ˣ√a", buttonType: CalcButtonType.operation}}/>
            <CalcButton data={{text:"1/x", buttonType: CalcButtonType.operation}}/>
            <CalcButton data={{text:"%", buttonType: CalcButtonType.operation}}/>
            <CalcButton data={{text:"/", buttonType: CalcButtonType.operation}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"7", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"8", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"9", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"x", buttonType: CalcButtonType.operation}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"4", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"5", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"6", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"-", buttonType: CalcButtonType.operation}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"1", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"2", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"3", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"+", buttonType: CalcButtonType.operation}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"+/-", buttonType: CalcButtonType.digit}}/>
            <CalcButton data={{text:"0", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:dotSymbol, buttonType: CalcButtonType.digit, action: dotClick}}/>
            <CalcButton data={{text:"=", buttonType: CalcButtonType.equal}}/>
        </View>
    </View>;

    const landscapeView = () => <View style={CalcStyle.calc}>
        <View style={CalcStyle.containerResExpMem}>
            <View style={CalcStyle.containerExpMem}>
                <Text style={CalcStyle.expression}>{expression}</Text>
                <View style={CalcStyle.memoryRow}>
                    <CalcButton data={{text:"MC", buttonType: CalcButtonType.memoryActive}}/>
                    <CalcButton data={{text:"MS", buttonType: CalcButtonType.memoryActive}}/>
                    <CalcButton data={{text:"MR", buttonType: CalcButtonType.memoryDisabled}}/>
                    <CalcButton data={{text:"M+", buttonType: CalcButtonType.memoryDisabled}}/>
                    <CalcButton data={{text:"M-", buttonType: CalcButtonType.memoryDisabled}}/>
                </View>
            </View>
            <Text style={[CalcStyle.result, {fontSize: (result.length <= 12 ? 50 : (width - 20) / result.length * 1.8 )}]}>{formatDisplay(result)}</Text>
        </View>

        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"aˣ",  buttonType: CalcButtonType.operation, action: (btn:ICalcButtonData) => console.log(btn.text)}}/>
            <CalcButton data={{text:"ˣ√a", buttonType: CalcButtonType.operation}}/>
            <CalcButton data={{text:"7", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"4", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"1", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"+/-", buttonType: CalcButtonType.digit}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"CE", buttonType: CalcButtonType.operation}}/>
            <CalcButton data={{text:"1/x", buttonType: CalcButtonType.operation}}/>
            <CalcButton data={{text:"8", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"5", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"2", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"0", buttonType: CalcButtonType.digit, action: digitClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"C",  buttonType: CalcButtonType.operation}}/>
            <CalcButton data={{text:"%", buttonType: CalcButtonType.operation}}/>
            <CalcButton data={{text:"9", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"6", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:"3", buttonType: CalcButtonType.digit, action: digitClick}}/>
            <CalcButton data={{text:dotSymbol, buttonType: CalcButtonType.digit, action: dotClick}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"⌫", buttonType: CalcButtonType.operation, action: backspaceClick}}/>
            <CalcButton data={{text:"/", buttonType: CalcButtonType.operation}}/>
            <CalcButton data={{text:"x", buttonType: CalcButtonType.operation}}/>
            <CalcButton data={{text:"-", buttonType: CalcButtonType.operation}}/>
            <CalcButton data={{text:"+", buttonType: CalcButtonType.operation}}/>
            <CalcButton data={{text:"=", buttonType: CalcButtonType.equal}}/>
        </View>
    </View>;

    return width < height ? portraitView() : landscapeView();
}

/*
Д.З. Завершити "верстку" сторінки калькулятора:
- підібрати Unicode символи для кнопок
- підібрати пропорції та відступи всіх блоків, розмірів шрифтів
- заповнити і стилізувати рядок кнопок роботи з пам'яттю (MC, MR, M+, ...)
   враховуючи що вони можуть бути двох типів: активна та неактивна
*/