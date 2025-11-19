import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useFarmContext } from '../hooks/useFarmContext';
import Card from '../components/Card';
import Button from '../components/Button';
import HealthBadge from '../components/Healthbadge';
import { colors, spacing, typography, borderRadius } from '../lib/theme';
import { Diagnosis, Recommendation } from '../types';

const MOCK_DIAGNOSES: Omit<Diagnosis, 'id' | 'plotId' | 'imageUri' | 'createdAt'>[] = [
  {
    disease: 'Roya Común',
    pest: undefined,
    healthStatus: 'critical',
    confidence: 87,
    symptoms: ['Manchas anaranjadas en hojas', 'Lesiones pustulosas', 'Defoliación progresiva'],
    recommendations: [
      {
        type: 'fungicide',
        product: 'Azoxistrobina 50%',
        dosage: '750 ml/ha',
        frequency: 'Cada 14 días',
        description: 'Fungicida sistémico de amplio espectro',
        priority: 'high',
      },
      {
        type: 'other',
        description: 'Remover hojas infectadas para mejorar circulación de aire',
        priority: 'medium',
      },
    ] as Recommendation[],
  },
  {
    disease: 'Mildiu Velloso',
    pest: undefined,
    healthStatus: 'warning',
    confidence: 72,
    symptoms: ['Mancha angular en hojas', 'Eflorescencia blanca en envés', 'Enrollamiento de hojas'],
    recommendations: [
      {
        type: 'fungicide',
        product: 'Oxicloruro de Cobre',
        dosage: '3 kg/ha',
        frequency: 'Cada 10-14 días',
        description: 'Fungicida preventivo',
        priority: 'high',
      },
    ] as Recommendation[],
  },
  {
    disease: undefined,
    pest: 'Gusano Cogollero',
    healthStatus: 'critical',
    confidence: 94,
    symptoms: ['Agujeros en hojas', 'Galerías en cogollo', 'Presencia de larvas verdes'],
    recommendations: [
      {
        type: 'pesticide',
        product: 'Clorpirifós 48% EC',
        dosage: '1.5 L/ha',
        frequency: 'Una aplicación',
        description: 'Insecticida de contacto e ingestión',
        priority: 'high',
      },
      {
        type: 'pesticide',
        product: 'Bacillus thuringiensis',
        dosage: '500 ml/ha',
        frequency: 'Cada 7-10 días',
        description: 'Insecticida biológico selectivo',
        priority: 'medium',
      },
    ] as Recommendation[],
  },
  {
    disease: undefined,
    pest: undefined,
    healthStatus: 'healthy',
    confidence: 96,
    symptoms: [],
    recommendations: [
      {
        type: 'fertilizer',
        description: 'Mantener fertilización regular (NPK 10-10-10)',
        priority: 'low',
      },
      {
        type: 'irrigation',
        description: 'Riego cada 3-4 días según condiciones de lluvia',
        priority: 'low',
      },
    ] as Recommendation[],
  },
];

