import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
    loginLabel:{
        fontWeight: 'bold',
        alignSelf:'flex-start',
        
    },

    inputBox:{
    flexDirection: 'row',
    width: '100%',
    height: 50,
    borderWidth:1,
    borderRadius: 10,
    alignItems:'center',
    paddingLeft: 10,
    backgroundColor: 'red',//'#F0F0F0',
    borderColor: '#F0F0F0',
    
    },

    input:{  
    backgroundColor: 'blue', //para ver melhor o input
    height: '100%',
    width: '100%',
    borderRadius: 10
    },

    icon:{
    width: '100%',
    },
});