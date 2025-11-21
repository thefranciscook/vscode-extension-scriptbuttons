/**
 * Represents a script button configuration
 */
export interface ScriptButton {
  /** Unique identifier for the button */
  id: string;
  /** Display label for the button */
  label: string;
  /** Terminal command to execute */
  command: string;
  /** Emoji icon for the button */
  emoji: string;
  /** Color for the button */
  color: string;
}

