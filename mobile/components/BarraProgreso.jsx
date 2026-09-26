import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

// Barra de progreso animada que refleja el porcentaje actual
export default function BarraProgreso({ porcentaje }) {
  const animacion = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animamos la barra desde 0 hasta el porcentaje real
    Animated.timing(animacion, {
      toValue: porcentaje,
      duration: 1000,
      useNativeDriver: false, // width no soporta native driver
    }).start();
  }, [porcentaje]);

  // Interpolamos el valor animado para calcular el ancho como porcentaje
  const ancho = animacion.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  // El color cambia según el porcentaje
  const color = porcentaje >= 80 ? '#e94560' : porcentaje >= 50 ? '#f5a623' : '#4a90e2';

  return (
    <View style={styles.contenedor}>
      <Animated.View style={[styles.barra, { width: ancho, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
    height: 16,
    backgroundColor: '#16213e',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  barra: {
    height: '100%',
    borderRadius: 8,
  },
});
