import handlebars from "handlebars";
import path from "path";
import fs from "fs";
import { IOptions } from "../interfaces/IOptions";

interface ISetupPartialConfig {
  templateFilePath: string;
  settings: IOptions;
  templateOptions: object;
}

export const setup_partial_helper = (config: ISetupPartialConfig) => {
  const { settings, templateOptions, templateFilePath } = config;
  handlebars.registerHelper("partial", (fileName) => {
    /**
     * 1. Your partial in current dir as layout: auth/partials/_header.hbs
     * 2. Your partial in common partials dir: views/partials/_header.hbs
     */

    // partials/hello -> /home/.../partials/_hello.hbs
    const basename = "_" + path.basename(fileName);
    const dirname = path.dirname(fileName);
    const templatePath = path.dirname(templateFilePath);
    /**
     * If we have partial in same directory as our template file.
     * Let's say we have: views/home/_header.hbs or views/auth/partials/_header.hbs
     * The path1 handles it for us.
     */
    const path1 = path.join(templatePath, dirname, basename + settings.extension);

    /**
     * Let's say the partial doesn't exist in same directory as template file.
     * Then look for partial in common partials directory: views/partials/_header.hbs
     */
    const path2 = path.join(settings.viewsPath, "partials", dirname, basename + settings.extension);

    /**
     * Check if any of the above paths exists. If they don't then the partial doesn't exist.
     * In case of failure throw an error else read the file content.
     */

    let content = "";
    if (fs.existsSync(path1)) {
      content = fs.readFileSync(path1, { encoding: "utf-8" });
    } else if (fs.existsSync(path2)) {
      content = fs.readFileSync(path2, { encoding: "utf-8" });
    } else {
      throw new Error(
        "Partial doesn't exist. Locations checked for partials are: Path 1: " + path1 + ", Path 2: " + path2
      );
    }

    /**
     * Also pass the options for the template to the partial in case it needs to access it.
     */
    const template = handlebars.compile(content);
    // Compile the template by passing all options as received in layout.
    const result = template(templateOptions);
    return new handlebars.SafeString(result);
  });
};
