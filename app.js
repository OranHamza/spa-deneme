document.addEventListener('DOMContentLoaded', () => {
    fetchMenu();
});

let menuData = {};
let currencySymbol = "$";

// --- GÜVENİLİR FOTOĞRAF HAVUZU (Image Pool) ---
// Her kategori için elle seçilmiş, birbirinden farklı, yüksek kaliteli fotoğraf listesi.
// Sistem bunları sırasıyla dağıtarak menünün çeşitli görünmesini sağlar.
const imageLibrary = {
    "Breakfast & Brunch": [
        "https://images.unsplash.com/photo-1533089862017-5614ec420547?auto=format&fit=crop&w=500&q=80", // Pancakes
        "https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&w=500&q=80", // Toast
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=500&q=80", // Eggs
        "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=500&q=80"  // Full Plate
    ],
    "Starters & Soups": [
        "https://images.unsplash.com/photo-1547592166-23acbe346499?auto=format&fit=crop&w=500&q=80", // Soup
        "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=500&q=80", // Hummus
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80", // Fried Chicken/Calamari
        "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=500&q=80"  // Nachos
    ],
    "Salads": [
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80", // Green Salad
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=500&q=80", // Caesar
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80", // Healthy Bowl
        "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&w=500&q=80"  // Greek Salad
    ],
    "Asian Fusion": [
        "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=500&q=80", // Sushi
        "https://images.unsplash.com/photo-1580442451747-323796a79013?auto=format&fit=crop&w=500&q=80", // Rolls
        "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=500&q=80", // Noodle
        "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=500&q=80"  // Dumplings
    ],
    "Main Courses": [
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80", // Steak
        "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=500&q=80", // Salmon
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80", // Chicken
        "https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=500&q=80"  // Chops
    ],
    "Pasta & Risotto": [
        "https://images.unsplash.com/photo-1551183053-bf91b1dca038?auto=format&fit=crop&w=500&q=80", // Spaghetti
        "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=500&q=80", // Penne
        "https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?auto=format&fit=crop&w=500&q=80", // Risotto
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=500&q=80"  // Pasta
    ],
    "Pizza & Flatbreads": [
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80", // Pizza 1
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80", // Pizza 2
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=500&q=80", // Pizza 3
        "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=500&q=80"  // Pizza 4
    ],
    "Burgers & Handhelds": [
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80", // Burger 1
        "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=80", // Burger 2
        "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=500&q=80", // Burger 3
        "https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?auto=format&fit=crop&w=500&q=80"  // Sandwich
    ],
    "Sides & Extras": [
        "https://images.unsplash.com/photo-1534939561126-855f86654015?auto=format&fit=crop&w=500&q=80", // Fries
        "https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?auto=format&fit=crop&w=500&q=80", // Onion Rings
        "https://images.unsplash.com/photo-1534938665420-4193effeacc4?auto=format&fit=crop&w=500&q=80", // Veggies
        "https://images.unsplash.com/photo-1573145186634-6f366750cdd2?auto=format&fit=crop&w=500&q=80"  // Bread
    ],
    "Kids Menu": [
        "https://images.unsplash.com/photo-1621257620172-8d769824da6e?auto=format&fit=crop&w=500&q=80", // Nuggets
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80", // Mini Burger
        "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=500&q=80"  // Mac & Cheese
    ],
    "Desserts": [
        "https://images.unsplash.com/photo-1563729768640-341d0b933dc0?auto=format&fit=crop&w=500&q=80", // Choco Cake
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80", // Cheesecake
        "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=500&q=80", // Tiramisu
        "https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=500&q=80"  // Ice Cream
    ],
    "Beverages": [
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=500&q=80", // Juice
        "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80", // Mojito
        "https://images.unsplash.com/photo-1497515114629-f71d768fd61c?auto=format&fit=crop&w=500&q=80", // Coffee
        "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=500&q=80"  // Smoothie
    ]
};

const defaultImage = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80";

