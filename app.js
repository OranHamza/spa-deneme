document.addEventListener('DOMContentLoaded', () => {
    fetchMenu();
});

let menuData = {};

async function fetchMenu() {
    try {
        const response = await fetch('menu.json');
        const data = await response.json();
        menuData = data.restaurant;
        initInterface();
    } catch (error) {
        console.error('Error:', error);
    }
}

function initInterface() {
    const nav = document.getElementById('category-nav');
    const container = document.getElementById('menu-container');
    
    // Kategorileri Temizle
    nav.innerHTML = '';
    
    // Kategori Butonlarını Oluştur
    menuData.menu.forEach((cat, index) => {
        const btn = document.createElement('button');
        btn.textContent = cat.category;
        btn.className = 'cat-btn';
        if(index === 0) btn.classList.add('active'); // İlkini aktif yap

        btn.onclick = () => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            displayCategory(index);
        };
        nav.appendChild(btn);
    });

    // İlk kategoriyi göster
    if(menuData.menu.length > 0) displayCategory(0);
}

function displayCategory(index) {
    const container = document.getElementById('menu-container');
    const category = menuData.menu[index];
    
    container.innerHTML = ''; // Sayfayı temizle
    container.style.opacity = '0'; // Animasyon için gizle

    category.subcategories.forEach(sub => {
        // Alt Başlık (Örn: Beef Dishes)
        const title = document.createElement('h2');
        title.className = 'subcategory-header';
        title.textContent = sub.name;
        container.appendChild(title);

        // Izgara Yapısı
        const grid = document.createElement('div');
        grid.className = 'items-grid';

        sub.items.forEach(item => {
            grid.appendChild(createCard(item, sub.name));
        });

        container.appendChild(grid);
    });

    // Fade-in animasyonu
    setTimeout(() => { container.style.opacity = '1'; container.style.transition = 'opacity 0.5s'; }, 100);
}

// Kart Oluşturma Fonksiyonu
function createCard(item, categoryName) {
    const card = document.createElement('div');
    card.className = 'menu-card';

    // FOTOĞRAF OLUŞTURMA
    // LoremFlickr kullanarak dinamik resim çekiyoruz.
    // Anahtar kelime olarak yemek isminin ilk kelimesini ve kategori ismini kullanıyoruz.
    const keyword = `${categoryName.split(' ')[0]},${item.name.split(' ')[0]}`;
    const imageUrl = `https://loremflickr.com/500/350/${keyword}/food`; 

    card.innerHTML = `
        <img src="${imageUrl}" alt="${item.name}" class="card-image" loading="lazy">
        
        <div class="card-body">
            <div class="card-top">
                <h3>${item.name}</h3>
                <span class="price">$${item.price}</span>
            </div>
            <div class="expand-icon">▼ Click for details</div>
        </div>

        <div class="card-details">
            <div class="details-content">
                <p><strong>Description:</strong> ${item.description}</p>
                <p style="margin-top:5px; color:#d35400;">
                    <i class="fas fa-fire"></i> ${item.calories} kcal
                </p>
                <p style="margin-top:5px; font-size:0.85rem; color:#777;">
                    <strong>Ingredients:</strong> ${item.ingredients.join(', ')}
                </p>
            </div>
        </div>
    `;

    // TIKLAMA OLAYI (GÖSTER/GİZLE)
    card.addEventListener('click', () => {
        // İstersen: Diğer açık olanları kapatmak için:
        // document.querySelectorAll('.menu-card.expanded').forEach(c => c !== card && c.classList.remove('expanded'));
        
        card.classList.toggle('expanded');
    });

    return card;
}
