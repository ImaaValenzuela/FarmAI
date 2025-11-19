import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useFarmContext } from '../hooks/useFarmContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors, spacing, typography, borderRadius } from '../lib/theme';

export default function ProfileScreen() {
  const { user, plots, diagnoses } = useFarmContext();

  const totalArea = plots.reduce((sum, plot) => sum + plot.area, 0);
  const healthyCount = diagnoses.filter((d) => d.healthStatus === 'healthy').length;
  const warningCount = diagnoses.filter((d) => d.healthStatus === 'warning').length;
  const criticalCount = diagnoses.filter((d) => d.healthStatus === 'critical').length;

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* User Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <MaterialIcons name="person" size={48} color={colors.primary} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
              <Text style={styles.userDetails}>{user?.farm || 'Mi Finca'}</Text>
              <Text style={styles.userDetails}>{user?.location || 'Ubicación desconocida'}</Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Resumen de Actividad</Text>
            <View style={styles.statsGrid}>
              <Card style={styles.statCard}>
                <MaterialIcons name="landscape" size={24} color={colors.primary} />
                <Text style={styles.statNumber}>{plots.length}</Text>
                <Text style={styles.statLabel}>Lotes</Text>
              </Card>
              <Card style={styles.statCard}>
                <MaterialIcons name="check-circle" size={24} color={colors.success} />
                <Text style={styles.statNumber}>{totalArea.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Hectáreas</Text>
              </Card>
            </View>

            <View style={styles.statsGrid}>
              <Card style={styles.statCard}>
                <MaterialIcons name="task-alt" size={24} color={colors.success} />
                <Text style={styles.statNumber}>{healthyCount}</Text>
                <Text style={styles.statLabel}>Saludables</Text>
              </Card>
              <Card style={styles.statCard}>
                <MaterialIcons name="error" size={24} color={colors.warning} />
                <Text style={styles.statNumber}>{warningCount}</Text>
                <Text style={styles.statLabel}>Alertas</Text>
              </Card>
            </View>

            <View style={styles.statsGridSingle}>
              <Card style={styles.statCard}>
                <MaterialIcons name="error" size={24} color={colors.error} />
                <Text style={styles.statNumber}>{criticalCount}</Text>
                <Text style={styles.statLabel}>Críticos</Text>
              </Card>
            </View>
          </View>

          {/* Diagnostics History */}
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Últimos Diagnósticos</Text>
            {diagnoses.length > 0 ? (
              <View>
                {diagnoses.slice(-5).reverse().map((diagnosis) => (
                  <Card key={diagnosis.id} style={styles.historyCard}>
                    <View style={styles.historyItem}>
                      <View style={styles.historyIcon}>
                        <MaterialIcons
                          name={
                            diagnosis.healthStatus === 'healthy'
                              ? 'check-circle'
                              : diagnosis.healthStatus === 'warning'
                              ? 'warning'
                              : 'error'
                          }
                          size={20}
                          color={
                            diagnosis.healthStatus === 'healthy'
                              ? colors.success
                              : diagnosis.healthStatus === 'warning'
                              ? colors.warning
                              : colors.error
                          }
                        />
                      </View>
                      <View style={styles.historyContent}>
                        <Text style={styles.historyTitle}>
                          {diagnosis.disease || diagnosis.pest || 'Sin hallazgos'}
                        </Text>
                        <Text style={styles.historyDate}>
                          {new Date(diagnosis.createdAt).toLocaleDateString('es-MX')} •{' '}
                          {diagnosis.confidence}% confianza
                        </Text>
                      </View>
                    </View>
                  </Card>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>No hay diagnósticos registrados aún</Text>
            )}
          </View>

          {/* About */}
          <View style={styles.aboutSection}>
            <Card>
              <View style={styles.aboutContent}>
                <MaterialIcons name="info" size={24} color={colors.primary} />
                <View style={styles.aboutText}>
                  <Text style={styles.aboutTitle}>Acerca de FARM.AI</Text>
                  <Text style={styles.aboutDescription}>
                    Plataforma de diagnóstico de cultivos con IA para pequeños y medianos productores
                  </Text>
                  <Text style={styles.version}>v1.0.0</Text>
                </View>
              </View>
            </Card>
          </View>

          {/* Help & Support */}
          <View style={styles.supportSection}>
            <Button title="📧 Enviar Feedback" onPress={() => {}} variant="outline" />
            <Button title="❓ Ayuda" onPress={() => {}} variant="outline" />
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
  },
  userDetails: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  statsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statsGridSingle: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.onSurface,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  historySection: {
    marginBottom: spacing.xl,
  },
  historyCard: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
  },
  historyDate: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  emptyText: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  aboutSection: {
    marginBottom: spacing.xl,
  },
  aboutContent: {
    flexDirection: 'row',
    gap: spacing.lg,
    alignItems: 'flex-start',
  },
  aboutText: {
    flex: 1,
  },
  aboutTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onSurface,
  },
  aboutDescription: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  version: {
    fontSize: 11,
    color: colors.outline,
    marginTop: spacing.md,
    fontWeight: '600',
  },
  supportSection: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
});