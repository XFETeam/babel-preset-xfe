"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function default_1(context, opts = {}) {
    const nodeEnv = process.env.NODE_ENV;
    const { useBuiltIns = false, loose = false, 
    // We want Create React App to be IE 9 compatible until React itself
    // no longer works with IE 9
    targets = {
        ie: 9,
    }, 
    // Do not transform modules to CJS. Use for tree shaking
    modules = false, env = {}, } = opts;
    const transformRuntime = 'transformRuntime' in opts
        ? opts.transformRuntime
        : {
            corejs: false,
            helpers: true,
            absoluteRuntime: path_1.dirname(require.resolve('../package')),
        };
    const exclude = [
        // Exclude transforms that make all code slower
        'transform-typeof-symbol',
        'transform-unicode-regex',
        'transform-sticky-regex',
        'transform-new-target',
        'transform-modules-umd',
        'transform-modules-systemjs',
        'transform-modules-amd',
        'transform-literals',
    ];
    const plugins = [
        require.resolve('babel-plugin-react-require'),
        require.resolve('@babel/plugin-syntax-dynamic-import'),
        [require.resolve('@babel/plugin-proposal-object-rest-spread'), { loose, useBuiltIns }],
        require.resolve('@babel/plugin-proposal-optional-catch-binding'),
        require.resolve('@babel/plugin-proposal-async-generator-functions'),
        // 下面两个的顺序的配置都不能动
        [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
        [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
        require.resolve('@babel/plugin-proposal-export-namespace-from'),
        require.resolve('@babel/plugin-proposal-export-default-from'),
        [require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'), { loose }],
        [require.resolve('@babel/plugin-proposal-optional-chaining'), { loose }],
        [
            require.resolve('@babel/plugin-proposal-pipeline-operator'),
            {
                proposal: 'minimal',
            },
        ],
        require.resolve('@babel/plugin-proposal-do-expressions'),
        require.resolve('@babel/plugin-proposal-function-bind'),
        require.resolve('babel-plugin-macros'),
        // Necessary to include regardless of the environment because
        // in practice some other transforms (such as object-rest-spread)
        // don't work without it: https://github.com/babel/babel/issues/7215
        [
            require('@babel/plugin-transform-destructuring').default,
            {
                // Use loose mode for performance:
                // https://github.com/facebook/create-react-app/issues/5602
                loose: false,
                selectiveLoose: [
                    'useState',
                    'useEffect',
                    'useContext',
                    'useReducer',
                    'useCallback',
                    'useMemo',
                    'useRef',
                    'useImperativeHandle',
                    'useLayoutEffect',
                    'useDebugValue',
                ],
            },
        ],
        require.resolve('@babel/plugin-transform-object-assign')
    ];
    if (nodeEnv !== 'test' && transformRuntime) {
        plugins.push([require.resolve('@babel/plugin-transform-runtime'), transformRuntime]);
    }
    if (nodeEnv === 'production') {
        plugins.push(require.resolve('babel-plugin-transform-react-remove-prop-types'));
    }
    return {
        presets: [
            [
                require.resolve('@babel/preset-env'),
                {
                    targets,
                    loose,
                    modules,
                    exclude,
                    ...env,
                },
            ],
            require.resolve('@babel/preset-react'),
        ],
        plugins,
    };
}
exports.default = default_1;
