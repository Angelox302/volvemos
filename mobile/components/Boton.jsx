import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

// Componente de botón reutilizable
// Props:
//   titulo    — texto del botón
//   onPress   — función al presionar
//   cargando  — muestra spinner si es true
//   variante  — 'primario' (rojo, default) o 'secundario' (borde)
//   disabled  — deshabilita el botón

export default function Boton({ titulo, onPress, cargando, variante = 'primario', disabled }) {
  const esSecundario = variante === 'secundario';

  return (
    <TouchableOpacity
      style={[
        styles.boton,
        esSecundario ? styles.secundario : styles.primario,
        disabled && styles.deshabilitado,
      ]}
      onPress={onPress}
      disabled={disabled || cargando}
    >
      {cargando ? (
        <ActivityIndicator color={esSecundario ? '#e94560' : '#fff'} />
      ) : (
        <Text style={[styles.texto, esSecundario && styles.textoSecundario]}>
          {titulo}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  primario: {
    backgroundColor: '#e94560',
  },
  secundario: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e94560',
  },
  deshabilitado: {
    opacity: 0.5,
  },
  texto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textoSecundario: {
    color: '#e94560',
  },
});
