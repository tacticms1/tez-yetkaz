require('dotenv').config()
const { Restaurant, MenuItem } = require('./models/index')
const { sequelize } = require('./config/database')

const RESTAURANTS = [
  {
    id: 1,
    name: "Toshkent Oshi",
    category: "milliy",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500",
    rating: 4.9,
    reviewCount: 312,
    deliveryTime: "25-35 min",
    deliveryFee: 8000,
    minOrder: 30000,
    isOpen: true,
    tags: ["O'zbek taomlari", "Osh", "Somsa"],
    address: "Chilonzor tumani, 12-kvartal",
  },
  {
    id: 2,
    name: "Burger House",
    category: "burger",
    image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=500",
    rating: 4.7,
    reviewCount: 189,
    deliveryTime: "20-30 min",
    deliveryFee: 10000,
    minOrder: 25000,
    isOpen: true,
    tags: ["Burger", "Kartoshka", "Ichimlik"],
    address: "Yunusobod tumani, 19-kvartal",
  },
  {
    id: 3,
    name: "Pizza Corner",
    category: "pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
    rating: 4.8,
    reviewCount: 245,
    deliveryTime: "30-45 min",
    deliveryFee: 12000,
    minOrder: 35000,
    isOpen: true,
    tags: ["Pizza", "Pasta", "Dostavka"],
    address: "Mirzo Ulug'bek tumani, 5-kvartal",
  },
  {
    id: 4,
    name: "Navbahor Milliy",
    category: "milliy",
    image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500",
    rating: 4.6,
    reviewCount: 421,
    deliveryTime: "35-50 min",
    deliveryFee: 6000,
    minOrder: 40000,
    isOpen: true,
    tags: ["Lag'mon", "Manti", "Shurva"],
    address: "Shayxontohur tumani, Bozor ko'chasi",
  },
  {
    id: 5,
    name: "Sushi Garden",
    category: "sushi",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500",
    rating: 4.5,
    reviewCount: 98,
    deliveryTime: "40-55 min",
    deliveryFee: 15000,
    minOrder: 50000,
    isOpen: false,
    tags: ["Sushi", "Rolls", "Miso"],
    address: "Yakkasaroy tumani, Amir Temur ko'chasi",
  },
  {
    id: 6,
    name: "Shashlik King",
    category: "grill",
    image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500",
    rating: 4.8,
    reviewCount: 534,
    deliveryTime: "30-40 min",
    deliveryFee: 9000,
    minOrder: 45000,
    isOpen: true,
    tags: ["Shashlik", "Qovurma", "Grill"],
    address: "Sergeli tumani, 14-kvartal",
  },
  {
    id: 7,
    name: "KFC Toshkent",
    category: "fastfood",
    image: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=500",
    rating: 4.4,
    reviewCount: 667,
    deliveryTime: "15-25 min",
    deliveryFee: 11000,
    minOrder: 20000,
    isOpen: true,
    tags: ["Tovuq", "Burger", "Tez taom"],
    address: "Olmazor tumani, Metro yonida",
  },
  {
    id: 8,
    name: "Samarkand Plov",
    category: "milliy",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500",
    rating: 4.9,
    reviewCount: 789,
    deliveryTime: "20-30 min",
    deliveryFee: 7000,
    minOrder: 35000,
    isOpen: true,
    tags: ["Samarqand oshi", "Dimlama", "Non"],
    address: "Uchtepa tumani, Bozor ko'chasi 45",
  }
]

