import { IMiddlewareFunction } from "./interfaces/IMiddlewareFunction";
import { IOptions } from "./interfaces/IOptions";
import fs from "fs";
import handlebars from "handlebars";
import { setup_partial_helper } from "./helpers/partial";
import path from "path";

export default (settings: IOptions): IMiddlewareFunction => {
  return (filePath, options, callback): void => {
    // absolute file path.
    // console.log("File path: ", filePath);

    // options will have all properties that are passed to template.
    // console.log("Options: ", options);

    // console.log("Viwes path: ", settings.viewsPath);
    // console.log("File path: ", filePath);
    // console.log("File Directory: ", path.dirname(filePath));

    // handlebars.registerHelper("partial", (fileName) => {
    //   /**
    //    * 1. Your partial in current dir as layout: auth/partials/_header.hbs
    //    * 2. Your partial in common partials dir: views/partials/_header.hbs
    //    */

    //   // partials/hello -> /home/.../partials/_hello.hbs
    //   const basename = "_" + path.basename(fileName);
    //   const dirname = path.dirname(fileName);
    //   const templatePath = path.dirname(filePath);
    //   /**
    //    * If we have partial in same directory as our template file.
    //    * Let's say we have: views/home/_header.hbs or views/auth/partials/_header.hbs
    //    * The path1 handles it for us.
    //    */
    //   const path1 = path.join(templatePath, dirname, basename + settings.extension);

    //   /**
    //    * Let's say the partial doesn't exist in same directory as template file.
    //    * Then look for partial in common partials directory: views/partials/_header.hbs
    //    */
    //   const path2 = path.join(settings.viewsPath, "partials", dirname, basename + settings.extension);

    //   /**
    //    * Check if any of the above paths exists. If they don't then the partial doesn't exist.
    //    * In case of failure throw an error else read the file content.
    //    */

    //   let content = "";
    //   if (fs.existsSync(path1)) {
    //     content = fs.readFileSync(path1, { encoding: "utf-8" });
    //   } else if (fs.existsSync(path2)) {
    //     content = fs.readFileSync(path1, { encoding: "utf-8" });
    //   } else {
    //     throw new Error(
    //       "Partial doesn't exist. Locations checked for partials are: Path 1: " + path1 + ", Path 2: " + path2
    //     );
    //   }

    //   /**
    //    * Also pass the options for the template to the partial in case it needs to access it.
    //    */
    //   const template = handlebars.compile(content);
    //   const result = template(options);
    //   return new handlebars.SafeString(result);
    // });

    // Register partial helper for current template if any.
    setup_partial_helper({ settings, templateFilePath: filePath, templateOptions: options });

    /**
     * User has ability to choose not to display any layout. User can specify {layout: false} in options when rendering template to prevent use of layout.
     * Example: res.render("hello", {layout: false}) means don't render any layout.
     * Example res.render("hello", {layout: "custom"}) means use our /views/layouts/custom.hbs layout for this file.
     */

    const isRenderWithoutLayout = typeof (options as any).layout === "boolean" && (options as any).layout === false;
    const customLayoutName = typeof (options as any).layout === "string" && (options as any).layout;

    const render_with_layout = (layoutPath: string, templatePath: string, options: any) => {
      /**
       * Steps to process the above request.
       * 1. Read the layout(main.hbs) and template(signin.hbs) files as strings.
       * 2. Compile our template (signin.hbs) file.
       * 3. Generate processed string from template file by passing in options.
       * 4. Attach final result of generated template file on options.body
       * 5. Compile our layout(main.hbs) file
       * 6. Generate string from our layout file passing in all the options.
       * 7. Return the result of step 6.
       */

      if (!fs.existsSync(layoutPath)) throw new Error("Layout file is missing: " + layoutPath);
      if (!fs.existsSync(templatePath)) throw new Error("Template file is missing: " + layoutPath);

      // 1. Read layout and template files.
      const layoutContent = fs.readFileSync(layoutPath, { encoding: "utf-8" });
      const templateContent = fs.readFileSync(templatePath, { encoding: "utf-8" });

      // 2. Compile our template file
      // 3. Generate processed string
      const childTemplate = handlebars.compile(templateContent, options);
      const child = childTemplate(options);

      // 4. Attach final result to options
      // 5. Compile our layout file.
      /**
       * We attached the result to options.body because we will be using {{{body}}} syntax in our template file.
       */
      options.body = child;
      const parentTemplate = handlebars.compile(layoutContent);

      // 6. Compile the layout template(main.hbs)
      // 7. Return the result
      const parent = parentTemplate(options);
      return parent;
    };

    if (isRenderWithoutLayout) {
      const content = fs.readFileSync(filePath, { encoding: "utf-8" });
      const template = handlebars.compile(content);
      const result = template(options);
      if (callback) return callback(null, result);
    } else if (!!customLayoutName) {
      const layoutPath = path.join(settings.viewsPath, "layouts", customLayoutName + settings.extension);
      const result = render_with_layout(layoutPath, filePath, options);
      if (callback) return callback(null, result);
    } else {
      const layoutPath = path.join(settings.viewsPath, "layouts", settings.defaultLayout + settings.extension);
      const result = render_with_layout(layoutPath, filePath, options);
      if (callback) return callback(null, result);
    }
  };
};
