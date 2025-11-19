import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useFarmContext } from '../hooks/useFarmContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors, spacing, typography, borderRadius } from '../lib/theme';
import { Plot } from '../types';

export default function PlotsScreen() {
  const { plots, addPlot, deletePlot } = useFarmContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cropType: '',
    area: '',
  });

  const handleAddPlot = () => {
    if (!formData.name || !formData.cropType || !formData.area) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    const newPlot: Plot = {
      id: `plot_${Date.now()}`,
      name: formData.name,
      cropType: formData.cropType,
      area: parseFloat(formData.area),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addPlot(newPlot);
    setFormData({ name: '', cropType: '', area: '' });
    setShowAddForm(false);
    Alert.alert('Éxito', 'Lote agregado correctamente');
  };

  const handleDeletePlot = (id: string) => {
    Alert.alert('Eliminar Lote', '¿Estás seguro?', [
      { text: 'Cancelar', onPress: () => {} },
      {
        text: 'Eliminar',
        onPress: () => {
          deletePlot(id);
          Alert.alert('Éxito', 'Lote eliminado');
        },
        style: 'destructive',
      },
    ]);
  };

  const totalArea = plots.reduce((sum, plot) => sum + plot.area, 0);

  if (showAddForm) {
    return (
      <View style={styles.container}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Agregar Nuevo Lote</Text>
            </View>

            <Card>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nombre del Lote</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Lote Maíz Norte"
                  placeholderTextColor={colors.placeholder}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Tipo de Cultivo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Maíz, Trigo, Soja"
                  placeholderTextColor={colors.placeholder}
                  value={formData.cropType}
                  onChangeText={(text) => setFormData({ ...formData, cropType: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Área (Hectáreas)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: 5.5"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="decimal-pad"
                  value={formData.area}
                  onChangeText={(text) => setFormData({ ...formData, area: text })}
                />
              </View>
            </Card>

            <View style={styles.buttonGroup}>
              <Button title="Guardar Lote" onPress={handleAddPlot} />
              <Button
                title="Cancelar"
                onPress={() => {
                  setFormData({ name: '', cropType: '', area: '' });
                  setShowAddForm(false);
                }}
                variant="outline"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Mis Lotes</Text>
            <View style={styles.headerIcon}>
              <MaterialIcons name="landscape" size={28} color={colors.primary} />
            </View>
          </View>

          {/* Stats */}
          {plots.length > 0 && (
            <View style={styles.statsContainer}>
              <View style={[styles.stat, { borderLeftColor: colors.success }]}>
                <Text style={styles.statValue}>{plots.length}</Text>
                <Text style={styles.statLabel}>Lotes</Text>
              </View>
              <View style={[styles.stat, { borderLeftColor: colors.primary }]}>
                <Text style={styles.statValue}>{totalArea.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Hectáreas</Text>
              </View>
            </View>
          )}

          {/* Plots List */}
          {plots.length > 0 ? (
            <View style={styles.plotsList}>
              {plots.map((plot) => (
                <Card key={plot.id}>
                  <View style={styles.plotHeader}>
                    <View style={styles.plotIconContainer}>
                      <MaterialIcons name="agriculture" size={32} color={colors.primary} />
                    </View>
                    <View style={styles.plotContent}>
                      <Text style={styles.plotName}>{plot.name}</Text>
                      <Text style={styles.plotType}>{plot.cropType}</Text>
                      <Text style={styles.plotArea}>{plot.area} hectáreas</Text>
                    </View>
                    <Button
                      title="🗑️"
                      onPress={() => handleDeletePlot(plot.id)}
                      size="small"
                      variant="outline"
                    />
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <Card style={styles.emptyCard}>
              <MaterialIcons name="inbox" size={48} color={colors.outline} />
              <Text style={styles.emptyTitle}>No hay lotes registrados</Text>
              <Text style={styles.emptyDescription}>
                Crea tu primer lote para comenzar a hacer diagnósticos
              </Text>
            </Card>
          )}

          {/* Add Button */}
          <View style={styles.addButtonContainer}>
            <Button title="➕ Agregar Nuevo Lote" onPress={() => setShowAddForm(true)} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.onSurface,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: colors.border,
    borderRightColor: colors.border,
    borderBottomColor: colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.onSurface,
  },
  statLabel: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: spacing.sm,
  },
  plotsList: {
    marginBottom: spacing.xl,
  },
  plotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  plotIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plotContent: {
    flex: 1,
  },
  plotName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurface,
  },
  plotType: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  plotArea: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  emptyCard: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    marginVertical: spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
    marginTop: spacing.lg,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: 14,
    color: colors.onSurface,
    backgroundColor: colors.surface,
  },
  buttonGroup: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  addButtonContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
});