export default {
	entry: 'src/index.js',
	indent: '\t',
	plugins: [
	],
	sourceMap: true,
	targets: [
		{
			format: 'umd',
			moduleName: 'Blend4Web',
			dest: 'deploy/apps/common/b4w.js'
		}
	]
};
