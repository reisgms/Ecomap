import { Dimensions, StyleSheet } from "react-native";


export const loginStyle = StyleSheet.create({


// alinhamento da scrowlview
    content:{
    flex:1,
    alignItems: 'center', 
    justifyContent: 'center'
    },

    //caixa de login
    loginBox:{
        alignItems:'center',
        width: '100%',
        justifyContent: 'space-evenly',
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#E8E6E3',
        borderColor: 'white',
        padding: 30,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
	    width: 0,
	    height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
        margin: 20

    },

    

    //label de login e senha
    loginLabel:{
        fontWeight: 'bold',
        alignSelf:'flex-start',
        
    },
    
    //input box com os icones
    inputBox:{
    flexDirection: 'row',
    width: '100%',
    height: 50,
    borderWidth:1,
    borderRadius: 10,
    alignItems:'center',
    paddingLeft: 10,
    backgroundColor: '#F0F0F0',
    borderColor: '#F0F0F0',
    
    },

    //caixa do input
    input:{  
    //backgroundColor: 'blue', //para ver melhor o input
    height: '100%',
    width: '100%',
    borderRadius: 10
    },
    
    //botão
    button:{
    margin: 20,
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    borderRadius: 10,
    flexDirection: 'row',
    
        
    },

    //Botao do google
    googleButton:{
    width:'100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E6E3',
    flexDirection: 'row',
    marginTop: 10

    },

    //box da linha do Ou
    boxLinha:{
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20

    },

    //linha
    linha:{
    flex: 1,
    height: 1,
    backgroundColor: 'lightgray'
    },

    // caixa dos itens em baixo sla
    boxBottom:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    
    },

    miniBox1:{
        width: 100,
        height:100,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth:1,
        borderRadius:10,
        borderColor: 'lightgray'
    },

    miniBox2:{
        width: 100,
        height:100,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth:1,
        borderRadius:10,
        borderColor: 'lightgray'
    },

    miniBox3:{
        width: 100,
        height:100,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth:1,
        borderRadius:10,
        borderColor: 'lightgray'
    },
    
});

export default loginStyle;