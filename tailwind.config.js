/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1600px',
      xl: '3200px'
    },
    container: {
      center: true,
      padding: '1.5rem',
      sizes: {} // defaults to breakpoint (screens) sizes
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        logopaint: "url('/images/white-paint-logo.jpg')",
        logobw: "url('/images/RH-logo-BW.png')",
        logocolor: "url('/images/RH-logo-color.png')",
        starfield: "url('/images/starfield.jpg')",
        starfieldGrad: "url('/images/starfield-grad.jpg')",
        startiles: "url('/images/stars-tile.gif')"
      },
      colors: {
        background: '#FBFBFF',
        textPrimary: '#585757',
        textLight: '#969696',
        active: '#8CC0F8',
        hover: '#BFB8E0',
        hoverDark: '#2E2A47',
        cgray: '#E8E8E8',
        icon: '#969696',
        white: '#FFFFFF',
        themePrimary: '#493b8a',
        themePrimaryHover: '#3C3371',
        themePrimaryDisabled: '#7262BC',
        themeSecondary: '#dc4c88',
        themeBackground: '#251730',
        themeSolidBg: 'rgb(65,27, 78)',
        fontDark: '#FFFFFF',
        fontLight: '#000000',
        themeText: '#54439D',
        themeLink: '#59bfdc',
        themeError: '#dc2020',
        themeSuccess: '#29823b',
        themeInfo: '#017aad',
        themePurple: '#493b8a',
        themeHotpink: '#dc4c88',
        themeTurquoise: '#59bfdc',
        themeGreen: '#8fc382',
        themeYellow: '#fbed53',
        filterLight: '#E3E3E3',
        backgroundDark: '#171717',
        contentDark: '#1E1E1E',
        innerDark: '#333333',
        borderDark: '#313131',
        inputDark: '#262626'
      },
      boxShadow: {
        themeActive: '0px 0px 1px 1px rgba(73, 59, 138, 0.2)',
        red: '0px 0px 1px 1px rgba(232,121,117,0.15)',
        button:
          '0px 1px 3px 0px rgba(0,0,0,0.1) 0px 2px 1px 0px rgba(0,0,0,0.06) 0px 1px 1px 0px rgba(0,0,0,0.08)',
        main: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 2px 1px rgba(0, 0, 0, 0.06), 0px 1px 1px rgba(0, 0, 0, 0.08);'
      },
      keyframes: {
        opaqueKey: {
          '0%': { opacity: '0' },
          '100%': { opacity: '100' }
        }
      },
      animation: {
        opaque: 'opaqueKey .5s linear'
      }
    },
    fontFamily: {
      interRegular: ['InterRegular', 'sans-serif'],
      interMedium: ['InterMedium', 'sans-serif'],
      interSemibold: ['InterSemibold', 'sans-serif'],
      ethnocentric: ['ethnocentric', 'sans-serif'],
      futuraCondensed: ['futura-pt-condensed', 'sans-serif']
    }
  },
  plugins: []
};
