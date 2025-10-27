# Interactive Learning Games

A collection of drag-and-drop educational games built with React, TypeScript, and Vite.

## 🎮 Games

- **Kanban Board** - Drag and drop task management
- **Match the Following** - Connect related items
- **Odd One Out** - Find the item that doesn't belong
- **Fill in the Blanks** - Complete sentences with drag-and-drop words
- **Jumbled Words** - Rearrange letters to form words
- **Number Puzzles** - Solve number placement puzzles
- **Circle the Odd One** - Select the item that doesn't match
- **Match the Following 2** - Advanced matching with visual flow

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx       # Standardized button component
│   ├── PageLayout.tsx   # Page wrapper with navigation
│   ├── ResultMessage.tsx # Success/error messages
│   ├── ProgressBar.tsx  # Progress indicator
│   └── index.ts         # Component exports
├── data/                # Static data and constants
│   └── navigation.ts    # Navigation menu items
├── pages/               # Game pages
│   ├── Home.tsx         # Landing page
│   ├── KanbanBoard.tsx  # Kanban board game
│   ├── MatchTheFollowing.tsx
│   └── ...
├── types/               # TypeScript type definitions
│   └── index.ts         # Shared types
├── utils/               # Helper functions
│   ├── dragDrop.ts      # Drag-and-drop utilities
│   └── gameHelpers.ts   # Game-related helpers
├── App.tsx              # Main app router
└── main.tsx             # Entry point
```

## ✨ Features

- **Reusable Components**: Consistent UI across all games
- **Type Safety**: Full TypeScript support
- **Drag & Drop**: Built with @dnd-kit
- **Modern UI**: Tailwind CSS styling
- **Responsive Design**: Works on all devices
- **Clean Code**: Well-organized and maintainable

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Technologies

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **@dnd-kit** - Drag and drop functionality
- **@xyflow/react** - Interactive flow diagrams
- **React Router** - Navigation

## 📝 Code Organization

The codebase is organized with:

1. **Components** - Reusable UI elements
2. **Pages** - Game implementations
3. **Types** - Shared TypeScript interfaces
4. **Utils** - Helper functions
5. **Data** - Static constants

This structure promotes code reusability and maintainability.
