# google-maps-scraper

Google Maps'den işletme verileri çekebiliyor

## GEREKLİLİKLER

- chromedriverı indir, rardan çıkart ve bin(önce ana dizine klasörü oluştur) klasörünün içine koy

### ÇALIŞTIRMA

npx ts-node src/index.ts

### BUİLD ALMA

npx tsc src/index.ts --outDir dist

pnpm run build

pnpm start

### UYGULAMA ÇIKTISI ALMA

pkg dist/index.js --targets node16-linux-x64 --output myapp

pkg dist/index.js --targets node16-win-x64 --output myapp.exe
