import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Plot, Diagnosis, User } from '../types';

interface FarmContextType {
  plots: Plot[];
  diagnoses: Diagnosis[];
  user: User | null;
  addPlot: (plot: Plot) => void;
  updatePlot: (id: string, plot: Partial<Plot>) => void;
  deletePlot: (id: string) => void;
  addDiagnosis: (diagnosis: Diagnosis) => void;
  getDiagnosesByPlot: (plotId: string) => Diagnosis[];
  setUser: (user: User) => void;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export function FarmProvider({ children }: { children: ReactNode }) {
  const [plots, setPlots] = useState<Plot[]>([
    {
      id: '1',
      name: 'Lote Maíz Norte',
      cropType: 'Maíz',
      area: 5.5,
      createdAt: new Date(2024, 0, 15),
      updatedAt: new Date(2024, 0, 15),
    },
  ]);

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  const [user, setUserState] = useState<User | null>({
    id: '1',
    name: 'Santiago Fuentes',
    email: 'santiago@farm.com',
    farm: 'Farm Verde',
    location: 'Buenos Aires, Argentina',
    createdAt: new Date(),
  });

  const addPlot = (plot: Plot) => {
    setPlots([...plots, plot]);
  };

  const updatePlot = (id: string, updates: Partial<Plot>) => {
    setPlots(plots.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePlot = (id: string) => {
    setPlots(plots.filter(p => p.id !== id));
  };

  const addDiagnosis = (diagnosis: Diagnosis) => {
    setDiagnoses([...diagnoses, diagnosis]);
  };

  const getDiagnosesByPlot = (plotId: string) => {
    return diagnoses.filter(d => d.plotId === plotId);
  };

  const setUser = (newUser: User) => {
    setUserState(newUser);
  };

  return (
    <FarmContext.Provider
      value={{
        plots,
        diagnoses,
        user,
        addPlot,
        updatePlot,
        deletePlot,
        addDiagnosis,
        getDiagnosesByPlot,
        setUser,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
}

export function useFarmContext() {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarmContext must be used within FarmProvider');
  }
  return context;
}