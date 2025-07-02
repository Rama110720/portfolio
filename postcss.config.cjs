// postcss.config.cjs
module.exports = {
  plugins: {
    // Ganti 'tailwindcss' dengan require('@tailwindcss/postcss')
    tailwindcss: require('@tailwindcss/postcss'), // <--- UBAH BARIS INI
    autoprefixer: {},
  },
};