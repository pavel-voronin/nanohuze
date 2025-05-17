import { readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "../data");

export default () => {
  const files = readdirSync(DATA_DIR);

  const grouped = {};

  for (const filename of files) {
    const match = filename.match(/^(.+?)\.(post|comments|date)$/);
    if (!match) continue;

    const [, id, type] = match;
    const fullPath = join(DATA_DIR, filename);
    const content = readFileSync(fullPath, "utf-8");

    if (!grouped[id]) grouped[id] = { id };

    switch (type) {
      case "post": {
        const [title, ...rest] = content.trim().split("\n");
        grouped[id].title = title.trim();
        grouped[id].content = rest.join("\n").trim();
        break;
      }
      case "comments": {
        grouped[id].comments = content
          .split("\n")
          .map((line) => {
            if (!line.startsWith("+")) return null;
            const parts = line.slice(1).split("||");
            if (parts.length < 7) return null;
            return {
              name: parts[1].trim(),
              timestamp: new Date(parseInt(parts[5].trim()) * 1000),
              content: parts[6].trim(),
            };
          })
          .filter(Boolean);
        break;
      }
      case "date": {
        grouped[id].date = new Date(parseInt(content.trim() * 1000));
        break;
      }
    }
  }

  return Object.values(grouped);
};
