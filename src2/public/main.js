let allProducts = [];

const list = document.getElementById('products');
const form = document.getElementById('productForm');
const searchInput = document.getElementById('search');

function loadProducts() {
  fetch('/api/v1/products')
    .then(res => res.json())
    .then(response => {
      if (response.data && response.data.length > 0) {
        allProducts = response.data;
        renderProducts(allProducts);
      } else {
        list.innerHTML = '<li>No products found</li>';
      }
    })
    .catch(error => console.error(error));
}

function renderProducts(products) {
  list.innerHTML = '';

  if (products.length === 0) {
    list.innerHTML = '<li>No products found</li>';
    return;
  }

  products.forEach(product => {
    const li = document.createElement('li');

    li.innerHTML = `
      ${product.name} - $${product.price} (Stock: ${product.stock})
      <div>
        <button onclick="editProduct(${product.id}, '${product.name}', ${product.price}, ${product.stock})">Edit</button>
        <button onclick="deleteProduct(${product.id})">Delete</button>
      </div>
    `;

    list.appendChild(li);
  });
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const newProduct = {
    name: document.getElementById('name').value,
    description: document.getElementById('description').value,
    price: Number(document.getElementById('price').value),
    stock: Number(document.getElementById('stock').value)
  };

  fetch('/api/v1/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newProduct)
  })
    .then(res => res.json())
    .then(() => {
      form.reset();
      showToast('Product added successfully');
      loadProducts();
    })
    .catch(error => console.error(error));
});

function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  fetch(`/api/v1/products/${id}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(() => {
      showToast('Product deleted successfully');
      loadProducts();
    })
    .catch(error => console.error(error));
}

function editProduct(id, name, price, stock) {
  const newName = prompt('Edit name:', name);
  const newPrice = prompt('Edit price:', price);
  const newStock = prompt('Edit stock:', stock);

  if (!newName || !newPrice || !newStock) return;

  fetch(`/api/v1/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: newName,
      price: Number(newPrice),
      stock: Number(newStock)
    })
  })
    .then(res => res.json())
    .then(() => {
      showToast('Product updated successfully');
      loadProducts();
    })
    .catch(error => console.error(error));
}

// 🔎 Search
searchInput.addEventListener('input', function (e) {
  const keyword = e.target.value.toLowerCase();

  const filtered = allProducts.filter(product =>
    product.name.toLowerCase().includes(keyword)
  );

  renderProducts(filtered);
});

// 🔔 Toast
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

loadProducts();
