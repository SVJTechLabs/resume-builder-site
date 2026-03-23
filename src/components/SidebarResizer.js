/**
 * SidebarResizer Component
 * Handles the interactive resizing of the sidebar.
 */
class SidebarResizer {
  constructor() {
    this.resizer = document.getElementById('resizer');
    this.appBody = document.querySelector('.app-body');
    this.isDragging = false;
    this.minWidth = 300;
    this.maxWidth = 600;
    
    // Initial width from localStorage
    const savedWidth = localStorage.getItem('sidebarWidth');
    if (savedWidth) {
      this.setSidebarWidth(parseInt(savedWidth));
    }
  }

  init() {
    if (!this.resizer) return;

    this.resizer.addEventListener('mousedown', (e) => this.startDragging(e));
    this.resizer.addEventListener('touchstart', (e) => this.startDragging(e));
    
    // Handlers for global mouse/touch events
    this.boundOnMouseMove = (e) => this.onMouseMove(e);
    this.boundStopDragging = () => this.stopDragging();
  }

  startDragging(e) {
    e.preventDefault();
    this.isDragging = true;
    document.body.style.cursor = 'col-resize';
    document.body.classList.add('is-resizing');
    this.resizer.classList.add('active');
    
    // Use pointer events for cross-platform support if possible, but keep simple for now
    window.addEventListener('mousemove', this.boundOnMouseMove);
    window.addEventListener('mouseup', this.boundStopDragging);
    window.addEventListener('touchmove', this.boundOnMouseMove);
    window.addEventListener('touchend', this.boundStopDragging);
  }

  onMouseMove(e) {
    if (!this.isDragging) return;
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    if (clientX === undefined) return;

    // Apply constraints
    let newWidth = Math.max(this.minWidth, Math.min(this.maxWidth, clientX));
    
    this.setSidebarWidth(newWidth);
    localStorage.setItem('sidebarWidth', newWidth);
    
    // Dispatch a resize event for other components (like PreviewManager) to handle zoom/fit
    window.dispatchEvent(new Event('resize'));
  }

  stopDragging() {
    this.isDragging = false;
    document.body.style.cursor = '';
    document.body.classList.remove('is-resizing');
    this.resizer.classList.remove('active');
    
    window.removeEventListener('mousemove', this.boundOnMouseMove);
    window.removeEventListener('mouseup', this.boundStopDragging);
    window.removeEventListener('touchmove', this.boundOnMouseMove);
    window.removeEventListener('touchend', this.boundStopDragging);
  }

  setSidebarWidth(width) {
    document.documentElement.style.setProperty('--sidebar-width', `${width}px`);
  }
}
