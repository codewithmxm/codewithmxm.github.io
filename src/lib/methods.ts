/** Controlled vocabulary for the Work filter. Keep in step with .pages.yml (projects > methods). */
export const METHODS = [
  'form-finding',
  'seismic-analysis',
  'embodied-carbon',
  'finite-element',
  'optimisation',
  'validation',
  'life-cycle-assessment',
  'machine-learning',
  'hand-calculation',
  'interactive-tools',
  'durability-modelling',
] as const;

export const METHOD_LABELS: Record<(typeof METHODS)[number], string> = {
  'form-finding': 'Form-finding',
  'seismic-analysis': 'Seismic analysis',
  'embodied-carbon': 'Embodied carbon',
  'finite-element': 'Finite elements',
  optimisation: 'Optimisation',
  validation: 'Validation',
  'life-cycle-assessment': 'Life-cycle assessment',
  'machine-learning': 'Machine learning',
  'hand-calculation': 'Hand calculation',
  'interactive-tools': 'Interactive tools',
  'durability-modelling': 'Durability modelling',
};

export type Method = (typeof METHODS)[number];
