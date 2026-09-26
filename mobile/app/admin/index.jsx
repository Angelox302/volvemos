import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import api from '../../services/api';
import AccionCard from '../../components/AccionCard';

export default function AdminPanel() {
  const router = useRouter();
  const [porcentaje, setPorcentaje] = useState(null);
  const [acciones, setAcciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Se recarga cada vez que la pantalla vuelve a estar en foco
  // (por ejemplo, después de crear o editar una acción)
  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = async () => {
    try {
      const [resProg, resAcc] = await Promise.all([
        api.get('/progreso'),
        api.get('/acciones'),
      ]);
      setPorcentaje(resProg.data.porcentaje);
      setAcciones(resAcc.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setCargando(false);
    }
  };

  const eliminarAccion = async (id) => {
    Alert.alert(
      'Eliminar acción',
      '¿Estás segura? Esto no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/acciones/${id}`);
              cargarDatos(); // Refrescamos la lista
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la acción');
            }
          },
        },
      ]
    );
  };

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contenido}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.volver}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Panel Admin</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Porcentaje actual */}
      <View style={styles.porcentajeCard}>
        <Text style={styles.porcentajeLabel}>Porcentaje actual</Text>
        <Text style={styles.porcentajeValor}>{porcentaje}%</Text>
      </View>

      {/* Botón nueva acción */}
      <TouchableOpacity
        style={styles.botonNueva}
        onPress={() => router.push('/admin/nuevaAccion')}
      >
        <Text style={styles.botonNuevaTexto}>+ Nueva acción</Text>
      </TouchableOpacity>

      {/* Lista de acciones */}
      <Text style={styles.seccionTitulo}>
        Acciones ({acciones.length})
      </Text>

      {acciones.length === 0 ? (
        <Text style={styles.vacio}>No hay acciones todavía</Text>
      ) : (
        acciones.map((accion) => (
          <AccionCard
            key={accion.id}
            accion={accion}
            mostrarDetalle
            onEditar={() =>
              router.push({
                pathname: '/admin/nuevaAccion',
                params: { accionId: accion.id },
              })
            }
            onEliminar={() => eliminarAccion(accion.id)}
          />
        ))
      )}
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
  centrado: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
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
  porcentajeCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e94560',
  },
  porcentajeLabel: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 4,
  },
  porcentajeValor: {
    color: '#e94560',
    fontSize: 48,
    fontWeight: 'bold',
  },
  botonNueva: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  botonNuevaTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  seccionTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  vacio: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 24,
  },
});
