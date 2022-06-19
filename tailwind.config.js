module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      'display': ['Poppins'],
      'sans': ['Poppins']
    },
    extend: {
      colors: {
        'dark-blue': '#010440',
        'light-blue': '#3B9ABF',
        'orange-primary': '#F29829',
        'orange-dark': '#F25116',
        'new-light': '#F2F2F1',
        'new-light-blue': '#FFFFFF',
        'new-med-blue': '#DAE8F5',
        'new-dark-blue': '#90BDD4',
        'new-darker-blue': '#165CAB',
        'new-secondary': '#F26100',
        // 'new-light': '#F2F2F1',
        // 'new-light-blue': '#C4CFE8',
        // 'new-med-blue': '#7684AA',
        // 'new-dark-blue': '#4E5E7E',
        // 'new-darker-blue': '#283A52',
        // 'new-secondary': '#F0C15D',

        'admin-slate': '#3F4D67',
        'admin-slate-dark': '#39465E',
        'admin-white': '#F4F7FA',
        'admin-red': '#F44236',
        'admin-red-dark': '#d2382d',
        'admin-blue': '#04A9F5',
        'admin-blue-dark': '#038fd0',
        'admin-green': '#1DE9B6',
        'admin-purple': '#9297D4'
      }
    },
  },
  plugins: [
      require('tailwind-scrollbar')
  ],
}
