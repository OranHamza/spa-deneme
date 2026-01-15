document.addEventListener('DOMContentLoaded', () => {
    fetchMenu();
});

let menuData = {};
let currencySymbol = "$";

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
                // Pass category to helper
                const card = createItemCard(item, category.category);
                grid.appendChild(card);
            });

            container.appendChild(grid);
        });

        container.style.opacity = '1';
        container.classList.add('fade-in');
    }, 200);
}

// 5. Create Individual Card (Unique Images Strategy)
function createItemCard(item, mainCategory) {
    const card = document.createElement('div');
    card.classList.add('menu-card');

    // --- SMART IMAGE STRATEGY ---
    // 1. We extract the numeric part of the ID (e.g., "BG-001" -> 1) to create a unique lock.
    // 2. We use the first word of the item name + main category for the search term.
    
    // Clean unique ID generation from the item.id string
    const uniqueLock = item.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Better keywords: Take the first word of the item name (e.g., "Pancake", "Burger")
    // and replace spaces with commas.
    const searchKeywords = `${item.name.split(' ')[0]},${mainCategory.split(' ')[0]},food`;
    
    // LoremFlickr with ?lock parameter ensures:
    // a) Different images for different items (due to uniqueLock)
    // b) Stable images (refreshing page keeps the same image for that item)
    const imageUrl = `https://loremflickr.com/500/400/${searchKeywords}?lock=${uniqueLock}`;

    const ingredients = item.ingredients.join(', ');

    card.innerHTML = `
        <div class="image-container">
            <img src="${imageUrl}" 
                 alt="${item.name}" 
                 class="card-image" 
                 loading="lazy"
                 onerror="this.onerror=null;this.src='https://placehold.co/500x400/2c3e50/ffffff?text=${item.name.split(' ')[0]}';">
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
