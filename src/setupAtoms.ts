import Module from "module";
import path from "path";

const originalRequire = Module.prototype.require;

Module.prototype.require = function (request: string) {
  if (request.startsWith("./atoms/")) {
    // dışarıdaki atoms klasörüne yönlendir
    return originalRequire.call(
      this,
      path.join(process.cwd(), "atoms", path.basename(request))
    );
  }
  return originalRequire.call(this, request);
};
