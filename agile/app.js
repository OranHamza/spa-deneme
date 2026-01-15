document.addEventListener('DOMContentLoaded', () => {
    fetchMenu();
});

let menuData = {};
let currencySymbol = "$";

// Fetch data from JSON
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
            '<div style="text-align:center; color:red;">Error loading menu data. Please check console.</div>';
    }
}

// Initialize UI
function initInterface() {
    createCategoryButtons();
    // Default to the first category
    if (menuData.menu && menuData.menu.length > 0) {
        displayCategory(0);
    }
}

// Create Navigation Buttons
function createCategoryButtons() {
    const nav = document.getElementById('category-nav');
    nav.innerHTML = '';

    menuData.menu.forEach((cat, index) => {
        const btn = document.createElement('button');
        btn.textContent = cat.category;
        btn.classList.add('cat-btn');
        
        // Add click event
        btn.addEventListener('click', () => {
            // Remove active class from all
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');
            // Render content
            displayCategory(index);
        });

        nav.appendChild(btn);
    });

    // Set first one active
    if (nav.firstChild) nav.firstChild.classList.add('active');
}

// Display Items for Selected Category
function displayCategory(index) {
    const container = document.getElementById('menu-container');
    const category = menuData.menu[index];
    
    // Clear and Animation Reset
    container.innerHTML = '';
    container.style.opacity = '0';

    setTimeout(() => {
        // Render Subcategories
        category.subcategories.forEach(sub => {
            
            // 1. Subcategory Title
            const subHeader = document.createElement('h2');
            subHeader.textContent = sub.name;
            subHeader.classList.add('subcategory-header');
            container.appendChild(subHeader);

            // 2. Grid Container for items
            const grid = document.createElement('div');
            grid.classList.add('items-grid');

            // 3. Render Items
            sub.items.forEach(item => {
                const card = createItemCard(item);
                grid.appendChild(card);
            });

            container.appendChild(grid);
        });

        // Fade In Effect
        container.style.opacity = '1';
        container.classList.add('fade-in');
    }, 200);
}

// Generate HTML for a Single Item Card
function createItemCard(item) {
    const card = document.createElement('div');
    card.classList.add('menu-card');

    const ingredients = item.ingredients.join(', ');

    card.innerHTML = `
        <div class="card-body">
            <div class="card-top">
                <h3>${item.name}</h3>
                <div class="price-tag">${currencySymbol}${item.price}</div>
            </div>
            <p class="description">${item.description}</p>
            <div class="card-footer">
                <span><i class="fas fa-fire"></i> ${item.calories} kcal</span>
                <span><i class="fas fa-utensils"></i> ${ingredients.substring(0, 30)}...</span>
            </div>
        </div>
    `;
    return card;
}