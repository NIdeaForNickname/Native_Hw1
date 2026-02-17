import { Text, useWindowDimensions, View } from "react-native";
import CalcStyle from "./css/CalcStyle";
import CalcButton from "./ui/button/CalcButton";
import CalcButtonType from "./ui/button/CalcButtonType";
import ICalcButtonData from "./ui/button/ICalcButtonData";

export default function Calc() {
    const {width, height} = useWindowDimensions();

    const portraitView = () => <View style={CalcStyle.calc}>
        <Text style={CalcStyle.expression}>3 - 9 =</Text>
        <Text style={CalcStyle.result}>-6</Text>
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
            <CalcButton data={{text:"⌫", buttonType: CalcButtonType.operation}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"ˣ√a", buttonType: CalcButtonType.operation}}/>
            <CalcButton data={{text:"1/x", buttonType: CalcButtonType.operation}}/>
            <CalcButton data={{text:"%", buttonType: CalcButtonType.operation}}/>
            <CalcButton data={{text:"/", buttonType: CalcButtonType.operation}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"7", buttonType: CalcButtonType.digit    }}/>
            <CalcButton data={{text:"8", buttonType: CalcButtonType.digit    }}/>
            <CalcButton data={{text:"9", buttonType: CalcButtonType.digit    }}/>
            <CalcButton data={{text:"x", buttonType: CalcButtonType.operation}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"4", buttonType: CalcButtonType.digit    }}/>
            <CalcButton data={{text:"5", buttonType: CalcButtonType.digit    }}/>
            <CalcButton data={{text:"6", buttonType: CalcButtonType.digit    }}/>
            <CalcButton data={{text:"-", buttonType: CalcButtonType.operation}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"1", buttonType: CalcButtonType.digit    }}/>
            <CalcButton data={{text:"2", buttonType: CalcButtonType.digit    }}/>
            <CalcButton data={{text:"3", buttonType: CalcButtonType.digit    }}/>
            <CalcButton data={{text:"+", buttonType: CalcButtonType.operation}}/>
        </View>
        <View style={CalcStyle.buttonRow}>
            <CalcButton data={{text:"%", buttonType: CalcButtonType.digit    }}/>
            <CalcButton data={{text:"0", buttonType: CalcButtonType.digit    }}/>
            <CalcButton data={{text:",", buttonType: CalcButtonType.digit    }}/>
            <CalcButton data={{text:"=", buttonType: CalcButtonType.equal    }}/>
        </View>
    </View>;

    const landscapeView = () => <View>
        <Text>Calculator landscapeView</Text>
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