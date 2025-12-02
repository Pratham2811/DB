
import {MongoClient} from "mongodb"

const client=new MongoClient('mongodb://localhost:27017/')
await client.connect();

const db=client.db("ResturantsDB");
const rescollection= db.collection('restos')
const res=[
  {
    name: "Cafe Durga",
    area: "Kothrud",
    cuisine: "Fast Food",
    rating: 4.2,
    priceRange: "₹150–₹300",
    menu: ["Cold Coffee", "Poha", "Upma"],
    phone: "9876543101",
    delivery: true,
    location: { lat: 18.5075, lng: 73.8077 },
    hours: "8 AM - 11 PM"
  },
  {
    name: "Vaishali Restaurant",
    area: "FC Road",
    cuisine: "South Indian",
    rating: 4.6,
    priceRange: "₹200–₹350",
    menu: ["Masala Dosa", "Idli", "Coffee"],
    phone: "9876543102",
    delivery: false,
    location: { lat: 18.5275, lng: 73.8419 },
    hours: "7 AM - 10 PM"
  },
  {
    name: "SP's Biryani House",
    area: "Sadashiv Peth",
    cuisine: "Biryani",
    rating: 4.4,
    priceRange: "₹300–₹600",
    menu: ["Chicken Biryani", "Mutton Biryani"],
    phone: "9876543103",
    delivery: true,
    location: { lat: 18.5161, lng: 73.8554 },
    hours: "11 AM - 11 PM"
  },
  {
    name: "Chitale Bandhu",
    area: "Deccan",
    cuisine: "Snacks",
    rating: 4.5,
    priceRange: "₹100–₹250",
    menu: ["Bakarwadi", "Kachori", "Lassi"],
    phone: "9876543104",
    delivery: true,
    location: { lat: 18.5160, lng: 73.8416 },
    hours: "9 AM - 9 PM"
  },
  {
    name: "Yana Sizzlers",
    area: "JM Road",
    cuisine: "Sizzlers",
    rating: 4.3,
    priceRange: "₹500–₹900",
    menu: ["Chicken Sizzler", "Paneer Steak"],
    phone: "9876543105",
    delivery: false,
    location: { lat: 18.5219, lng: 73.8487 },
    hours: "12 PM - 11 PM"
  },
  {
    name: "Burger King",
    area: "Viman Nagar",
    cuisine: "Fast Food",
    rating: 4.1,
    priceRange: "₹200–₹400",
    menu: ["Whopper", "Fries", "Shakes"],
    phone: "9876543106",
    delivery: true,
    location: { lat: 18.5679, lng: 73.9143 },
    hours: "11 AM - 12 AM"
  },
  {
    name: "German Bakery",
    area: "Koregaon Park",
    cuisine: "Bakery & Café",
    rating: 4.6,
    priceRange: "₹300–₹600",
    menu: ["Croissants", "Coffee", "Pasta"],
    phone: "9876543107",
    delivery: true,
    location: { lat: 18.5363, lng: 73.8876 },
    hours: "7 AM - 11 PM"
  },
  {
    name: "Blue Nile",
    area: "Camp",
    cuisine: "Mughlai",
    rating: 4.3,
    priceRange: "₹400–₹800",
    menu: ["Biryani", "Kebabs", "Falooda"],
    phone: "9876543108",
    delivery: true,
    location: { lat: 18.5169, lng: 73.8772 },
    hours: "11 AM - 11 PM"
  },
  {
    name: "Bhaucha Dhakka",
    area: "Sinhagad Road",
    cuisine: "Seafood",
    rating: 4.4,
    priceRange: "₹350–₹750",
    menu: ["Fish Thali", "Prawns Fry"],
    phone: "9876543109",
    delivery: false,
    location: { lat: 18.4555, lng: 73.8111 },
    hours: "12 PM - 10:30 PM"
  },
  {
    name: "Polka Dots",
    area: "Aundh",
    cuisine: "Continental",
    rating: 4.2,
    priceRange: "₹400–₹900",
    menu: ["Steak", "Pasta", "Pizza"],
    phone: "9876543110",
    delivery: true,
    location: { lat: 18.5596, lng: 73.8076 },
    hours: "12 PM - 11 PM"
  },
  {
    name: "Barbeque Nation",
    area: "Kalyani Nagar",
    cuisine: "Buffet",
    rating: 4.5,
    priceRange: "₹800–₹1600",
    menu: ["BBQ Grill", "Buffet", "Desserts"],
    phone: "9876543111",
    delivery: false,
    location: { lat: 18.5512, lng: 73.9008 },
    hours: "12 PM - 11 PM"
  },
  {
    name: "R Bhagat Tarachand",
    area: "Kothrud",
    cuisine: "North Indian",
    rating: 4.4,
    priceRange: "₹200–₹450",
    menu: ["Thali", "Paneer Masala"],
    phone: "9876543112",
    delivery: true,
    location: { lat: 18.5073, lng: 73.8070 },
    hours: "12 PM - 11 PM"
  },
  {
    name: "Wadeshwar",
    area: "FC Road",
    cuisine: "South Indian",
    rating: 4.6,
    priceRange: "₹200–₹350",
    menu: ["Dosa", "Uttapam", "Filter Coffee"],
    phone: "9876543113",
    delivery: true,
    location: { lat: 18.5280, lng: 73.8415 },
    hours: "7 AM - 10 PM"
  },
  {
    name: "Katakirrr Misal",
    area: "Karve Nagar",
    cuisine: "Misal Pav",
    rating: 4.7,
    priceRange: "₹120–₹200",
    menu: ["Misal Pav", "Buttermilk"],
    phone: "9876543114",
    delivery: false,
    location: { lat: 18.4860, lng: 73.8134 },
    hours: "8 AM - 10 PM"
  },
  {
    name: "Fried Chicken Junction",
    area: "Hadapsar",
    cuisine: "Fast Food",
    rating: 4.0,
    priceRange: "₹200–₹400",
    menu: ["Fried Chicken", "Popcorn Chicken"],
    phone: "9876543115",
    delivery: true,
    location: { lat: 18.5088, lng: 73.9260 },
    hours: "12 PM - 11 PM"
  },
  {
    name: "Brahma Pure Veg",
    area: "Swargate",
    cuisine: "Pure Veg",
    rating: 4.3,
    priceRange: "₹200–₹350",
    menu: ["Thali", "Paneer Handi"],
    phone: "9876543116",
    delivery: true,
    location: { lat: 18.5028, lng: 73.8621 },
    hours: "10 AM - 11 PM"
  },
  {
    name: "Tales & Spirits",
    area: "Balewadi High Street",
    cuisine: "Modern Indian",
    rating: 4.6,
    priceRange: "₹700–₹1500",
    menu: ["Tandoori Meals", "Mocktails"],
    phone: "9876543117",
    delivery: false,
    location: { lat: 18.5682, lng: 73.7798 },
    hours: "12 PM - 12 AM"
  },
  {
    name: "Cafe Peter",
    area: "Viman Nagar",
    cuisine: "Korean & Cafe",
    rating: 4.5,
    priceRange: "₹300–₹700",
    menu: ["Ramen", "Coffee", "Burgers"],
    phone: "9876543118",
    delivery: true,
    location: { lat: 18.5631, lng: 73.9128 },
    hours: "8 AM - 12 AM"
  },
  {
    name: "Fish Curry Rice",
    area: "Kondhwa",
    cuisine: "Seafood",
    rating: 4.2,
    priceRange: "₹350–₹700",
    menu: ["Fish Thali", "Prawns Curry"],
    phone: "9876543119",
    delivery: true,
    location: { lat: 18.4690, lng: 73.8874 },
    hours: "12 PM - 11 PM"
  },
  {
    name: "Little Italy",
    area: "Koregaon Park",
    cuisine: "Italian",
    rating: 4.6,
    priceRange: "₹700–₹1300",
    menu: ["Pizza", "Pasta", "Garlic Bread"],
    phone: "9876543120",
    delivery: true,
    location: { lat: 18.5360, lng: 73.8873 },
    hours: "12 PM - 11 PM"
  }
]

const insertres=await rescollection.insertMany(res)
console.log(insertres);

//droping databse

const deleteDatabase=await db.dropDatabase()
console.log(deleteDatabase);

client.close()