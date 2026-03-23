// ========================================
// ResumeForge v1.0 - History Manager (Undo/Redo)
// Implements Command Pattern for undo/redo functionality
// ========================================

const MAX_HISTORY_SIZE = 50; // Maximum number of states to keep

class HistoryManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
    this.currentState = null;
    this.isUndoing = false;
    this.onStateChange = null;
    this.onUndoRedo = null;
  }

  /**
   * Initialize with starting state
   */
  init(initialState) {
    this.currentState = deepClone(initialState);
    this.undoStack = [];
    this.redoStack = [];
    this.updateUI();
  }

  /**
   * Save a new state to history
   * Call this whenever data changes
   */
  saveState(newState, action = 'edit') {
    // Don't save during undo/redo operations
    if (this.isUndoing) return;

    // Don't save if state hasn't actually changed
    if (JSON.stringify(this.currentState) === JSON.stringify(newState)) {
      return;
    }

    // Push current state to undo stack
    this.undoStack.push({
      state: deepClone(this.currentState),
      action: action,
      timestamp: Date.now()
    });

    // Limit stack size
    if (this.undoStack.length > MAX_HISTORY_SIZE) {
      this.undoStack.shift();
    }

    // Clear redo stack on new action
    this.redoStack = [];

    // Update current state
    this.currentState = deepClone(newState);

    this.updateUI();
  }

  /**
   * Undo the last action
   */
  undo() {
    if (!this.canUndo()) return false;

    this.isUndoing = true;

    // Save current state to redo stack
    this.redoStack.push({
      state: deepClone(this.currentState),
      action: 'undo',
      timestamp: Date.now()
    });

    // Pop last state from undo stack
    const previous = this.undoStack.pop();
    this.currentState = deepClone(previous.state);

    this.isUndoing = false;
    this.updateUI();

    // Notify listeners
    if (this.onUndoRedo) {
      this.onUndoRedo(this.currentState, 'undo');
    }

    showToast(`Undo: ${previous.action}`, 'success', 1500);
    return true;
  }

  /**
   * Redo the last undone action
   */
  redo() {
    if (!this.canRedo()) return false;

    this.isUndoing = true;

    // Save current state to undo stack
    this.undoStack.push({
      state: deepClone(this.currentState),
      action: 'redo',
      timestamp: Date.now()
    });

    // Pop state from redo stack
    const next = this.redoStack.pop();
    this.currentState = deepClone(next.state);

    this.isUndoing = false;
    this.updateUI();

    // Notify listeners
    if (this.onUndoRedo) {
      this.onUndoRedo(this.currentState, 'redo');
    }

    showToast('Redo', 'success', 1500);
    return true;
  }

  /**
   * Check if undo is available
   */
  canUndo() {
    return this.undoStack.length > 0;
  }

  /**
   * Check if redo is available
   */
  canRedo() {
    return this.redoStack.length > 0;
  }

  /**
   * Get current state
   */
  getCurrentState() {
    return deepClone(this.currentState);
  }

  /**
   * Clear all history
   */
  clear() {
    this.undoStack = [];
    this.redoStack = [];
    this.updateUI();
  }

  /**
   * Update UI elements (buttons state)
   */
  updateUI() {
    // Update toolbar buttons if they exist
    const undoBtn = document.getElementById('btn-undo');
    const redoBtn = document.getElementById('btn-redo');
    
    if (undoBtn) {
      undoBtn.disabled = !this.canUndo();
      undoBtn.style.opacity = this.canUndo() ? '1' : '0.4';
    }
    
    if (redoBtn) {
      redoBtn.disabled = !this.canRedo();
      redoBtn.style.opacity = this.canRedo() ? '1' : '0.4';
    }
  }

  /**
   * Get history stats for debugging
   */
  getStats() {
    return {
      undoCount: this.undoStack.length,
      redoCount: this.redoStack.length,
      canUndo: this.canUndo(),
      canRedo: this.canRedo()
    };
  }
}

// Create global instance
const history = new HistoryManager();
