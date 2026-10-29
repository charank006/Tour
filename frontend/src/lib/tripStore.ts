import { useState, useEffect } from 'react';

export interface WizardInputs {
  startLocation: string;
  startDate: string;
  endDate: string;
  travelers: number | string;
  travelType: string;
  budget: string;
  budgetRange?: { min: number; max: number };
  mood: string;
  destination?: string | null;
}

export interface StoredWizardState {
  inputs: WizardInputs;
  selectedDestination: unknown | null;
  generatedPlan: unknown | null;
  lastUpdated: number;
}

const STORAGE_KEY = 'planyours_wizard_state_v2';

const DEFAULT_INPUTS: WizardInputs = {
  startLocation: 'Mumbai',
  startDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
  endDate: new Date(Date.now() + 86400000 * 11).toISOString().split('T')[0],
  travelers: 2,
  travelType: 'couple',
  budget: 'moderate',
  budgetRange: { min: 15000, max: 30000 },
  mood: 'mountains',
  destination: null
};

export const tripStore = {
  getState: (): StoredWizardState => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return {
          inputs: DEFAULT_INPUTS,
          selectedDestination: null,
          generatedPlan: null,
          lastUpdated: Date.now()
        };
      }
      const parsed = JSON.parse(raw);
      return {
        inputs: { ...DEFAULT_INPUTS, ...(parsed.inputs || {}) },
        selectedDestination: parsed.selectedDestination || null,
        generatedPlan: parsed.generatedPlan || null,
        lastUpdated: parsed.lastUpdated || Date.now()
      };
    } catch (err) {
      console.warn('[TripStore] Failed to read sessionStorage:', err);
      return {
        inputs: DEFAULT_INPUTS,
        selectedDestination: null,
        generatedPlan: null,
        lastUpdated: Date.now()
      };
    }
  },

  setState: (updater: (prev: StoredWizardState) => Partial<StoredWizardState>) => {
    try {
      const prev = tripStore.getState();
      const next = { ...prev, ...updater(prev), lastUpdated: Date.now() };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      // Dispatch storage event for cross-tab or same-window listeners
      window.dispatchEvent(new CustomEvent('planyours_store_update', { detail: next }));
      return next;
    } catch (err) {
      console.warn('[TripStore] Failed to write to sessionStorage:', err);
    }
  },

  saveInputs: (inputs: Partial<WizardInputs>) => {
    return tripStore.setState((prev) => ({
      inputs: { ...prev.inputs, ...inputs }
    }));
  },

  saveDestination: (destination: unknown) => {
    return tripStore.setState(() => ({
      selectedDestination: destination
    }));
  },

  savePlan: (plan: unknown) => {
    return tripStore.setState(() => ({
      generatedPlan: plan
    }));
  },

  clear: () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('planyours_store_update', { detail: null }));
    } catch (err) {
      console.warn('[TripStore] clear failed:', err);
    }
  },

  hasActiveBlueprint: (): boolean => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return Boolean(parsed.inputs?.startLocation && parsed.inputs?.startDate);
    } catch {
      return false;
    }
  }
};

/**
 * React hook to reactively consume and update wizard state
 */
export function useWizardState() {
  const [state, setState] = useState<StoredWizardState>(() => tripStore.getState());

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const detail = (e as CustomEvent<StoredWizardState>).detail;
      if (detail) {
        setState(detail);
      } else {
        setState(tripStore.getState());
      }
    };

    window.addEventListener('planyours_store_update', handleUpdate);
    return () => window.removeEventListener('planyours_store_update', handleUpdate);
  }, []);

  return {
    ...state,
    saveInputs: tripStore.saveInputs,
    saveDestination: tripStore.saveDestination,
    savePlan: tripStore.savePlan,
    clear: tripStore.clear
  };
}
