# Proje Kurulum ve Çalıştırma Kılavuzu

Projede üç klasör bulunmaktadır. Her birini çalıştırmak için ilgili dizine girmek gerekmektedir.

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

- **Frontend** ve **Admin** klasörlerinde bağımlılıkların kurulabilmesi için [Node.js](https://nodejs.org/) yüklü olmalıdır.
- **API** klasörünü çalıştırabilmek için [PHP](https://www.php.net/) yüklü olmalıdır.
- `npm install` komutu yalnızca ilk kurulumda veya `package.json` değiştiğinde çalıştırılması yeterlidir.