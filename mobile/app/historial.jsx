import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';
import AccionCard from '../components/AccionCard';

// Agrupa las acciones por fecha (día)
function agruparPorFecha(acciones) {
  const grupos = {};

  acciones.forEach((accion) => {
    const fecha = new Date(accion.fecha);
    const clave = fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    if (!grupos[clave]) grupos[clave] = [];
    grupos[clave].push(accion);
  });

  return grupos;
}

export default function Historial() {
  const router = useRouter();
  const [acciones, setAcciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarAcciones();
  }, []);

  const cargarAcciones = async () => {
    try {
      const res = await api.get('/acciones');
      setAcciones(res.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el historial');
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  const grupos = agruparPorFecha(acciones);
  const fechas = Object.keys(grupos);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contenido}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.volver}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Historial</Text>
        <View style={{ width: 60 }} />
      </View>

      {fechas.length === 0 ? (
        <Text style={styles.vacio}>No hay acciones todavía 🤷</Text>
      ) : (
        fechas.map((fecha) => (
          <View key={fecha} style={styles.grupo}>
            <Text style={styles.fecha}>{fecha}</Text>
            {grupos[fecha].map((accion) => (
              <AccionCard key={accion.id} accion={accion} mostrarDetalle />
            ))}
          </View>
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
  grupo: {
    marginBottom: 28,
  },
  fecha: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
    textTransform: 'capitalize',
    borderBottomWidth: 1,
    borderBottomColor: '#16213e',
    paddingBottom: 8,
  },
  vacio: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 60,
  },
});
