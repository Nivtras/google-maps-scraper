import { Builder, By, Key, until, WebDriver, WebElement } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";

interface Business {
  name: string;
  phone?: string;
  email?: string;
  website?: string;
}

// Elementi bekleyen yardımcı fonksiyon
async function waitAndFind(driver: WebDriver, selector: string, timeout = 5000): Promise<WebElement | null> {
  try {
    const el = await driver.wait(until.elementLocated(By.css(selector)), timeout);
    await driver.wait(until.elementIsVisible(el), timeout);
    return el;
  } catch {
    return null;
  }
}

async function scrapeKayseriBusinesses() {
  const options = new chrome.Options();
  // options.addArguments("--headless=new"); // İstersen headless açabilirsin

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

    await driver.sleep(5000); // Sonuçların gelmesi için bekle

    const results: Business[] = [];

    for (let i = 0; i < 10; i++) {
      try {
        // Kartları her turda tekrar bul (stale element hatasını engeller)
        const cards = await driver.findElements(By.css(".Nv2PK"));
        if (i >= cards.length) break;

        const card = cards[i];
        await driver.executeScript("arguments[0].scrollIntoView(true);", card);
        await driver.sleep(500);

        await card.click();
        await driver.sleep(1000); // Panelin açılmasını bekle

        // İşletme ismi
        const nameElem = await waitAndFind(driver, ".DUwDvf.lfPIob", 10000);
        if (!nameElem) {
          console.log(`⚠️ Kart ${i}: İsim bulunamadı, geçildi`);
          continue;
        }
        const name = await nameElem.getText();

        // Telefon numarası
        let phone: string | undefined;
        const phoneElem = await waitAndFind(driver, 'button[data-item-id^="phone"]', 2000);
        if (phoneElem) {
          phone = (await phoneElem.getText())
            ?.replace(//g, "")
            ?.replace(/\s+/g, " ")
            ?.trim();
        }

        // Web sitesi veya e-posta
        let email: string | undefined;
        let website: string | undefined;

        const websiteElem = await waitAndFind(driver, 'a[data-item-id^="authority"]', 2000);
        if (websiteElem) {
          const href = await websiteElem.getAttribute("href");
          if (href?.startsWith("mailto:")) {
            email = href.replace("mailto:", "");
          } else {
            website = href || undefined;
          }
        }

        results.push({ name, phone, email, website });
        console.log(`✅ ${name} eklendi`);
      } catch (err) {
        console.log(`Hata (kart ${i}):`, err);
      }
    }

    console.log("JSON çıktısı:");
    console.log(JSON.stringify(results, null, 2));

    await driver.sleep(2000);
  } finally {
    await driver.quit();
  }
}

scrapeKayseriBusinesses();
