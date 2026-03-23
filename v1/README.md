# ResumeForge v1.0

A complete, professional resume builder with multiple templates, local storage, and PDF export capabilities.

## Features

### Core Functionality
- **Multiple Resumes**: Create, save, and manage multiple resumes
- **Auto-save**: Automatic localStorage persistence
- **JSON Export/Import**: Portable resume data format
- **PDF Export**: Print-optimized output with browser print dialog

### Templates (6 Professional Designs)
1. **Modern** - Clean two-tone design with accent colors
2. **Classic** - Traditional centered header layout
3. **Minimal** - Simple, elegant typography-focused design
4. **Executive** - Sophisticated sidebar layout for senior roles
5. **Creative** - Bold accent border with distinctive styling
6. **Two-Column** - Compact layout maximizing space efficiency

### Customization Options
- **9 Color Themes**: Slate, Navy, Forest, Wine, Teal, Indigo, Rose, Amber, Mono
- **Typography**: Select heading and body fonts (Georgia, Inter, Playfair, Roboto)
- **Section Visibility**: Toggle individual sections on/off
- **Profile Photo**: Optional photo upload (2MB max)

### Resume Sections
- Personal Information (Name, Title, Contact)
- Professional Summary
- Work Experience (with bullet point achievements)
- Education (with GPA support)
- Skills & Technologies (with proficiency levels)
- Projects (with links and tech stack)
- Certifications & Awards
- Languages (with proficiency levels)
- References

### User Experience
- **Progress Indicator**: Visual completion percentage with suggestions
- **Live Preview**: Real-time resume preview as you type
- **Zoom Controls**: 50% - 150% preview scaling
- **Mobile Responsive**: Optimized for tablets and mobile devices
- **Keyboard Shortcuts**: Ctrl+S (save), Ctrl+P (print), Esc (close modals)

## Getting Started

1. Open `index.html` in any modern web browser
2. Start filling in your information in the Basics tab
3. Switch between tabs to add Work, Education, Skills, etc.
4. Customize your design in the Design tab
5. Export as PDF using the Download PDF button

## File Structure

```
v1/
├── index.html              # Main application entry point
├── styles/
│   ├── main.css           # Application styles
│   └── templates.css      # Resume template styles
└── src/
    ├── app.js             # Main application logic
    ├── utils/
    │   ├── helpers.js     # Utility functions
    │   ├── storage.js     # localStorage management
    │   └── validation.js  # Form validation
    ├── components/
    │   ├── ResumeManager.js   # Multiple resume handling
    │   ├── FormManager.js     # Form input management
    │   ├── PreviewManager.js  # Resume rendering & zoom
    │   └── DesignManager.js   # Template & theme selection
    └── templates/
        ├── modern.js      # Modern template renderer
        ├── classic.js     # Classic template renderer
        ├── minimal.js     # Minimal template renderer
        ├── executive.js   # Executive template renderer
        ├── creative.js    # Creative template renderer
        └── two-column.js  # Two-column template renderer
```

## Data Format

Resumes are stored in localStorage as JSON with the following structure:

```json
{
  "id": "unique-id",
  "name": "My Resume",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "basics": {
    "name": "John Doe",
    "title": "Software Engineer",
    "email": "john@example.com",
    "phone": "+1 234 567 8900",
    "location": "New York, NY",
    "website": "johndoe.com",
    "linkedin": "linkedin.com/in/johndoe",
    "github": "github.com/johndoe",
    "summary": "Professional summary..."
  },
  "photo": "data:image/jpeg;base64,...",
  "work": [...],
  "education": [...],
  "skills": [...],
  "projects": [...],
  "certificates": [...],
  "languages": [...],
  "references": [...],
  "settings": {
    "template": "modern",
    "color": "slate",
    "fontHeading": "Georgia",
    "fontBody": "Inter",
    "showPhoto": true,
    "showPageNumbers": false,
    "showSectionLines": true,
    "visibleSections": {...}
  }
}
```

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd + S | Save resume |
| Ctrl/Cmd + P | Print / Export PDF |
| Ctrl/Cmd + Shift + N | Create new resume |
| Esc | Close modals |

## Tips

- Use bullet points (•) in work descriptions for better formatting
- Quantify achievements when possible (e.g., "Increased sales by 40%")
- Keep your summary to 2-4 sentences
- Profile photos should be 400x400px, professional headshots
- Use the Design tab to customize colors and fonts

## Privacy Note

All data is stored locally in your browser's localStorage. No data is sent to any server. Clear your browser data to remove all stored resumes.

## License

MIT License - Free for personal and commercial use.
