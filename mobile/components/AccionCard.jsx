import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Tarjeta que muestra una acción individual
// Props:
//   accion        — objeto con los datos de la acción
//   mostrarDetalle — muestra descripción y fecha
//   onEditar      — función al pulsar "Editar" (solo en admin)
//   onEliminar    — función al pulsar "Eliminar" (solo en admin)

export default function AccionCard({ accion, mostrarDetalle, onEditar, onEliminar }) {
  const esPositivo = accion.tipo === 'positivo';
  const signo = esPositivo ? '+' : '-';
  const emoji = esPositivo ? '❤️' : '💀';

  const fecha = new Date(accion.fecha).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <View style={[styles.card, esPositivo ? styles.cardPositivo : styles.cardNegativo]}>
      <View style={styles.fila}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.info}>
          <Text style={styles.titulo}>{accion.titulo}</Text>
          {mostrarDetalle && accion.descripcion ? (
            <Text style={styles.descripcion}>{accion.descripcion}</Text>
          ) : null}
          {mostrarDetalle ? (
            <Text style={styles.fecha}>{fecha}</Text>
          ) : null}
        </View>
        <Text style={[styles.porcentaje, esPositivo ? styles.positivo : styles.negativo]}>
          {signo}{accion.porcentaje}%
        </Text>
      </View>

      {/* Botones de editar/eliminar — solo aparecen si se pasan las funciones */}
      {(onEditar || onEliminar) && (
        <View style={styles.acciones}>
          {onEditar && (
            <TouchableOpacity style={styles.botonEditar} onPress={onEditar}>
              <Text style={styles.botonEditarTexto}>Editar</Text>
            </TouchableOpacity>
          )}
          {onEliminar && (
            <TouchableOpacity style={styles.botonEliminar} onPress={onEliminar}>
              <Text style={styles.botonEliminarTexto}>Eliminar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  cardPositivo: {
    borderLeftColor: '#e94560',
  },
  cardNegativo: {
    borderLeftColor: '#4a90e2',
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  titulo: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  descripcion: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  fecha: {
    color: '#555',
    fontSize: 12,
    marginTop: 4,
  },
  porcentaje: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  positivo: {
    color: '#e94560',
  },
  negativo: {
    color: '#4a90e2',
  },
  acciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#0f3460',
  },
  botonEditar: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f5a623',
  },
  botonEditarTexto: {
    color: '#f5a623',
    fontSize: 13,
  },
  botonEliminar: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e94560',
  },
  botonEliminarTexto: {
    color: '#e94560',
    fontSize: 13,
  },
});
