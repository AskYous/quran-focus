# Quran Focus

A React application that allows users to listen to Saud Shuraym's recitation of the Quran with focus. Select a Surah and Ayah, and the app will auto-play Ayaat in order from that point.

## Features

- Select any Surah from the Quran
- Choose a starting Ayah
- Auto-play Ayaat in sequence with Saud Shuraym's recitation
- Display the Arabic text of the currently playing Ayah
- Modern, responsive UI built with Tailwind CSS

## Technologies Used

- React with TypeScript
- Vite as build tool
- Tailwind CSS for styling
- Axios for API requests

## API Credits

This application uses:
- [Alquran Cloud API](https://alquran.cloud/api) for Quran text data
- [Islamic Network](https://islamic.network) for audio files

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser to the URL shown in the terminal (typically http://localhost:5173)

## Building for Production

To create a production build:

```
npm run build
```

The build artifacts will be located in the `dist` directory.

## License

MIT
