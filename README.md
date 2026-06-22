> 🌐 **Canlı Yayın Adresi:** Bu proje freelance bir proje olup aktif olarak **[pandoracicek.com](https://pandoracicek.com/)** adresinde yayındadır. Şu anda sistem üzerinde bazı ufak entegrasyon çalışmaları ve geliştirmeler sürdürülmektedir.
 
Projede üç ana klasör bulunmaktadır. Yerel ortamda çalıştırmak için her bir ilgili dizine girerek aşağıdaki adımları takip etmeniz gerekmektedir.
 
---
 
## 📁 Klasör Yapısı
 
```
├── frontend/
├── admin/
└── api/
```
 
---
 
## 🚀 Çalıştırma Talimatları
 
### Frontend
 
```bash
cd frontend
npm install
npm run dev
```
 
### Admin
 
```bash
cd admin
npm install
npm run dev
```
 
> ⚠️ `npm install` komutu çalıştırıldıktan sonra ilgili dizinde `node_modules` klasörünün oluştuğunu doğrulayın.
 
### API
 
```bash
cd api
php -S localhost:8080
```
 
---
 
## 📌 Notlar
 
* **Frontend** ve **Admin** klasörlerinde bağımlılıkların kurulabilmesi için [Node.js](https://nodejs.org/) yüklü olmalıdır.
* **API** klasörünü çalıştırabilmek için [PHP](https://www.php.net/) yüklü olmalıdır.
* `npm install` komutu yalnızca ilk kurulumda veya `package.json` dosyası değiştiğinde çalıştırılmalıdır.
