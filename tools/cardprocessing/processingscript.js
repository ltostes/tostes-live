import fs from "fs";
import path from "path";
import sharp from "sharp";

const inputDir = "./cards_highres";
// const outputDir = "./output"; // for testing
const outputDir = "../frontend/public/assets/cards";

// margin size (in pixels) you want to cut off
const margin = 55;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

async function processImages() {
  const files = fs.readdirSync(inputDir);

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(
      outputDir,
      path.parse(file).name + ".webp"
    );

    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      await image
        .extract({
          left: margin,
          top: margin,
          width: metadata.width - margin * 2,
          height: metadata.height - margin * 2,
        })
        .resize(800, 800, { fit: "inside" })
        .toFormat("webp", { quality: 80 })
        .toFile(outputPath);

      console.log(`✅ Cropped + processed: ${file}`);
    } catch (err) {
      console.error(`❌ Error processing ${file}:`, err);
    }
  }
}

processImages();
