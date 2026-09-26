import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';
import BarraProgreso from '../components/BarraProgreso';
import AccionCard from '../components/AccionCard';

function getEstado(porcentaje) {
  if (porcentaje <= 20) return { emoji: '💀', texto: 'Ni de vaina' };
  if (porcentaje <= 40) return { emoji: '🥶', texto: 'Complicado' };
  if (porcentaje <= 60) return { emoji: '😐', texto: 'Hay esperanza' };
  if (porcentaje <= 80) return { emoji: '👀', texto: 'Se está cocinando' };
  if (porcentaje < 100) return { emoji: '❤️', texto: 'Ya casi' };
  return { emoji: '💍', texto: 'MARICO, VOLVIERON' };
}

export default function Home() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [porcentaje, setPorcentaje] = useState(50);
  const [acciones, setAcciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  // Recarga cuando la pantalla vuelve al foco
  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = async () => {
    try {
      const usuarioGuardado = await SecureStore.getItemAsync('usuario');
      if (usuarioGuardado) {
        setUsuario(JSON.parse(usuarioGuardado));
      }

      const [resProg, resAcc] = await Promise.all([
        api.get('/progreso'),
        api.get('/acciones'),
      ]);

      setPorcentaje(resProg.data.porcentaje);
      setAcciones(resAcc.data.slice(0, 5));
    } catch (error) {
      console.log('Error cargando datos:', error?.message);
      Alert.alert(
        'Error de conexión',
        'No se pudo conectar al servidor. ¿Está corriendo el backend?'
      );
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  };

  const onRefrescar = () => {
    setRefrescando(true);
    cargarDatos();
  };

  const cerrarSesion = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('usuario');
    router.replace('/login');
  };

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#e94560" />
        <Text style={styles.cargandoTexto}>Cargando...</Text>
      </View>
    );
  }

  const estado = getEstado(porcentaje);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contenido}
      refreshControl={
        <RefreshControl refreshing={refrescando} onRefresh={onRefrescar} tintColor="#e94560" />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.saludo}>Hola, {usuario?.nombre ?? 'there'} 👋</Text>
        <TouchableOpacity onPress={cerrarSesion}>
          <Text style={styles.salir}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* Título */}
      <Text style={styles.titulo}>VOLVEMOS ❤️</Text>

      {/* Porcentaje */}
      <Text style={styles.porcentaje}>{porcentaje}%</Text>

      {/* Barra de progreso */}
      <BarraProgreso porcentaje={porcentaje} />

      {/* Estado */}
      <Text style={styles.estadoEmoji}>{estado.emoji}</Text>
      <Text style={styles.estadoTexto}>"{estado.texto}"</Text>

      {/* Botones de navegación */}
      <View style={styles.botones}>
        <TouchableOpacity
          style={styles.boton}
          onPress={() => router.push('/historial')}
        >
          <Text style={styles.botonTexto}>📋 Ver historial</Text>
        </TouchableOpacity>

        {usuario?.rol === 'admin' && (
          <TouchableOpacity
            style={[styles.boton, styles.botonAdmin]}
            onPress={() => router.push('/admin')}
          >
            <Text style={styles.botonTexto}>⚙️ Panel admin</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Últimas acciones */}
      <Text style={styles.seccionTitulo}>Últimas acciones</Text>

      {acciones.length === 0 ? (
        <Text style={styles.vacio}>Aún no hay acciones registradas 🤷</Text>
      ) : (
        acciones.map((accion) => (
          <AccionCard key={accion.id} accion={accion} />
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
    alignItems: 'center',
  },
  centrado: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cargandoTexto: {
    color: '#aaa',
    marginTop: 12,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  saludo: {
    color: '#aaa',
    fontSize: 14,
  },
  salir: {
    color: '#e94560',
    fontSize: 14,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 16,
  },
  porcentaje: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#e94560',
    marginBottom: 16,
  },
  estadoEmoji: {
    fontSize: 40,
    marginTop: 16,
  },
  estadoTexto: {
    fontSize: 18,
    color: '#aaa',
    fontStyle: 'italic',
    marginBottom: 32,
    marginTop: 4,
  },
  botones: {
    width: '100%',
    gap: 12,
    marginBottom: 32,
  },
  boton: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  botonAdmin: {
    borderColor: '#e94560',
  },
  botonTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  seccionTitulo: {
    width: '100%',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  vacio: {
    color: '#666',
    fontSize: 14,
  },
});
