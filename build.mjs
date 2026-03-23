import fs from "fs";
import crypto from "crypto";
import JavaScriptObfuscator from "javascript-obfuscator";

const sourcePath = "cybershield/js/cipher.js";
const sourceCode = fs.readFileSync(sourcePath, "utf8");

const obfuscated = JavaScriptObfuscator.obfuscate(sourceCode, {
    compact: true,
    controlFlowFlattening: true,
    deadCodeInjection: true,
    stringArray: true,
    stringArrayEncoding: ["base64"],
    stringArrayThreshold: 1
}).getObfuscatedCode();

const hash = crypto.createHash("md5").update(obfuscated).digest("hex").slice(0, 8);
const outputPath = `cybershield/js/cipher.${hash}.min.js`;
fs.writeFileSync(outputPath, obfuscated);

console.log("Fichier généré :", outputPath);
console.log(`<script src="${outputPath}"></script>`);