// 1. Fetch JSON Data
async function fetchMenu() {
    try {
        const response = await fetch('menu.json');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        menuData = data.restaurant;
        currencySymbol = menuData.currency === "USD" ? "$" : menuData.currency;

        initInterface();
    } catch (error) {
        console.error('Error fetching menu:', error);
        document.getElementById('menu-container').innerHTML = 
            '<div style="text-align:center; padding: 20px; color:red;">Error loading menu. Please check the console.</div>';
    }
}

// 2. Initialize Interface
function initInterface() {
    createCategoryButtons();
    if (menuData.menu && menuData.menu.length > 0) {
        displayCategory(0);
    }
}

// 3. Create Navigation Buttons
function createCategoryButtons() {
    const nav = document.getElementById('category-nav');
    nav.innerHTML = '';

    menuData.menu.forEach((cat, index) => {
        const btn = document.createElement('button');
        btn.textContent = cat.category;
        btn.classList.add('cat-btn');
        
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            displayCategory(index);
        });

        nav.appendChild(btn);
    });

    if (nav.firstChild) nav.firstChild.classList.add('active');
}

// 4. Display Items
function displayCategory(index) {
    const container = document.getElementById('menu-container');
    const category = menuData.menu[index];
    
    container.innerHTML = '';
    container.style.opacity = '0';

    setTimeout(() => {
        category.subcategories.forEach(sub => {
            const subHeader = document.createElement('h2');
            subHeader.textContent = sub.name;
            subHeader.classList.add('subcategory-header');
            container.appendChild(subHeader);

            const grid = document.createElement('div');
            grid.classList.add('items-grid');

            sub.items.forEach(item => {
                const card = createItemCard(item, category.category);
                grid.appendChild(card);
            });

            container.appendChild(grid);
        });

        container.style.opacity = '1';
        container.classList.add('fade-in');
    }, 200);
}

// 5. Create Individual Card (With Image Pool Logic)
function createItemCard(item, mainCategory) {
    const card = document.createElement('div');
    card.classList.add('menu-card');

    // --- STRATEJİ: HAVUZDAN SEÇME (POOL SELECTION) ---
    // 1. Kategorinin resim listesini al.
    let pool = imageLibrary[mainCategory];
    if (!pool || pool.length === 0) pool = [defaultImage];

    // 2. Ürün ID'sindeki sayıları kullanarak benzersiz bir index oluştur.
    // Örn: "BG-002" -> 2. Bu sayede o ürün hep aynı resmi alır, ama yanındaki ürün farklı resmi alır.
    const uniqueNumber = parseInt(item.id.replace(/\D/g, '')) || item.name.length;
    
    // 3. Modulo (%) işlemi ile havuzun sınırları içinde dön.
    const imageIndex = uniqueNumber % pool.length;
    const imageUrl = pool[imageIndex];

    const ingredients = item.ingredients.join(', ');

    card.innerHTML = `
        <div class="image-container">
            <img src="${imageUrl}" 
                 alt="${item.name}" 
                 class="card-image" 
                 loading="lazy">
        </div>

        <div class="card-body">
            <div class="card-top">
                <h3>${item.name}</h3>
                <span class="price">${currencySymbol}${item.price}</span>
            </div>
            
            <div class="expand-icon">
                <i class="fas fa-chevron-down"></i> Click for details
            </div>
        </div>

        <div class="card-details">
            <div class="details-content">
                <p><strong>Description:</strong> ${item.description}</p>
                <p style="margin-top: 10px; color: #d35400;">
                    <i class="fas fa-fire"></i> <strong>Calories:</strong> ${item.calories} kcal
                </p>
                <p style="margin-top: 5px; color: #555;">
                    <i class="fas fa-leaf"></i> <strong>Ingredients:</strong> ${ingredients}
                </p>
            </div>
        </div>
    `;

    card.addEventListener('click', () => {
        card.classList.toggle('expanded');
    });

    return card;
}
