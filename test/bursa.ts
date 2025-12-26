import { Builder, By, Key, until, WebDriver } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";

interface Business {
  name: string;
  phone?: string;
  email?: string;
  website?: string;
}

async function scrapeKayseriBusinesses() {
  const options = new chrome.Options();
  // options.addArguments("--headless=new");

  const driver: WebDriver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();


  await driver.manage().window().maximize();

  try {
    await driver.get("https://www.google.com/maps");

    const searchBox = await driver.wait(
      until.elementLocated(By.id("searchboxinput")),
      10000
    );
    await searchBox.sendKeys("Kayseri işletmeleri", Key.RETURN);

    await driver.sleep(5000); // sonuçlar yüklensin

    const results: Business[] = [];

    // 10 kart ile sınırla (çok fazla olursa Google engelleyebilir)
    for (let i = 0; i < 10; i++) {
      try {
        // Kartları her seferinde yeniden bul
        const cards = await driver.findElements(By.css(".Nv2PK"));
        if (i >= cards.length) break;

        const card = cards[i];
        await driver.executeScript("arguments[0].scrollIntoView(true);", card);
        await driver.sleep(500);

        await card.click();

        // İşletme ismini bekle
        const nameElem = await driver.wait(
          until.elementLocated(By.css(".DUwDvf.lfPIob")),
          10000
        );
        const name = await nameElem.getText();

        // Telefon numarası
        let phone: string | undefined;
      
        const phoneElem = await driver.findElement(
        By.css('button[data-item-id^="phone"]')
        );
        phone = await phoneElem.getText();

        // Telefonu temizle
        phone = phone
          ?.replace(//g, "") // İkonu kaldır
          ?.replace(/\s+/g, " ") // Fazla boşlukları tek boşluk yap
          ?.trim();
      
        

        // E-posta (genelde yok)
        let email: string | undefined;
        let website: string | undefined;

        const websiteElem = await driver.findElement(
          By.css('a[data-item-id^="authority"]')
        );
        const href = await websiteElem.getAttribute("href");
        if (href?.startsWith("mailto:")) {
          email = href.replace("mailto:", "");
        }else{
          website = href
        }
        

        results.push({ name, phone, email });
        console.log(`✅ ${name} eklendi`);

        await driver.sleep(1000);
      } catch (err) {
        console.log(`Hata (kart ${i}):`, err);
      }
    }

    console.log("JSON çıktısı:");
    console.log(JSON.stringify(results, null, 2));
    await driver.sleep(5000);
  } finally {
    await driver.quit();
  }
}

scrapeKayseriBusinesses();
