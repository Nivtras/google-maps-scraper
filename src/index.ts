import "./setupAtoms";
import { Builder, By, Key, until, WebDriver } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import * as path from "path";


interface Business {
  name: string;
  phone?: string;
  email?: string;
  website?: string;
}

const isPkg = (process as any).pkg !== undefined;

function getResourcePath(relPath: string) {
  return isPkg
    ? path.join(path.dirname(process.execPath), relPath) // pkg içinde
    : path.join(__dirname, "..", relPath); // ts-node/dev
}

async function scrapeBusinesses() {
  const chromeBinaryPath = getResourcePath("bin/chrome-linux64/chrome");
  const chromeDriverPath = getResourcePath("bin/chromedriver-linux64/chromedriver");
  
  const options = new chrome.Options().setChromeBinaryPath(chromeBinaryPath);
  options.addArguments(
  `--user-data-dir=/tmp/profile_${Date.now()}`,
  "--no-sandbox",
  "--disable-dev-shm-usage"
);

  const service = new chrome.ServiceBuilder(chromeDriverPath);

  const driver: WebDriver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .setChromeService(service)
    .build();

  await driver.manage().window().maximize();

  try {
    await driver.get("https://www.google.com/maps");

    const searchBox = await driver.wait(until.elementLocated(By.id("searchboxinput")), 10000);
    await searchBox.sendKeys("Kayseri işletmeleri", Key.RETURN);

    await driver.sleep(5000);

    const cards = await driver.findElements(By.css(".Nv2PK"));
    console.log(`Bulunan kart sayısı: ${cards.length}`);
  } finally {
    await driver.quit();
  }
}

scrapeBusinesses();