export default function DiagnoseScreen() {
  const { plots, addDiagnosis } = useFarmContext();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPlot, setSelectedPlot] = useState<string>(plots[0]?.id || '');
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const runDiagnosis = async () => {
    if (!selectedImage || !selectedPlot) {
      Alert.alert('Error', 'Selecciona una foto y un lote');
      return;
    }

    setLoading(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockResult = MOCK_DIAGNOSES[Math.floor(Math.random() * MOCK_DIAGNOSES.length)];
    setDiagnosis(mockResult);

 const diagnosisId = `diag_${Date.now()}`;

  const newDiagnosis: Diagnosis = {
    id: diagnosisId,
    plotId: selectedPlot,
    imageUri: selectedImage,
    disease: mockResult.disease,
    pest: mockResult.pest,
    healthStatus: mockResult.healthStatus,
    confidence: mockResult.confidence,
    symptoms: mockResult.symptoms,
    createdAt: new Date(),
    recommendations: mockResult.recommendations?.map((rec, idx) => ({
      id: `rec_${idx}`,
      diagnosisId,
      type: rec.type,
      product: rec.product,
      dosage: rec.dosage,
      frequency: rec.frequency,
      description: rec.description,
      priority: rec.priority,
    })),
  };

    addDiagnosis(newDiagnosis);
    setLoading(false);
  };

  const resetDiagnosis = () => {
    setDiagnosis(null);
    setSelectedImage(null);
  };

  if (diagnosis) {
    return (
      <View style={styles.container}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Image Preview */}
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.resultImage} />
            )}

            {/* Diagnosis Result */}
            <Card>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Resultado del Diagnóstico</Text>
                <HealthBadge status={diagnosis.healthStatus} confidence={diagnosis.confidence} />
              </View>

              {diagnosis.disease && (
                <Text style={styles.diagnosisLabel}>🦠 {diagnosis.disease}</Text>
              )}
              {diagnosis.pest && (
                <Text style={styles.diagnosisLabel}>🐛 {diagnosis.pest}</Text>
              )}

              {diagnosis.symptoms.length > 0 && (
                <View style={styles.symptomsContainer}>
                  <Text style={styles.subTitle}>Síntomas Detectados:</Text>
                  {diagnosis.symptoms.map((symptom: string, idx: number) => (
                    <View key={idx} style={styles.symptomItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.symptomText}>{symptom}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Card>

            {/* Recommendations */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recomendaciones</Text>
              {diagnosis.recommendations.map((rec: any, idx: number) => (
                <Card key={idx}>
                  <View style={styles.recHeader}>
                    <Text style={styles.recType}>
                      {rec.type === 'fungicide'
                        ? '⚗️ Fungicida'
                        : rec.type === 'pesticide'
                        ? '🧪 Plaguicida'
                        : rec.type === 'fertilizer'
                        ? '🌱 Fertilizante'
                        : rec.type === 'irrigation'
                        ? '💧 Riego'
                        : '📋 Otra'}
                    </Text>
                    <View
                      style={[
                        styles.priorityBadge,
                        {
                          backgroundColor:
                            rec.priority === 'high'
                              ? '#FFEBEE'
                              : rec.priority === 'medium'
                              ? '#FFF3E0'
                              : '#E8F5E9',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          {
                            color:
                              rec.priority === 'high'
                                ? colors.error
                                : rec.priority === 'medium'
                                ? '#E65100'
                                : colors.success,
                          },
                        ]}
                      >
                        {rec.priority === 'high'
                          ? 'Urgente'
                          : rec.priority === 'medium'
                          ? 'Media'
                          : 'Baja'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.recDescription}>{rec.description}</Text>

                  {rec.product && (
                    <View style={styles.recDetails}>
                      <Text style={styles.recLabel}>Producto:</Text>
                      <Text style={styles.recValue}>{rec.product}</Text>
                    </View>
                  )}
                  {rec.dosage && (
                    <View style={styles.recDetails}>
                      <Text style={styles.recLabel}>Dosis:</Text>
                      <Text style={styles.recValue}>{rec.dosage}</Text>
                    </View>
                  )}
                  {rec.frequency && (
                    <View style={styles.recDetails}>
                      <Text style={styles.recLabel}>Frecuencia:</Text>
                      <Text style={styles.recValue}>{rec.frequency}</Text>
                    </View>
                  )}
                </Card>
              ))}
            </View>

            {/* Actions */}
            <View style={styles.actionContainer}>
              <Button title="Nuevo Diagnóstico" onPress={resetDiagnosis} variant="outline" />
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
          <Text style={styles.title}>Diagnosticar Cultivo</Text>

          {/* Plot Selection */}
          <Card>
            <Text style={styles.label}>Seleccionar Lote</Text>
            <View style={styles.plotButtons}>
              {plots.map((plot) => (
                <Button
                  key={plot.id}
                  title={plot.name}
                  onPress={() => setSelectedPlot(plot.id)}
                  variant={selectedPlot === plot.id ? 'primary' : 'outline'}
                  size="small"
                />
              ))}
            </View>
          </Card>

          {/* Image Upload */}
          {!selectedImage ? (
            <View style={styles.uploadSection}>
              <Card style={styles.uploadCard}>
                <MaterialIcons name="image-not-supported" size={64} color={colors.outline} />
                <Text style={styles.uploadTitle}>Cargar Foto del Cultivo</Text>
                <Text style={styles.uploadDescription}>
                  Toma una foto o selecciona una del álbum
                </Text>
              </Card>

              <View style={styles.buttonGroup}>
                <Button title="📸 Tomar Foto" onPress={takePicture} />
                <Button title="🖼️ Galería" onPress={pickImage} variant="secondary" />
              </View>
            </View>
          ) : (
            <View style={styles.previewSection}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              <View style={styles.buttonGroup}>
                <Button
                  title={loading ? 'Analizando...' : 'Analisar Foto'}
                  onPress={runDiagnosis}
                  loading={loading}
                />
                <Button title="Cambiar Foto" onPress={() => setSelectedImage(null)} variant="outline" />
              </View>
            </View>
          )}

          <View style={styles.infoCard}>
            <Card>
              <View style={styles.infoContent}>
                <MaterialIcons name="info" size={20} color={colors.primary} />
                <Text style={styles.infoText}>
                  Asegúrate que la foto muestre claramente el área afectada del cultivo para obtener un mejor diagnóstico
                </Text>
              </View>
            </Card>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  plotButtons: {
    gap: spacing.md,
  },
  uploadSection: {
    marginVertical: spacing.xl,
  },
  uploadCard: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
    marginTop: spacing.lg,
  },
  uploadDescription: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  previewSection: {
    marginVertical: spacing.xl,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  resultImage: {
    width: '100%',
    height: 250,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  buttonGroup: {
    gap: spacing.md,
  },
  infoCard: {
    marginTop: spacing.xl,
  },
  infoContent: {
    flexDirection: 'row',
    gap: spacing.lg,
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    color: colors.onSurface,
    flex: 1,
    lineHeight: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.onSurface,
  },
  diagnosisLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.onSurface,
    marginVertical: spacing.md,
  },
  symptomsContainer: {
    marginTop: spacing.lg,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  bullet: {
    fontSize: 16,
    color: colors.primary,
    marginRight: spacing.md,
  },
  symptomText: {
    fontSize: 14,
    color: colors.onSurface,
    flex: 1,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: spacing.lg,
  },
  recHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  recType: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
  },
  priorityBadge: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  recDescription: {
    fontSize: 14,
    color: colors.onSurface,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  recDetails: {
    marginTop: spacing.md,
  },
  recLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
  },
  recValue: {
    fontSize: 13,
    color: colors.onSurface,
    marginTop: spacing.xs,
  },
  actionContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
});