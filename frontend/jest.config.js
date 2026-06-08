module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    // Procesa los componentes monofichero de Vue 2
    '^.+\\.vue$': '@vue/vue2-jest',
    // Procesa el JavaScript con la config de Babel del proyecto
    '^.+\\.(js|jsx)$': 'babel-jest',
    // Convierte importaciones de recursos (imágenes, css) en stubs vacíos
    '.+\\.(css|styl|less|sass|scss|png|jpg|jpeg|gif|webp|svg|ttf|woff|woff2)$': 'jest-transform-stub'
  },
  moduleNameMapper: {
    // Resuelve el alias "@/..." igual que en el proyecto
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: ['**/tests/unit/**/*.spec.[jt]s?(x)'],
  transformIgnorePatterns: ['/node_modules/']
}
