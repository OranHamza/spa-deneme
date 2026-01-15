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
    // Show first category by default
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
            // Remove active from all
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');
            // Show content
            displayCategory(index);
        });

        nav.appendChild(btn);
    });

    // Set first one active
    if (nav.firstChild) nav.firstChild.classList.add('active');
}

// 4. Display Items
function displayCategory(index) {
    const container = document.getElementById('menu-container');
    const category = menuData.menu[index];
    
    // Reset Container
    container.innerHTML = '';
    container.style.opacity = '0';

    setTimeout(() => {
        category.subcategories.forEach(sub => {
            
            // Subcategory Header
            const subHeader = document.createElement('h2');
            subHeader.textContent = sub.name;
            subHeader.classList.add('subcategory-header');
            container.appendChild(subHeader);

            // Grid
            const grid = document.createElement('div');
            grid.classList.add('items-grid');

            // Items
            sub.items.forEach(item => {
                const card = createItemCard(item);
                grid.appendChild(card);
            });

            container.appendChild(grid);
        });

        // Fade In
        container.style.opacity = '1';
        container.classList.add('fade-in');
    }, 200);
}

// 5. Create Individual Card (With AI Image & Accordion)
function createItemCard(item) {
    const card = document.createElement('div');
    card.classList.add('menu-card');

    // AI IMAGE GENERATION
    // We create a prompt based on the item name + "food photorealistic"
    const prompt = encodeURIComponent(item.name + " delicious food photorealistic high resolution");
    // Using Pollinations.ai (No API key needed)
    const imageUrl = `https://image.pollinations.ai/prompt/${prompt}?width=400&height=300&nologo=true&seed=${item.id}`;

    const ingredients = item.ingredients.join(', ');

    card.innerHTML = `
        <div class="image-container">
            <img src="${imageUrl}" alt="${item.name}" class="card-image" loading="lazy">
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

    // ADD CLICK EVENT TO TOGGLE DETAILS
    card.addEventListener('click', () => {
        // Toggle the 'expanded' class on THIS card
        card.classList.toggle('expanded');
    });

    return card;
}
