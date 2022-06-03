import path from "path"
import webpack from "webpack"
import { fileURLToPath } from 'url'

import HtmlWebpackPlugin from "html-webpack-plugin"
import { CleanWebpackPlugin }from "clean-webpack-plugin"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
    mode: "production",
    entry: {
        main: path.resolve(__dirname, "..", 'src/index.ts')
    },
    output: {
        path: path.resolve(__dirname, "..", 'dist'),
        filename: '[name].bundle.js',
        // publicPath: '/'
    },
    resolve: {
        extensions:[".json",".js",".ts"],
        alias: {
            "@":path.resolve(__dirname,"..", "src")
        }
    },
    optimization: {
        chunkIds: "size",
        // method of generating ids for chunks
        moduleIds: "size",
        // method of generating ids for modules
        mangleExports: "size",
        // rename export names to shorter names
        minimize: true,
        // minimize the output files
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Game',
            template: path.resolve(__dirname, "..",'./public/index.html'), // шаблон
            filename: 'index.html', // название выходного файла
        }),
        new CleanWebpackPlugin(),
    ],
    module: {
        rules: [
            // JavaScript
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
            },
            //ts
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            //images
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource',
            },
            //svg/fonts
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline',
            },
            // CSS, PostCSS, Sass
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
            },
        ],
    }
}