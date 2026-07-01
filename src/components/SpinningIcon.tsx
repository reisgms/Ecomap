import { useEffect, useRef } from 'react';
import { Animated, Easing, ImageStyle, StyleProp } from 'react-native';

type SpinningIconProps = {
    size?: number;
    duration?: number;
    style?: StyleProp<ImageStyle>;
};

export function SpinningIcon({ size = 32, duration = 1200, style }: SpinningIconProps) {
    const rotacao = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animacao = Animated.loop(
            Animated.timing(rotacao, {
                toValue: 1,
                duration,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        animacao.start();
        return () => animacao.stop();
    }, [rotacao, duration]);

    const rotate = rotacao.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.Image
            source={require('../../assets/images/android-icon-foreground.png')}
            resizeMode="contain"
            style={[{ width: size, height: size, transform: [{ rotate }] }, style]}
        />
    );
}
