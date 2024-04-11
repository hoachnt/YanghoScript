import interpretCode from "./interpretator";
import fs from "node:fs";

try {
  const data = fs.readFileSync("./src/code.yangho", "utf8");

  interpretCode(data);
} catch (err) {
  console.error(err);
}
