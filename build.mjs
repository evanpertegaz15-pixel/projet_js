import fs from "fs";
import crypto from "crypto";
import JavaScriptObfuscator from "javascript-obfuscator";

const files = ["cybershield/js/cipher.js", "cybershield/js/password.js", "cybershield/js/app.js"];
for (const file of files) {
    if (!fs.existsSync(file)) {
        console.error(`Erreur : Le fichier ${file} est introuvable.`);
        continue;
    }
    const sourceCode = fs.readFileSync(file, "utf8");
    const obfuscated = JavaScriptObfuscator.obfuscate(sourceCode, {
        compact: true,
        controlFlowFlattening: true,
        deadCodeInjection: true,
        stringArray: true,
        stringArrayEncoding: ["base64"],
        stringArrayThreshold: 1
    }).getObfuscatedCode();
    const hash = crypto.createHash("md5").update(obfuscated).digest("hex").slice(0, 8);
    const folder = file.split("/")[0];
    const name = file.split("/")[2].replace(".js", "");
    const outputPath = `${folder}/js/${name}.${hash}.min.js`;
    fs.writeFileSync(outputPath, obfuscated);
    console.log("Fichier généré :", outputPath);
}