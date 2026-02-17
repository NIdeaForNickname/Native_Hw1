import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {textColor} from "../../../../features/values/colors";
import ICalcButtonData from "./ICalcButtonData";
import CalcButtonType from "./CalcButtonType";


export default function CalcButton({data}: { data: ICalcButtonData }) {
    return <TouchableOpacity
        onPress={() => {
            if (data.action) data.action(data)
        }}
        style={[
            styles.calcButton,
            buttonTypeStyles[data.buttonType] || buttonTypeStyles.default
        ]}
        disabled={data.buttonType == CalcButtonType.memoryDisabled}>
        <Text style={
            data.buttonType == CalcButtonType.memoryDisabled ? styles.inactiveCalcButtonText : styles.calcButtonText
        } >{data.text}</Text>
    </TouchableOpacity>;
}

const styles = StyleSheet.create({
    calcButton: {
        flex: 1,
        margin: 1.5,
        borderRadius: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    calcButtonText: {
        color: textColor,
        fontSize: 18,
    },
    inactiveCalcButtonText:{
        fontSize: 18,
        color: "#555",
    },
    digitButton: {
        backgroundColor: "#3a3a3a",
    },
    operButton: {
        backgroundColor: "#333",
    },
    equalButton: {
        backgroundColor: "#4e97f1",
    },
    memoryButtonActive: {
        borderColor: "#555",
        borderWidth: 1.5,
    },
    memoryButtonDisabled: {
        color: "#555",
    }
});

const buttonTypeStyles = {
    [CalcButtonType.digit]: styles.digitButton,
    [CalcButtonType.operation]: styles.operButton,
    [CalcButtonType.memoryActive]: styles.memoryButtonActive,
    [CalcButtonType.memoryDisabled]: styles.memoryButtonDisabled,
    // Default/Fallback
    default: styles.equalButton
};