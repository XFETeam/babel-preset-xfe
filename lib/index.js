"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function default_1(context, opts = {}) {
    const nodeEnv = process.env.NODE_ENV;
    const { useBuiltIns = false, loose = false, 
    // 尽量降级以用于支持 IE9
    targets = {
        ie: 9,
    }, 
    // false, 用于支持 tree shaking
    modules = false, env = {}, } = opts;
    const transformRuntime = 'transformRuntime' in opts
        ? opts.transformRuntime
        : {
            corejs: false,
            helpers: true,
            absoluteRuntime: path_1.dirname(require.resolve('../package')),
            // TODO: 测试以下开启是否有根本影响, 尝试开启的原因是为了更小的 build
            useESModules: true
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
        /**
         * 当前插件主要用于让 import 支持 http 引入形式, 就像 Deno 一样: import zepto from 'FETCH:https://cdn.bootcss.com/zepto/1.0rc1/zepto.min.js';
         * 详情: https://www.npmjs.com/package/@xfe-team/babel-plugin-fetch-import
         */
        require.resolve('@xfe-team/babel-plugin-fetch-import'),
        /**
         * 考虑 IDE 支持度, 所有都应该手动加上 react import, 保持统一, 故: 禁用 babel-plugin-react-require
         */
        // require.resolve('babel-plugin-react-require'),
        /**
         * 用于支持动态 import, 如  import('./haha.js').then(...)
         * 详情: https://babeljs.io/docs/en/next/babel-plugin-syntax-dynamic-import.html
         */
        require.resolve('@babel/plugin-syntax-dynamic-import'),
        /**
         * 用于支持 let n = { x, y, ...z };
         * 其中, useBuiltIns: true 使用 Object.assign, 反之使用 Babel's extends helper
         * 详情: https://babeljs.io/docs/en/next/babel-plugin-proposal-object-rest-spread.html
         */
        [require.resolve('@babel/plugin-proposal-object-rest-spread'), { loose, useBuiltIns }],
        /**
         * 用于支持一下 example, 其中 catch 可以不写 catch(e)
         * try {
         *   throw 0;
         * } catch {
         *   doSomethingWhichDoesNotCareAboutTheValueThrown();
         * }
         *  详情: https://babeljs.io/docs/en/next/babel-plugin-proposal-optional-catch-binding.html
         */
        require.resolve('@babel/plugin-proposal-optional-catch-binding'),
        /**
         * 用于支持一下 example, 其中 catch 可以不写 catch(e)
         * async function* agf() {
         *   await 1;
         *   yield 2;
         * }
         *
         *  详情: https://babeljs.io/docs/en/next/babel-plugin-proposal-async-generator-functions.html
         */
        require.resolve('@babel/plugin-proposal-async-generator-functions'),
        // 下面两个的顺序的配置都不能动, 先后顺序必须为 @babel/plugin-proposal-decorators, @babel/plugin-proposal-class-properties !!!
        /**
         * 用于支持装饰器, 如以下例子
         * @annotation
         * class MyClass { }
         */
        [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
        /**
         * 用于支持一下例子:
         * class Bork {
         *    //Property initializer syntax
         *    instanceProperty = "bork";
         *    boundFunction = () => {
         *      return this.instanceProperty;
         * };
         *
         * 使用参数 { "loose": true }
         * var Bork = function Bork() {
         *   babelHelpers.classCallCheck(this, Bork);
         *   this.x = 'bar';
         *   this.y = void 0;
         * };
         *
         * 使用参数 { "loose": false }
         * var Bork = function Bork() {
         *   babelHelpers.classCallCheck(this, Bork);
         *   Object.defineProperty(this, "x", {
         *     configurable: true,
         *     enumerable: true,
         *     writable: true,
         *     value: 'bar'
         *   });
         *   Object.defineProperty(this, "y", {
         *     configurable: true,
         *  .....
         * 详情: https://babeljs.io/docs/en/next/babel-plugin-proposal-class-properties.html
         */
        [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
        /**
         * 用于支持: export * as ns from 'mod';
         * 详情: https://babeljs.io/docs/en/babel-plugin-proposal-export-namespace-from
         */
        require.resolve('@babel/plugin-proposal-export-namespace-from'),
        /**
         * 用于支持: export default from "mod";
         * 详情: https://github.com/tc39/proposal-export-default-from
         */
        require.resolve('@babel/plugin-proposal-export-default-from'),
        /**
         * 用于支持: var foo = object.foo ?? "default";
         *
         * In:
         * var foo = object.foo ?? "default";
         *
         * Out:
         * var _object$foo;
         * var foo = (_object$foo = object.foo) !== null && _object$foo !== void 0 ? _object$foo : "default";
         *
         * https://babeljs.io/docs/en/next/babel-plugin-proposal-nullish-coalescing-operator.html
         */
        [require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'), { loose }],
        /**
         * 用于支持 ?. 语法
         * const obj = {
         *   foo: {
         *     bar: {
         *       baz() {
         *         return 42;
         *       },
         *     },
         *   },
         * };
         *
         * const baz = obj?.foo?.bar?.baz(); // 42
         *
         * const safe = obj?.qux?.baz(); // undefined
         * const safe2 = obj?.foo.bar.qux?.(); // undefined
         *
         * const willThrow = obj?.foo.bar.qux(); // Error: not a function
         *
         * // Top function can be called directly, too.
         * function test() {
         *   return 42;
         * }
         * test?.(); // 42
         *
         * exists?.(); // undefined
         *
         * 详情: https://babeljs.io/docs/en/next/babel-plugin-proposal-optional-chaining.html
         */
        [require.resolve('@babel/plugin-proposal-optional-chaining'), { loose }],
        /**
         * 用于支持 pipeline 语法, 如:
         *
         * let result = exclaim(capitalize(doubleSay("hello")));
         * result //=> "Hello, hello!"
         *
         * let result = "hello"
         *   |> doubleSay
         *   |> capitalize
         *
         * result //=> "Hello, hello!"
         */
        [
            require.resolve('@babel/plugin-proposal-pipeline-operator'),
            {
                proposal: 'minimal',
            },
        ],
        /**
         * 用于支持 do 语法, do { .. }
         * let a = do {
         * if(x > 10) {
         *   'big';
         * } else {
         *
         */
        require.resolve('@babel/plugin-proposal-do-expressions'),
        /**
         * 用于支持 :: 语法
         * obj::func
         * // is equivalent to:
         * func.bind(obj)
         *
         * 详情: https://babeljs.io/docs/en/next/babel-plugin-proposal-function-bind.html
         */
        require.resolve('@babel/plugin-proposal-function-bind'),
        require.resolve('babel-plugin-macros'),
        // Necessary to include regardless of the environment because
        // in practice some other transforms (such as object-rest-spread)
        // don't work without it: https://github.com/babel/babel/issues/7215
        /**
         * 用于处理 let [a, b, ...rest] = arr;
         * 详情: https://babeljs.io/docs/en/next/babel-plugin-transform-destructuring.html
         */
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
    ];
    if (nodeEnv !== 'test' && transformRuntime) {
        /**
         * 在运行期对相关语法进行降级
         * 详情: https://babeljs.io/docs/en/babel-plugin-transform-runtime
         */
        plugins.push([require.resolve('@babel/plugin-transform-runtime'), transformRuntime]);
    }
    if (nodeEnv === 'production') {
        /**
         * 在生产环境移除所有的 react prop types
         */
        plugins.push([
            require('babel-plugin-transform-react-remove-prop-types').default,
            {
                // 直接移除 import PropTypes from 'prop-types' 的引用
                removeImport: true,
            },
        ]);
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
        plugins
    };
}
exports.default = default_1;
