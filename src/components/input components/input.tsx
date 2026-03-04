import React, { forwardRef, Fragment, LegacyRef} from "react";

import { AntDesign, FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
import { Styles } from "./styles";


type IconComponent = React.ComponentType<React.ComponentProps<typeof MaterialIcons>> |
                    React.ComponentType<React.ComponentProps<typeof FontAwesome>> |
                    React.ComponentType<React.ComponentProps<typeof FontAwesome5 >> |
                    React.ComponentType<React.ComponentProps<typeof AntDesign >>;  


type props = TextInputProps & {
    IconLeft?: IconComponent,
    IconRight?: IconComponent,
    IconLeftName?: string,
    IconRightName?: string,
    title?: string,
    onIconLeftPress?: () => void,
    onIconRightPress?: () => void
}

export const Input = forwardRef((Props: props, ref: LegacyRef<TextInput> | null) => {

    const { IconLeft, IconRight, IconLeftName, IconRightName, title, onIconLeftPress, onIconRightPress, ...rest } = Props;
    
    const calcularEspaçoIcone = () => {
        if (IconLeft && IconRight)
            { return '80%'
        }else if (IconLeft || IconRight)
            { return '90%'
        } else 
            { return '100%' }
    }

    const calcularPaddingRight = () => {
        if (IconLeft && IconRight){
            return 10;
        } else if(IconLeft || IconRight){
            return 10;
        } else{
            return 20;
        }
    };

    return (
        <Fragment>
            <Text style={Styles.loginLabel}>{title}</Text>
            <View style={[Styles.inputBox, {paddingRight: calcularPaddingRight()}]}>
                {IconLeft && IconLeftName && (
                    <TouchableOpacity>
                        <IconLeft name={IconLeftName as any} size={20} color={'gray'} style={Styles.icon}/>
                    </TouchableOpacity>
                )}
                <TextInput style={[Styles.input, {width: calcularEspaçoIcone()}
                ]}
                {...rest}/>

                {IconRight && IconRightName && (
                    <TouchableOpacity>
                        <IconRight name={IconRightName as any} size={20} color={'gray'} style={Styles.icon}/>
                    </TouchableOpacity>
                )}
            </View>
        </Fragment>
    )
});