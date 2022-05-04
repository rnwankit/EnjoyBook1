import {StyleSheet} from 'react-native';
import {colors} from './constants/theme';

const styles = StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: 'red'
    },
    row: {
      flexDirection: 'row',
    },
    column: {
        flexDirection: 'column',
    },
    container: {
        flexGrow: 1,
       // backgroundColor: '#afb42b',
        alignItems: 'center',
        justifyContent: 'center'
    },
    phoneContainer: {
        //flexGrow: 1,
        //backgroundColor: '#afb42b',
        flexDirection: 'row'
    },
    containerLogo: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    logoText: {
        fontSize: 110,
        color: '#003576',
    },
    textInput: {
        //backgroundColor: '#e4e65e',
        borderRadius: 20,
        width: 300,
        marginBottom: 16,
        paddingHorizontal: 16
    },
    btn: {
        backgroundColor: '#7c8500',
        borderRadius: 20,
        width: 300,
        padding: 14,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '700'
    },
    dontAcct: {
        flex:1,
        flexDirection: 'row',
        color: "#888888"
    },
    errorText: {
        color: '#ffffff',
        fontSize: 14,
        paddingHorizontal: 12,
        paddingBottom: 8
    },
    inputBox: {
        width:216,
        backgroundColor:'rgba(255, 255,255,0.2)',
        borderRadius: 8,
        paddingHorizontal:16,
        fontSize:16,
        //color:'#ffffff',
        marginVertical: 10,
    },
    phoneBox: {
        width:210,
        backgroundColor:'rgba(255, 255,255,0.2)',
        borderRadius: 10,
        paddingHorizontal:16,
        fontSize:16,
        color:'#ffffff',
        marginVertical: 10,
    },
    countryBox: {
        marginTop: 28,
        marginRight: 8,
        flexDirection: 'row',
        borderRadius: 0,
        borderWidth: 0,
        borderBottomColor: colors.gray2,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 10,
    },
    signup: {
        flex: 1,
        justifyContent: 'center',
        fontWeight: '700'
    },
    input: {
        color: '#000000',
        borderRadius: 0,
        borderWidth: 0,
        borderBottomColor: '#C5CCD6',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    hasErrors: {
        borderBottomColor: "#F3534A",
    }
})

export default styles;

/*Primary
#afb42b

P — Light
#e4e65e

P — Dark
#7c8500
Text #000000

Secondary
#2c5ea5

S — Light
#648bd7
S — Dark
#003576
Text ffffff*/
