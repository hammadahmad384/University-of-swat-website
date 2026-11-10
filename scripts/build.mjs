import {readFile,writeFile,rm} from 'node:fs/promises';
import {createRequire} from 'node:module';
import path from 'node:path';
// Optional dependency root supports CI tools installed outside the checkout.
const require=createRequire(process.env.SWAT_BUILD_DEPENDENCY_ROOT ? path.resolve(process.env.SWAT_BUILD_DEPENDENCY_ROOT,'package.json') : new URL('../package.json',import.meta.url));
const postcss=require('postcss'),cssnano=require('cssnano'),{minify}=require('terser');
const root=new URL('../',import.meta.url);
const css=await readFile(new URL('src/site.css',root),'utf8');
const result=await postcss([cssnano({preset:['default',{mergeRules:false,normalizeUrl:false}]})]).process(css,{from:undefined,map:false});
await writeFile(new URL('dist/site.min.css',root),result.css+'\n');
for(const name of ['catalogue','script']){
 const source=await readFile(new URL(`src/${name}.js`,root),'utf8');
 const output=await minify(source,{compress:true,mangle:true,format:{comments:false},ecma:2020});
 if(!output.code)throw new Error(`Empty ${name} output`);
 await writeFile(new URL(`dist/${name}.js`,root),output.code+'\n');
}
await writeFile(new URL('dist/motion.js',root),await readFile(new URL('src/motion.js',root),'utf8'));
for(const name of ['styles.css','enhancements.css','pages.css'])await rm(new URL(`dist/${name}`,root),{force:true});
console.log('Built one stylesheet, minified catalogue/script, and motion enhancement.');
