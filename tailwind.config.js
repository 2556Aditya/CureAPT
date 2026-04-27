const {nextui} = require("@nextui-org/react");
/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}',
    './src/**/*.js',
    './node_modules/@my-company/tailwind-components/**/*.js',
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors:{
      blue: colors.blue,
      green:colors.green,
      red:colors.red,
      yellow:colors.yellow,
      orange:colors.orange,
      purple:colors.purple,
      pink:colors.pink,
      gray:colors.gray,
      black:colors.black,
      white:colors.white,
      indigo:colors.indigo,
      cyan:colors.cyan,
      slate:colors.slate,
      neutral:colors.neutral,
      
      
    },
    extend: {
            animation: {
              scroll: 'scroll 34s linear infinite',
              blob1: 'blob1 25s infinite',
              blob2: 'blob2 30s infinite',
              blob3: 'blob3 35s infinite',
            },
            keyframes: {
              scroll: {
                '0%': { transform: 'translateX(0)' },
                '100%': { transform: 'translateX(-50%)' }
              },
              blob1: {
                '0%, 100%': {
                  transform: 'translate(0, 0) scale(1)',
                },
                '33%': {
                  transform: 'translate(30%, 30%) scale(1.2)',
                },
                '66%': {
                  transform: 'translate(-20%, 20%) scale(0.8)',
                },
              },
              blob2: {
                '0%, 100%': {
                  transform: 'translate(0, 0) scale(1)',
                },
                '33%': {
                  transform: 'translate(-30%, -30%) scale(1.2)',
                },
                '66%': {
                  transform: 'translate(20%, -20%) scale(0.8)',
                },
              },
              blob3: {
                '0%, 100%': {
                  transform: 'translate(0, 0) scale(1)',
                },
                '33%': {
                  transform: 'translate(-20%, 20%) scale(1.2)',
                },
                '66%': {
                  transform: 'translate(30%, -30%) scale(0.8)',
                },
              },
            },
          },
        },

        variants: {
          extend: {
            animation: ['hover', 'focus'],
          },
        },

  darkMode: "class",
  plugins: [nextui(),
    addVariablesForColors,
  ],
  important: true,
};

function addVariablesForColors({
  addBase,
  theme
}) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));

  addBase({
    ":root": newVars,
  });
}