import { Builder, By, Key, until } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";

async function listKayseriBusinesses() {
  const options = new chrome.Options();
  // options.addArguments("--headless=new"); // Tarayıcıyı görünmez yapmak için açabilirsin

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    // 1. Google Maps'i aç
    await driver.get("https://www.google.com/maps");

    // 2. Arama kutusunu bul ve "Kayseri işletmeleri" yaz
    const searchBox = await driver.wait(
      until.elementLocated(By.id("searchboxinput")),
      10000
    );
    await searchBox.sendKeys("Kayseri işletmeleri", Key.RETURN);

    // 3. Sonuçlar yüklenmesini bekle
    await driver.sleep(5000); // Daha dinamik beklemek istersen until.elementLocated kullanabilirsin

    // 4. Sol paneldeki işletme isimlerini al
    const businessElements = await driver.findElements(By.css(".qBF1Pd.fontHeadlineSmall"));

    const businessNames: string[] = [];
    for (let element of businessElements) {
      const name = await element.getText();
      businessNames.push(name);
    }

    console.log("Kayseri'deki ilk işletmeler:");
    console.log(businessNames);

    // Tarayıcıyı açık tutmak için beklet
    await driver.sleep(10000);
  } finally {
    // await driver.quit(); // işin bitince kapatabilirsin
  }
}

listKayseriBusinesses();
