// postcss.config.cjs
module.exports = {
  plugins: [
    require('@tailwindcss/postcss'), // <--- Cambiado/Asegurado
    require('autoprefixer'),
    // ...otros plugins si los tienes
  ],
};