import { MaterialIcons } from '@expo/vector-icons';
import React, { forwardRef, LegacyRef, useState } from "react";
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
import { inputStyles } from "../components Sytles/inputStyles";

type IconComponent = React.ComponentType<{ name: any; size?: number; color?: string }>;

type InputProps = TextInputProps & {
    IconLeft?: IconComponent;
    IconLeftName?: string;
    title?: string;
    onIconLeftPress?: () => void;
};

export const Input = forwardRef((props: InputProps, ref: LegacyRef<TextInput> | null) => {
    const { IconLeft, IconLeftName, title, onIconLeftPress, ...rest } = props;
    const [focado, setFocado] = useState(false);
    const [senhaVisivel, setSenhaVisivel] = useState(false);

    const ehSenha = !!rest.secureTextEntry;

    return (
        <View style={inputStyles.wrapper}>
            {title && <Text style={inputStyles.loginLabel}>{title}</Text>}
            <View style={[inputStyles.inputBox, focado && inputStyles.inputBoxFocado]}>
                {IconLeft && IconLeftName && (
                    onIconLeftPress
                        ? <TouchableOpacity onPress={onIconLeftPress}>
                            <IconLeft name={IconLeftName} size={20} color={focado ? '#4CAF50' : 'gray'} style={inputStyles.icon} />
                          </TouchableOpacity>
                        : <IconLeft name={IconLeftName} size={20} color={focado ? '#4CAF50' : 'gray'} style={inputStyles.icon} />
                )}

                <TextInput
                    ref={ref}
                    style={inputStyles.input}
                    onFocus={() => setFocado(true)}
                    onBlur={() => setFocado(false)}
                    {...rest}
                    secureTextEntry={ehSenha && !senhaVisivel}
                />

                {ehSenha && (
                    <TouchableOpacity onPress={() => setSenhaVisivel(v => !v)} style={inputStyles.iconBotao}>
                        <MaterialIcons
                            name={senhaVisivel ? 'visibility' : 'visibility-off'}
                            size={20}
                            color={focado ? '#4CAF50' : 'gray'}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
});
