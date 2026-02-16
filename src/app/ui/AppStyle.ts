import {StyleSheet} from "react-native";
import {textColor} from "../../features/values/colors";

const AppStyle = StyleSheet.create({
    container: {
        backgroundColor: '#444',
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    appBar: {   // header
        paddingVertical: 9.5,   // dp (dip) - density (independed) pixel
    },
    appBarTitle: {
        color: textColor,
        fontWeight: 700,
    },
    main: {
        backgroundColor: "salmon",
        flex: 1,
        width: "100%",
    },
    navBar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        height: "12%",
        width: "100%",
        paddingVertical: 10,
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: '#555',
    },
    navButton: {
        height: "100%",
        backgroundColor: '#555',
        justifyContent: "center",
        aspectRatio: 1,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#666',
        elevation: 5,
    },
    navButtonText: {
        color: textColor,
        textAlign: "center",
        fontWeight: '600',
    },
});

export default AppStyle;
/*
Д.З. Стилізувати надпис "Home" в навігаційній
панелі застосунку під вигляд кнопки
(рамочка, заокруглення, відступи, *тінь)
*/