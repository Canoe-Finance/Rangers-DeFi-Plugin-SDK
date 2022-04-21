import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import tailwind, { tailwindHMR } from 'stencil-tailwind-plugin'
import tailwindcss from 'tailwindcss'
import { defaultExtractor } from 'tailwindcss/lib/lib/defaultExtractor'
import tailwindConf from './tailwind.config'
import purgecss from '@fullhuman/postcss-purgecss'
import autoprefixer from 'autoprefixer'

// https://stenciljs.com/docs/config

export const config: Config = {
  enableCache: false,
  buildEs5: 'prod',
  extras: {
    cssVarsShim: true,
    dynamicImportShim: true,
    shadowDomShim: true,
    safari10: true,
    scriptDataOpts: true,
    appendChildSlotFix: false,
    cloneNodeFix: false,
    slotChildNodesFix: true,
  },
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
    },
  ],
  plugins: [
    sass({ injectGlobalPaths: ['./src/styles/variables.scss', './src/styles/common.scss'] }),
    tailwind({
      tailwindConf,
      tailwindCssPath: './src/styles/tailwind.scss',
      postcss: {
        plugins: [
          tailwindcss(),
          purgecss({
            content: ['./**/*.tsx'],
            safelist: [':root', ':host', ':shadow', '/deep/', '::part', '::theme'],
            defaultExtractor,
          }),
          autoprefixer(),
        ],
      },
    }),
    tailwindHMR(),
  ],
  rollupPlugins: {
    after: [nodePolyfills()],
  },
}
