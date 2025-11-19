export interface Plot {
  id: string;
  name: string;
  cropType: string; // e.g., "Corn", "Wheat", "Soybean"
  area: number; // hectares
  imageUri?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Diagnosis {
  id: string;
  plotId: string;
  imageUri: string;
  disease?: string;
  pest?: string; 
  healthStatus: 'healthy' | 'warning' | 'critical'; // healthy, warning, critical
  confidence: number; // 0-100
  symptoms: string[];
  createdAt: Date;
  recommendations?: Recommendation[];
}

export interface Recommendation {
  id: string;
  diagnosisId: string;
  type: 'fungicide' | 'pesticide' | 'fertilizer' | 'irrigation' | 'other';
  product?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  description: string;
  cost?: number;
  priority: 'low' | 'medium' | 'high';
}

export interface User {
  id: string;
  name: string;
  email: string;
  farm: string;
  location: string;
  createdAt: Date;
}