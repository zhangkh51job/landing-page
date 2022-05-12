const { defineConfig } = require('@vue/cli-service');
// import postcssFn from 'postcss-pxtorem'

const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);

const CompressionWebpackPlugin = require("compression-webpack-plugin"); // 开启gzip压缩(可选)
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i; // 开启gzip压缩(可选)

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin; // 打包分析，(可选)

const IS_PRODUCTION = ['production', 'prod'].includes(process.env.NODE_ENV); 
const TerserPlugin = require('terser-webpack-plugin')

module.exports = defineConfig({
	transpileDependencies: true,
	publicPath: './',
	// assetsDir: 'asset',
	productionSourceMap: false,
	chainWebpack: config => {
		config.resolve.symlinks(true); // 修复热更新失效
		// 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
		config.plugin("html").tap(args => {
		  // 修复 Lazy loading routes Error
		  args[0].chunksSortMode = "none";
		  return args;
		});
		config.resolve.alias // 添加别名
		  .set('@', resolve('src'))
		  .set('@assets', resolve('src/assets'))
		  .set('@components', resolve('src/components'))
		  .set('@views', resolve('src/views'))
		  .set('@store', resolve('src/store'));
		// 压缩图片
		// 需要 npm i -D image-webpack-loader
		config.module
		  .rule("images")
		  .use("image-webpack-loader")
		  .loader("image-webpack-loader")
		  .options({
			mozjpeg: {
			  progressive: true,
			  quality: 65
			},
			optipng: {
			  enabled: false
			},
			pngquant: {
			  quality: [0.65, 0.9],
			  speed: 4
			},
			gifsicle: {
			  interlaced: false
			},
			webp: {
			  quality: 75
			}
		  });

		config.module
			.rule('svg')
			.exclude.add(resolve('src/components/icons'))
			.end()
		config.module
			.rule('icons')
			.test(/\.svg$/)
			.include.add(resolve('src/components/icons'))
			.end()
			.use('svg-sprite-loader')
			.loader('svg-sprite-loader')
			.options({
				symbolId: 'icon-[name]'
			})
			.end()

		  config.optimization
		  	.minimizer('terser').use(new TerserPlugin({
				terserOptions: {
				  mangle: true,
				  compress: {
					drop_debugger: false
				  }
				}
			}))

		// 打包分析, 打包之后自动生成一个名叫report.html文件(可忽视)
		if (IS_PRODUCTION) {
		  config.plugin("webpack-report").use(BundleAnalyzerPlugin, [{
			analyzerMode: "static"
		  }]);
		}
	},
	  //webpack的配置项
	configureWebpack: config => {
		// 开启 gzip 压缩
		// 需要 npm i -D compression-webpack-plugin
		const plugins = [];
		if (IS_PRODUCTION) {
			plugins.push(
				new CompressionWebpackPlugin({
					filename: '[path][base].gz',//"[path].gz[query]",
					algorithm: "gzip",
					test: productionGzipExtensions,
					threshold: 0,
					minRatio: 0.8
				})
			);
		}
		config.plugins = [...config.plugins, ...plugins];
	},
	devServer: {
		host: '0.0.0.0',
		port: '8088',
		proxy: {
			"/": {
			//   target: "https://intest-tro-home.ncjimmy.com",//接口的地址
			// target: "https://intest-tro-home.ncjimmy.com/",
			target: "http://intest-hash-home-d6f44ceec5b2600a.elb.ap-east-1.amazonaws.com/",
			  changeOrigin: true,
			  pathRewrite: {
				// "^/kuai": ""
			  }
			},
		},
	},
});
