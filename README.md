# 🛵 TezYetkaz — Ovqat Yetkazib Berish Platformasi

> **BTEC HND Unit 6 — Cloud Networking (Learning Aim A, B, C, D)**  
> Amaliy dalil loyihasi | Ibrohim | Guruh 24-412

## 📋 Loyiha haqida

TezYetkaz — Toshkent bo'ylab ovqat yetkazib berish veb-platformasi.  
Bu loyiha bulutli tarmoq texnologiyalarini amalda namoyish etadi:

| BTEC Kriteriy | Qaysi qism |
|---------------|-----------|
| A.P1, A.M1, A.D1 | Cloud arxitektura (VPC, Subnet, Security Groups) |
| A.P2 | Load Balancer orqali tarmoq aloqasi |
| B.P3, B.P4, B.M2 | Docker konteynerlar + remote API xizmatlari |
| C.P5, C.P6, C.M3 | Nginx LB dizayni va amalga oshirish |
| D.P7, D.P8, D.M4 | CI/CD pipeline + Auto-scaling |

## 🛠 Texnologiyalar

| Layer | Texnologiya |
|-------|-------------|
| Frontend | React 18 + Vite + React Router |
| Backend | Node.js + Express.js |
| Database | PostgreSQL + Sequelize ORM |
| Container | Docker + Docker Compose |
| Load Balancer | Nginx (Round-Robin) |
| CI/CD | GitHub Actions |
| Cloud | AWS EC2 + RDS (yoki Render/Railway) |

## 🚀 Lokal ishga tushirish

```bash
# 1. Klonlash
git clone https://github.com/your-username/tez-yetkaz.git
cd tez-yetkaz

# 2. .env fayl yaratish
cp .env.example .env

# 3. Docker Compose bilan ishga tushirish
docker-compose up --build

# 4. Brauzerda ochish
open http://localhost
```

## 📁 Fayl tuzilmasi

```
tez-yetkaz/
├── frontend/          ← React + Vite
├── backend/           ← Node.js + Express
├── nginx/nginx.conf   ← Load Balancer konfiguratsiya
├── .github/workflows/ ← CI/CD pipeline
├── docker-compose.yml ← Barcha xizmatlar
└── .env.example       ← Muhit o'zgaruvchilari
```

## 🌐 Cloud Arxitektura

```
Internet
    ↓
Internet Gateway (AWS IGW)
    ↓
[PUBLIC SUBNET 10.0.1.0/24]
    Nginx Load Balancer (Round-Robin)
    ↓         ↓
[PRIVATE SUBNET 10.0.2.0/24]
  Backend-1  Backend-2  (Node.js)
    ↓
[DB SUBNET 10.0.3.0/24]
  PostgreSQL RDS
    ↓
NAT Gateway (outbound internet)
```

## 🔄 CI/CD Pipeline

```
GitHub Push (main) 
    → GitHub Actions trigger
    → npm test
    → Docker build (frontend + backend)
    → Push to DockerHub
    → SSH to AWS EC2
    → docker-compose up -d
    → Health check ✅
```

## 📊 Sahifalar

| Sahifa | URL | Tavsif |
|--------|-----|--------|
| Bosh sahifa | `/` | Restoranlar, qidiruv, kategoriya |
| Restoran | `/restoran/:id` | Menyu, savatchaga qo'shish |
| Savat | `/savat` | Buyurtma rasmiylash |
| Buyurtmalar | `/buyurtmalar` | Holat kuzatish |
| Admin | `/admin` | Statistika, Cloud monitoring, CI/CD |

## 👨‍💻 Muallif

**Ibrohim** | 24-412 guruh | BTEC HND Digital Technologies  
Instructor: Umar Adxamov
