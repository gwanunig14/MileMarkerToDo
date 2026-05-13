export const Colors = {
  // Gradient background
  gradientStart: "#4169e1",
  gradientEnd: "#000000",

  // Base
  white: "#ffffff",
  black: "#000000",

  // Text
  textPrimary: "#ffffff",
  textMuted: "#ffffffb8",       // 72% white – due dates, secondary labels
  textPlaceholder: "#ffffff80", // 50% white – input placeholders
  textError: "#ff9aa2",

  // Card / panel surfaces
  surfaceCard: "#080c1cd1",     // 82% deep navy – login card
  surfaceModal: "#080c1ce6",    // 90% deep navy – modals
  surfaceRow: "#ffffff0f",      // 6% white – todo row background
  surfaceInput: "#ffffff14",    // 8% white – inputs, secondary buttons
  surfaceChip: "#ffffff0a",     // 4% white – priority chips
  surfaceCheckoff: "#ffffff08", // 3% white – checkoff circle fill

  // Borders
  borderRow: "#ffffff1f",       // 12% white – todo row border
  borderButton: "#ffffff24",    // 14% white – add button border
  borderCard: "#ffffff29",      // 16% white – card, modal, secondary button border
  borderInput: "#ffffff2e",     // 18% white – text input border
  borderChip: "#ffffff40",      // 25% white – priority chip / dot border
  borderCheckoff: "#ffffff8c",  // 55% white – checkoff ring

  // Overlays
  backdropModal: "#00000073",   // 45% black – modal backdrop

  // Accent
  accent: "#4169e1",            // royal blue – primary buttons
  accentTranslucent: "#4169e1e0", // 88% royal blue – add button

  // Priority
  priorityLow: "#7dd3fc",
  priorityMed: "#fbbf24",
  priorityHigh: "#fb7185",
} as const;
