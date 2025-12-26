declare namespace NodeJS {
  interface Process {
    pkg?: unknown;
  }
}

declare module "selenium-webdriver/common/driverFinder" {
  export function getBinaryPaths(_: any): Promise<any>;
}


