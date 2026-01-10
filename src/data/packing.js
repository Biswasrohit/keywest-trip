export const packingCategories = [
  {
    id: "backpack",
    name: "In Your 20L Backpack (personal item)",
    emoji: "🎒",
    items: [
      { id: "switch", name: "Nintendo Switch + charger", quantity: 1 },
      { id: "phone-charger", name: "Phone charger", quantity: 1 },
      { id: "power-bank", name: "Portable power bank", quantity: 1 },
      { id: "sunglasses", name: "Sunglasses", quantity: 1 },
      { id: "sunscreen-travel", name: "Sunscreen travel-size", quantity: 1 },
      { id: "medications", name: "Medications (5 days worth)", quantity: 1 },
      { id: "wallet", name: "Wallet with ID, credit cards, $100-150 cash", quantity: 1 },
      { id: "headphones", name: "Headphones", quantity: 1 },
      { id: "water-bottle", name: "Reusable water bottle (empty for TSA)", quantity: 1 },
      { id: "phone-case", name: "Waterproof phone case", quantity: 1 },
      { id: "toiletry-bag", name: "Small toiletry bag with essentials", quantity: 1 },
      { id: "change-clothes", name: "1 change of clothes (backup)", quantity: 1 },
    ]
  },
  {
    id: "shoes",
    name: "Shoes (wear one, pack two)",
    emoji: "👟",
    items: [
      { id: "sneakers", name: "Sneakers (wear on plane)", quantity: 1 },
      { id: "birkenstocks", name: "Birkenstocks", quantity: 1 },
      { id: "dress-shoes", name: "Dress shoes", quantity: 1 },
    ]
  },
  {
    id: "clothing",
    name: "Clothing",
    emoji: "👕",
    items: [
      { id: "tshirts", name: "T-shirts/casual shirts", quantity: 3 },
      { id: "tank-tops", name: "Tank tops", quantity: 2 },
      { id: "shorts", name: "Regular shorts", quantity: 2 },
      { id: "swim-trunks", name: "Swim trunks", quantity: 2 },
      { id: "nice-pants", name: "Nice pants/chinos for dinner", quantity: 1 },
      { id: "nice-shirt", name: "Nice button-up or polo shirt", quantity: 1 },
      { id: "long-sleeve", name: "Lightweight long sleeve shirt", quantity: 1 },
      { id: "underwear", name: "Underwear", quantity: 4 },
      { id: "socks", name: "Socks (if needed for sneakers)", quantity: 4 },
      { id: "sleepwear", name: "Sleepwear (or sleep in shorts)", quantity: 3 },
      { id: "hat", name: "Hat", quantity: 1 },
    ]
  },
  {
    id: "beach",
    name: "Beach & Water",
    emoji: "🏖️",
    items: [
      { id: "towel", name: "Quick-dry microfiber towel", quantity: 1 },
      { id: "snorkel", name: "Snorkel mask (if compact)", quantity: 1 },
    ]
  },
  {
    id: "toiletries",
    name: "Toiletries (travel-size, 3.4oz or less)",
    emoji: "🧴",
    items: [
      { id: "toothbrush", name: "Toothbrush + toothpaste", quantity: 1 },
      { id: "deodorant", name: "Deodorant", quantity: 1 },
      { id: "shampoo", name: "Shampoo/body wash", quantity: 1 },
      { id: "razor", name: "Razor", quantity: 1 },
      { id: "sunscreen-large", name: "Sunscreen (larger bottle)", quantity: 1 },
      { id: "aloe", name: "Aloe vera travel-size", quantity: 1 },
      { id: "insect-repellent", name: "Insect repellent travel-size", quantity: 1 },
    ]
  }
];

// Get all packing item IDs
export const getAllPackingItemIds = () => {
  return packingCategories.flatMap(category =>
    category.items.map(item => item.id)
  );
};

// Get total item count
export const getTotalItemCount = () => {
  return packingCategories.reduce((sum, category) => sum + category.items.length, 0);
};
