import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../../services/api';

export default function NuevaAccion() {
  const router = useRouter();
  const { accionId } = useLocalSearchParams(); // Si viene accionId, es edición

  const esEdicion = !!accionId;

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [porcentaje, setPorcentaje] = useState('');
  const [tipo, setTipo] = useState('positivo'); // 'positivo' o 'negativo'
  const [cargando, setCargando] = useState(false);

  // Si es edición, cargamos los datos actuales de la acción
  useEffect(() => {
    if (esEdicion) {
      cargarAccion();
    }
  }, [accionId]);

  const cargarAccion = async () => {
    try {
      const res = await api.get('/acciones');
      const accion = res.data.find((a) => a.id === parseInt(accionId));
      if (accion) {
        setTitulo(accion.titulo);
        setDescripcion(accion.descripcion || '');
        setPorcentaje(String(accion.porcentaje));
        setTipo(accion.tipo);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la acción');
    }
  };

  const handleGuardar = async () => {
    if (!titulo.trim() || !porcentaje.trim()) {
      Alert.alert('Oops', 'El título y el porcentaje son obligatorios');
      return;
    }

    const valor = parseInt(porcentaje);
    if (isNaN(valor) || valor <= 0) {
      Alert.alert('Oops', 'El porcentaje debe ser un número positivo');
      return;
    }

    setCargando(true);

    try {
      const datos = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || null,
        porcentaje: valor,
        tipo,
      };

      if (esEdicion) {
        await api.put(`/acciones/${accionId}`, datos);
        Alert.alert('Listo', 'Acción actualizada ✅');
      } else {
        await api.post('/acciones', datos);
        Alert.alert('Listo', 'Acción creada ✅');
      }

      router.back();
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'Error al guardar';
      Alert.alert('Error', mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contenido}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.volver}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>
          {esEdicion ? 'Editar acción' : 'Nueva acción'}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Título */}
      <Text style={styles.label}>Título *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Hablamos las cosas"
        placeholderTextColor="#555"
        value={titulo}
        onChangeText={setTitulo}
      />

      {/* Descripción */}
      <Text style={styles.label}>Descripción (opcional)</Text>
      <TextInput
        style={[styles.input, styles.inputMultilinea]}
        placeholder="Cuéntame más..."
        placeholderTextColor="#555"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        numberOfLines={3}
      />

      {/* Porcentaje */}
      <Text style={styles.label}>Porcentaje *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 15"
        placeholderTextColor="#555"
        value={porcentaje}
        onChangeText={setPorcentaje}
        keyboardType="numeric"
      />

      {/* Tipo */}
      <Text style={styles.label}>Tipo *</Text>
      <View style={styles.tipoContainer}>
        <TouchableOpacity
          style={[
            styles.tipoBotón,
            tipo === 'positivo' && styles.tipoActivo,
          ]}
          onPress={() => setTipo('positivo')}
        >
          <Text style={[styles.tipoTexto, tipo === 'positivo' && styles.tipoTextoActivo]}>
            ❤️ Positivo (+)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tipoBotón,
            tipo === 'negativo' && styles.tipoActivoNeg,
          ]}
          onPress={() => setTipo('negativo')}
        >
          <Text style={[styles.tipoTexto, tipo === 'negativo' && styles.tipoTextoActivo]}>
            💀 Negativo (-)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botón guardar */}
      <TouchableOpacity
        style={styles.botonGuardar}
        onPress={handleGuardar}
        disabled={cargando}
      >
        {cargando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botonTexto}>
            {esEdicion ? 'Guardar cambios' : 'Crear acción'}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  contenido: {
    padding: 24,
    paddingTop: 56,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  volver: {
    color: '#e94560',
    fontSize: 16,
    width: 60,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  label: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  inputMultilinea: {
    height: 90,
    textAlignVertical: 'top',
  },
  tipoContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  tipoBotón: {
    flex: 1,
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  tipoActivo: {
    borderColor: '#e94560',
    backgroundColor: '#2a1a2e',
  },
  tipoActivoNeg: {
    borderColor: '#888',
    backgroundColor: '#1a1a1a',
  },
  tipoTexto: {
    color: '#666',
    fontSize: 15,
  },
  tipoTextoActivo: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botonGuardar: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
