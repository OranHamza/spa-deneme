document.addEventListener('DOMContentLoaded', () => {
    fetchMenu();
});

let menuData = {};
let currencySymbol = "$";

// --- GÜNCELLENMİŞ VE GENİŞLETİLMİŞ RESİM LİSTESİ ---
const categoryImages = {
    // Breakfast (Yeni)
    "Breakfast & Brunch": "https://images.unsplash.com/photo-1533089862017-5614ec420547?auto=format&fit=crop&w=500&q=80",
    
    // Starters
    "Starters & Soups": "https://images.unsplash.com/photo-1547592166-23acbe346499?auto=format&fit=crop&w=500&q=80", 
    
    // Salads
    "Salads": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80",
    
    // Asian Fusion (Yeni)
    "Asian Fusion": "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=500&q=80",

    // Main Courses
    "Main Courses": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80",
    
    // Pasta
    "Pasta & Risotto": "https://images.unsplash.com/photo-1551183053-bf91b1dca038?auto=format&fit=crop&w=500&q=80",
    
    // Pizza
    "Pizza & Flatbreads": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80",
    
    // Burgers
    "Burgers & Handhelds": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80",
    
    // Sides (Yeni)
    "Sides & Extras": "https://images.unsplash.com/photo-1534939561126-855f86654015?auto=format&fit=crop&w=500&q=80",

    // Kids
    "Kids Menu": "https://images.unsplash.com/photo-1621257620172-8d769824da6e?auto=format&fit=crop&w=500&q=80",
    
    // Desserts
    "Desserts": "https://images.unsplash.com/photo-1563729768640-341d0b933dc0?auto=format&fit=crop&w=500&q=80",
    
    // Beverages
    "Beverages": "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=500&q=80",
    
    // Fallback
    "Default": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80"
};

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

// 5. Create Individual Card (With Stable Fixed Images)
function createItemCard(item, categoryName) {
    const card = document.createElement('div');
    card.classList.add('menu-card');

    const imageUrl = categoryImages[categoryName] || categoryImages["Default"];
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
