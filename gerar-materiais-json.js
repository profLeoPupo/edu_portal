const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "materiais");
const outputFile = path.join(__dirname, "materiais.json");

const materiaisPorAluno = {};

// Função recursiva para percorrer subpastas e buscar arquivos PDF
function listarPDFsRecursivo(diretorioBase, pastaRelativa = "") {
  const fullPath = path.join(diretorioBase, pastaRelativa);
  const entradas = fs.readdirSync(fullPath);

  const arquivos = [];

  entradas.forEach((entrada) => {
    const caminhoRelativo = path.join(pastaRelativa, entrada);
    const caminhoCompleto = path.join(diretorioBase, caminhoRelativo);
    const stats = fs.statSync(caminhoCompleto);

    if (stats.isDirectory()) {
      arquivos.push(...listarPDFsRecursivo(diretorioBase, caminhoRelativo));
    } else if (stats.isFile() && entrada.toLowerCase().endsWith(".pdf")) {
      arquivos.push({
        nome: entrada.replace(".pdf", ""), // tira extensão
        arquivo: path.join("materiais", path.basename(diretorioBase), caminhoRelativo).replace(/\\/g, "/")
      });
    }
  });

  return arquivos;
}

// Percorre a pasta de cada aluno
fs.readdirSync(baseDir).forEach((alunoEmail) => {
  const alunoPath = path.join(baseDir, alunoEmail);
  if (!fs.statSync(alunoPath).isDirectory()) return;

  const arquivosPDF = listarPDFsRecursivo(alunoPath);
  if (arquivosPDF.length > 0) {
    materiaisPorAluno[alunoEmail] = arquivosPDF;
  }
});

// Escreve no materiais.json
fs.writeFileSync(outputFile, JSON.stringify(materiaisPorAluno, null, 2));

console.log("✅ materiais.json gerado com sucesso!");
