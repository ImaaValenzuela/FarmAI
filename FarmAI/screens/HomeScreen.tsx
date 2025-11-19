import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useFarmContext } from '../hooks/useFarmContext';
import Card from '../components/Card';
import Button from '../components/Button';
import HealthBadge from '../components/Healthbadge';
import { colors, spacing, typography, borderRadius } from '../lib/theme';

export default function HomeScreen() {
  const { plots, user, diagnoses } = useFarmContext();
  const recentDiagnoses = diagnoses.slice(-3).reverse();

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>¡Hola, {user?.name?.split(' ')[0]}! 👋</Text>
              <Text style={styles.subtitle}>{user?.farm}</Text>
            </View>
            <View style={styles.headerIcon}>
              <MaterialIcons name="agriculture" size={28} color={colors.primary} />
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={[styles.stat, { borderLeftColor: colors.success }]}>
              <Text style={styles.statValue}>{plots.length}</Text>
              <Text style={styles.statLabel}>Lotes</Text>
            </View>
            <View style={[styles.stat, { borderLeftColor: colors.warning }]}>
              <Text style={styles.statValue}>{diagnoses.length}</Text>
              <Text style={styles.statLabel}>Diagnósticos</Text>
            </View>
          </View>

          {/* Recent Diagnoses */}
          {recentDiagnoses.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Últimos Diagnósticos</Text>
              {recentDiagnoses.map((diagnosis) => (
                <Card key={diagnosis.id}>
                  <View style={styles.diagnosisCard}>
                    <View style={styles.diagnosisHeader}>
                      <Text style={styles.diagnosisPlot}>Diagnóstico #{diagnosis.id.slice(-4)}</Text>
                      <HealthBadge status={diagnosis.healthStatus} confidence={diagnosis.confidence} />
                    </View>
                    {diagnosis.disease && (
                      <Text style={styles.diagnosisText}>🦠 {diagnosis.disease}</Text>
                    )}
                    {diagnosis.pest && (
                      <Text style={styles.diagnosisText}>🐛 {diagnosis.pest}</Text>
                    )}
                    <Text style={styles.diagnosisDate}>
                      {new Date(diagnosis.createdAt).toLocaleDateString('es-MX')}
                    </Text>
                  </View>
                </Card>
              ))}
            </View>
          )}

          {/* Quick Action */}
          <View style={styles.section}>
            <Card style={styles.emptyCard}>
              <MaterialIcons name="add-a-photo" size={48} color={colors.primary} />
              <Text style={styles.emptyTitle}>Diagnosticar Cultivo</Text>
              <Text style={styles.emptyDescription}>
                Toma una foto de tu cultivo para obtener un diagnóstico instantáneo
              </Text>
            </Card>
          </View>

          {/* Plots Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mis Lotes</Text>
            {plots.length > 0 ? (
              plots.map((plot) => (
                <Card key={plot.id}>
                  <View style={styles.plotCard}>
                    <View style={styles.plotInfo}>
                      <View style={styles.plotIcon}>
                        <MaterialIcons name="landscape" size={24} color={colors.primary} />
                      </View>
                      <View>
                        <Text style={styles.plotName}>{plot.name}</Text>
                        <Text style={styles.plotDetails}>
                          {plot.cropType} • {plot.area} ha
                        </Text>
                      </View>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
                  </View>
                </Card>
              ))
            ) : (
              <Text style={styles.emptyText}>No hay lotes registrados</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create<any>({
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
  greeting: {
    ...typography.h3,
    color: colors.onSurface,
  },
  subtitle: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    marginTop: spacing.xs,
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
    ...typography.h2,
    color: colors.onSurface,
  },
  statLabel: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    marginTop: spacing.sm,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.onSurface,
    marginBottom: spacing.lg,
  },
  diagnosisCard: {
    gap: spacing.md,
  },
  diagnosisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  diagnosisPlot: {
    ...typography.h5,
    color: colors.onSurface,
  },
  diagnosisText: {
    ...typography.body,
    color: colors.onSurface,
  },
  diagnosisDate: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
  },
  emptyCard: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    ...typography.h5,
    color: colors.onSurface,
    marginTop: spacing.lg,
  },
  emptyDescription: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  plotCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plotInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  plotIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plotName: {
    ...typography.h5,
    color: colors.onSurface,
  },
  plotDetails: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  emptyText: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});