const MENU_ITEMS = {
  1: [
    { name: "Toshkent oshi (1 kg)", price: 45000, emoji: "🍲", category: "Asosiy", popular: true, time: "35 daq", desc: "An'anaviy palov: go'sht, sabzi, piyoz bilan" },
    { name: "Somsa (2 ta)", price: 18000, emoji: " dumpling ", category: "Snack", popular: true, time: "15 daq", desc: "Tandirda pishirilgan go'shtli somsa" },
    { name: "Shurva", price: 35000, emoji: "🍜", category: "Sho'rva", popular: false, time: "20 daq", desc: "Qo'y go'shti bilan qaynatilgan shurva" },
    { name: "Kabob (6 ta)", price: 55000, emoji: "🍖", category: "Grill", popular: true, time: "25 daq", desc: "Tandirda pishirilgan go'sht kabob" },
    { name: "Non (1 ta)", price: 8000, emoji: "🫓", category: "Non", popular: false, time: "10 daq", desc: "Yangi pishirilgan tandirda non" },
    { name: "Ayron (500 ml)", price: 12000, emoji: "🥛", category: "Ichimlik", popular: false, time: "5 daq", desc: "Tabiiy qatiq asosida ayron" },
  ],
  2: [
    { name: "Classic Burger", price: 38000, emoji: "🍔", category: "Burger", popular: true, time: "20 daq", desc: "Mol go'shti, salat, pomidor, sous" },
    { name: "BBQ Burger", price: 45000, emoji: "🍔", category: "Burger", popular: true, time: "20 daq", desc: "BBQ sous, bacon, pishloq bilan" },
    { name: "Chicken Burger", price: 36000, emoji: "🍗", category: "Burger", popular: false, time: "20 daq", desc: "Qovurilgan tovuq, sabzavot bilan" },
    { name: "Katta kartoshka", price: 22000, emoji: "🍟", category: "Qo'shimcha", popular: true, time: "12 daq", desc: "Oltin qovurilgan katta kartoshka" },
    { name: "Kola (0.5L)", price: 10000, emoji: "🥤", category: "Ichimlik", popular: false, time: "3 daq", desc: "Sovutilgan Coca-Cola" },
    { name: "Burger Seti", price: 65000, emoji: "🎁", category: "Set", popular: true, time: "22 daq", desc: "Classic Burger + kartoshka + kola" },
  ],
  3: [
    { name: "Margarita (32sm)", price: 55000, emoji: "🍕", category: "Pizza", popular: true, time: "35 daq", desc: "Pomidor sousi, mocarella, bazilika" },
    { name: "4 Pishloq (32sm)", price: 70000, emoji: "🍕", category: "Pizza", popular: true, time: "35 daq", desc: "To'rt xil pishloq: mocarella, cheddar, gorgonzola, parmezan" },
    { name: "Pepperoni (32sm)", price: 68000, emoji: "🍕", category: "Pizza", popular: true, time: "35 daq", desc: "Pepperoni kolbasa, mocarella, oregano" },
    { name: "Spaghetti Bolognese", price: 52000, emoji: "🍝", category: "Pasta", popular: false, time: "25 daq", desc: "Italyan pasta, mol go'sht sousi bilan" },
    { name: "Tiramisu", price: 28000, emoji: "🍰", category: "Shirinlik", popular: false, time: "10 daq", desc: "Klassik italyan deserti" },
    { name: "Lemonad", price: 15000, emoji: "🍋", category: "Ichimlik", popular: false, time: "5 daq", desc: "Limon va na'matak limonadi" },
  ],
  4: [
    { name: "Lag'mon", price: 40000, emoji: "🍜", category: "Asosiy", popular: true, time: "30 daq", desc: "Qo'lda cho'zilgan lag'mon, go'sht, sabzavot" },
    { name: "Manti (6 ta)", price: 35000, emoji: " dumpling ", category: "Asosiy", popular: true, time: "40 daq", desc: "Qo'y go'shtli an'anaviy manti" },
    { name: "Dimlama", price: 48000, emoji: "🥘", category: "Asosiy", popular: false, time: "45 daq", desc: "Sabzavot va go'sht bilan dumlab pishirilgan" },
    { name: "Sho'rva", price: 32000, emoji: "🍵", category: "Sho'rva", popular: false, time: "20 daq", desc: "Mol go'shti bilan shaffof sho'rva" },
    { name: "Chuchvara", price: 30000, emoji: " dumpling ", category: "Asosiy", popular: true, time: "35 daq", desc: "Qo'lda qiyilgan go'shtli chuchvara" },
  ],
  5: [
    { name: "Philadelphia Roll (8 ta)", price: 85000, emoji: "🍣", category: "Rolls", popular: true, time: "40 daq", desc: "Losos, krem pishloq, avokado" },
    { name: "Dragon Roll (8 ta)", price: 90000, emoji: "🍣", category: "Rolls", popular: true, time: "45 daq", desc: "Krevetka tempura, avokado, losos" },
    { name: "Miso Sho'rva", price: 25000, emoji: "🍵", category: "Sho'rva", popular: false, time: "10 daq", desc: "An'anaviy yapon miso sho'rvasi" },
    { name: "Salmon Nigiri (2 ta)", price: 45000, emoji: "🍱", category: "Nigiri", popular: false, time: "30 daq", desc: "Yangi losos, guruch, wasabi" },
  ],
  6: [
    { name: "Qo'y shashlik (6 ta)", price: 75000, emoji: "🍖", category: "Shashlik", popular: true, time: "35 daq", desc: "Qo'y go'shtidan tayyor shashlik" },
    { name: "Mol shashlik (6 ta)", price: 68000, emoji: "🥩", category: "Shashlik", popular: true, time: "35 daq", desc: "Mol go'shtidan marinadi shashlik" },
    { name: "Tovuq shashlik (6 ta)", price: 55000, emoji: "🍗", category: "Shashlik", popular: false, time: "30 daq", desc: "Tovuq filesi, asal-limon marinadi" },
    { name: "Qovurma lag'mon", price: 42000, emoji: "🍜", category: "Asosiy", popular: true, time: "25 daq", desc: "Go'sht va sabzavot bilan qovurilgan lag'mon" },
    { name: "Achiq-chuchuk salat", price: 22000, emoji: "🥗", category: "Salat", popular: false, time: "10 daq", desc: "Yangi sabzavotlar, o'tkir sous" },
  ],
  7: [
    { name: "Original Bucket (8 ta)", price: 95000, emoji: "🍗", category: "Tovuq", popular: true, time: "20 daq", desc: "8 ta qovurilgan tovuq bo'lagi" },
    { name: "Zinger Burger", price: 42000, emoji: "🍔", category: "Burger", popular: true, time: "18 daq", desc: "Qovurilgan tovuq, kabob sousi, salat" },
    { name: "Popcorn Chicken", price: 32000, emoji: "🍿", category: "Snack", popular: true, time: "15 daq", desc: "Mini tovuq bo'laklari, tatli-achchiq sous" },
    { name: "Katta Kartoshka + Kola", price: 25000, emoji: "🍟", category: "Set", popular: false, time: "10 daq", desc: "Katta kartoshka va 0.5L kola" },
  ],
  8: [
    { name: "Samarqand oshi (1 kg)", price: 50000, emoji: "🫕", category: "Asosiy", popular: true, time: "30 daq", desc: "Samarqand uslubida pishirilgan osh" },
    { name: "Dimlama (porsiya)", price: 45000, emoji: "🥘", category: "Asosiy", popular: true, time: "35 daq", desc: "Ko'p sabzavotli an'anaviy dimlama" },
    { name: "Somsa (3 ta)", price: 22000, emoji: " dumpling ", category: "Non-Somsa", popular: false, time: "15 daq", desc: "Katta tandirda pishirilgan go'shtli somsa" },
    { name: "Obi non", price: 10000, emoji: "🫓", category: "Non-Somsa", popular: false, time: "10 daq", desc: "Samarqand non: yupqa va xushbo'y" },
    { name: "Ko'k choy (1 choynak)", price: 14000, emoji: "🍵", category: "Ichimlik", popular: true, time: "5 daq", desc: "Samarqandning yashil choyi" },
  ]
}

async function seed() {
  try {
    await sequelize.sync({ force: true })
    console.log('🔄 Baza tozalandi va jadvallar yaratildi (Render Cloud)')

    for (const resData of RESTAURANTS) {
      const restaurant = await Restaurant.create({
        name: resData.name,
        category: resData.category,
        image: resData.image,
        rating: resData.rating,
        reviewCount: resData.reviewCount,
        deliveryTime: resData.deliveryTime,
        deliveryFee: resData.deliveryFee,
        minOrder: resData.minOrder,
        isOpen: resData.isOpen,
        address: resData.address,
        tags: resData.tags
      })
      
      const menu = MENU_ITEMS[resData.id] || []
      const menuWithResId = menu.map(item => ({
        ...item,
        restaurantId: restaurant.id
      }))
      
      await MenuItem.bulkCreate(menuWithResId)
      console.log(`✅ ${restaurant.name}: ${menuWithResId.length} ta taom qo'shildi`)
    }

    console.log('🚀 Render ma\'lumotlar bazasi muvaffaqiyatli to\'ldirildi!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Xatolik:', err)
    process.exit(1)
  }
}

seed()
