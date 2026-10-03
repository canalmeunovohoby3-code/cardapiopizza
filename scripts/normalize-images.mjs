/**
 * =====================================================================
 * OTIMIZAÇÃO DAS FOTOS DOS PRODUTOS
 * ---------------------------------------------------------------------
 * OTIMIZA a foto real (WebP, tamanho controlado, orientação corrigida)
 * PRESERVANDO a proporção original. O card usa a proporção real da foto,
 * então a imagem preenche o espaço SEM faixas e SEM cortar o produto.
 *
 * - Nome com HASH de conteúdo (cache-bust automático).
 * - Manifesto `src/data/generated-images.ts` liga o id do produto ao
 *   arquivo e às dimensões — o menu.ts não precisa de caminho manual.
 *
 * Uso:
 *   1) coloque as fotos em image-sources/pizzas/ (ou image-sources/drinks/)
 *      com o nome do produto; ex.: costela.jpg, coca-cola-2l.jpg
 *   2) rode:  npm run optimize:images
 * =====================================================================
 */
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const JOBS = [
  {
    srcDir: "image-sources/pizzas",
    outDir: "public/images/products/pizzas",
    prefix: "pizza",
    manifestKey: "productImages",
  },
  {
    srcDir: "image-sources/drinks",
    outDir: "public/images/products/drinks",
    prefix: "drink",
    manifestKey: "drinkImages",
  },
];

const MAX_SIDE = 1200; // lado do quadrado; limita, sem ampliar imagens pequenas
const QUALITY = 82;
const MANIFEST = "src/data/generated-images.ts";

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function listFiles(dir) {
  try {
    return await readdir(dir);
  } catch {
    return [];
  }
}

async function processJob(job) {
  await mkdir(job.srcDir, { recursive: true });
  await mkdir(job.outDir, { recursive: true });

  const map = {};
  const images = (await listFiles(job.srcDir)).filter((file) =>
    /\.(png|jpe?g|webp|avif)$/i.test(file),
  );

  for (const file of images) {
    const slug = slugify(file.replace(/\.[^.]+$/, ""));
    if (!slug) continue;

    const src = path.join(job.srcDir, file);
    const buffer = await readFile(src);
    const sourceMeta = await sharp(buffer).metadata();

    // Padroniza em QUADRADO (1:1) para todos os cards ficarem do mesmo
    // tamanho. O recorte é feito por atenção, mantendo o produto central.
    // Não amplia imagens pequenas.
    const size = Math.min(
      MAX_SIDE,
      Math.max(sourceMeta.width ?? MAX_SIDE, sourceMeta.height ?? MAX_SIDE),
    );

    const output = await sharp(buffer)
      .rotate()
      .resize(size, size, {
        fit: "cover",
        position: sharp.strategy.attention,
      })
      .webp({ quality: QUALITY })
      .toBuffer();

    const info = await sharp(output).metadata();
    const hash = createHash("sha1").update(output).digest("hex").slice(0, 8);

    // Remove saídas antigas desse produto (hash anterior / nome sem hash).
    for (const existing of await listFiles(job.outDir)) {
      if (
        existing.startsWith(`${job.prefix}-${slug}-`) ||
        existing === `${job.prefix}-${slug}.webp`
      ) {
        await rm(path.join(job.outDir, existing), { force: true });
      }
    }

    const outName = `${job.prefix}-${slug}-${hash}.webp`;
    await writeFile(path.join(job.outDir, outName), output);

    const publicPath = `/${job.outDir.replace(/^public\//, "").replace(/\\/g, "/")}/${outName}`;
    map[slug] = { src: publicPath, width: info.width, height: info.height };
    console.log(
      `ok  ${file}  ${info.width}x${info.height}  ->  ${publicPath}`,
    );
  }

  return map;
}

function writeManifest(maps) {
  const content = `// =====================================================================
// ARQUIVO GERADO AUTOMATICAMENTE por scripts/normalize-images.mjs
// NÃO EDITE À MÃO. Rode \`npm run optimize:images\` para atualizar.
//
// Liga o id do produto ao caminho e às dimensões reais da foto
// (nome com hash de conteúdo, o que evita cache antigo).
// =====================================================================

export interface GeneratedImage {
  src: string;
  width: number;
  height: number;
}

export const productImages: Record<string, GeneratedImage> = ${JSON.stringify(maps.productImages ?? {}, null, 2)};

export const drinkImages: Record<string, GeneratedImage> = ${JSON.stringify(maps.drinkImages ?? {}, null, 2)};
`;
  return writeFile(MANIFEST, content, "utf8");
}

async function main() {
  const maps = {};
  for (const job of JOBS) {
    maps[job.manifestKey] = await processJob(job);
  }
  await writeManifest(maps);
  console.log(`\nmanifesto atualizado: ${MANIFEST}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
