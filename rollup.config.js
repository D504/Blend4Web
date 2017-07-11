export default {
    entry: 'src/index.js',
    indent: '\t',
    plugins: [

    ],
    sourceMap: true,
    targets: [
        {
            format: 'umd',
            moduleName: 'b4w',
            dest: 'projects/b4w.js'
        }
    ]
};
