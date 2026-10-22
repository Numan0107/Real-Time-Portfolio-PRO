# 🚀 Real-Time Portfolio PRO

**Real-Time Portfolio PRO**, gerçek zamanlı finansal veri akışını simülasyon ve canlı borsa entegrasyonlarıyla birleştiren, modern bir web tabanlı finans ve portföy yönetim terminalidir. 

---

## ✨ Özellikler

* **Gerçek Zamanlı Veri Akışı (Real-Time Data):** C# .NET ve SignalR altyapısı sayesinde kesintisiz anlık veri senkronizasyonu.
* **Hibrit Piyasalar:** Binance WebSocket üzerinden canlı kripto (`BTCUSDT`, `ETHUSDT`) takibi ve özel simülasyon servisiyle altın (`XAUUSD`) fiyat takibi.
* **Dinamik Grafik Görselleştirme:** Recharts kütüphanesi kullanılarak oluşturulan, yüzdesel değişim (% Change) bazlı canlı piyasa grafiği.
* **Portföy ve Alım-Satım Simülasyonu:** 100.000$ başlangıç bakiyesi ile sanal alım-satım işlemleri, anlık toplam varlık ve kâr/zarar (P/L) hesaplaması.
* **İşlem Geçmişi (Transaction History):** Gerçekleştirilen tüm alım ve satım işlemlerinin zaman damgalı detaylı dökümü.
* **Gelişmiş Tema Desteği:** Göz yormayan modern **Dark / Light Mode** (Gece/Gündüz) arayüz geçişi.
* **Görsel Geri Bildirim:** Fiyat hareketlerine duyarlı dinamik renk animasyonları (Yeşil/Kırmızı flash efektleri).

---

## 🛠️ Kullanılan Teknolojiler ve Mimari

### **Backend:**
* **C# 13 / .NET 9.0**
* **ASP.NET Core Web API**
* **SignalR** (Real-Time WebSocket Communication)

### **Frontend:**
* **React & Vite**
* **Recharts** (Data Visualization & Charts)
* **JavaScript (ES6+)**
* **CSS3 / Inline Styling & Theme Management**

---

## 📦 Kurulum ve Çalıştırma

Projeyi kendi yerel ortamınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

### 1. Depoyu Klonlayın
```bash
git clone [https://github.com/Numan0107/Real-Time-Portfolio-PRO.git](https://github.com/Numan0107/Real-Time-Portfolio-PRO.git)
