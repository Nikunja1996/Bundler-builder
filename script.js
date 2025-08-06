document.addEventListener('DOMContentLoaded', function() {
  const addButtons = document.querySelectorAll('.add-to-bundle');
  const selectedItemsContainer = document.querySelector('.selected-items');
  const itemCountElement = document.querySelector('.item-count');
  const discountElement = document.querySelector('.discount');
  const subtotalElement = document.querySelector('.summary-value:not(.discount)');
  const proceedBtn = document.querySelector('.proceed-btn');
  const progressFill = document.querySelector('.progress-fill');
  const progressText = document.querySelector('.progress-text');
  let selectedProducts = [];
  const productPrice = 150.00;
 
  
  addButtons.forEach(button => {
    button.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      const productName = productCard.querySelector('.product-name').textContent;
      const productImage = productCard.querySelector('.product-image').src;
 

      const existingIndex = selectedProducts.findIndex(item => item.name === productName);
 
      if (existingIndex >= 0) {
      
        selectedProducts.splice(existingIndex, 1);
        this.classList.remove('selected');
        this.textContent = 'Add to Bundle';
      } else {
       
        selectedProducts.push({
          name: productName,
          image: productImage,
          price: productPrice,
          quantity: 1
        });
        this.classList.add('selected');
        this.textContent = 'Added ✓';
      }
 
      updateBundleDisplay();
    });
  });
 
  
  function updateBundleDisplay() {
    selectedItemsContainer.innerHTML = '';
    const totalItems = selectedProducts.reduce((sum, item) => sum + item.quantity, 0);
 
   
    const progressPercent = Math.min((totalItems / 3) * 100, 100);
    progressFill.style.width = `${progressPercent}%`;
    progressText.textContent = `${totalItems}/3`;
 
 
    selectedProducts.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'selected-item';
      itemElement.innerHTML = `
<img src="${item.image}" alt="${item.name}">
<div class="selected-item-info">
<div class="selected-item-name">${item.name}</div>
<div class="selected-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
<div class="quantity-controls">
<button class="quantity-btn minus" data-index="${index}">-</button>
<span class="quantity">${item.quantity}</span>
<button class="quantity-btn plus" data-index="${index}">+</button>
</div>
</div>
<button class="delete-btn" data-index="${index}">🗑️</button>
      `;
      selectedItemsContainer.appendChild(itemElement);
    });
 
   
    document.querySelectorAll('.quantity-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = this.dataset.index;
        if (this.classList.contains('plus')) {
          selectedProducts[index].quantity += 1;
        } else if (this.classList.contains('minus') && selectedProducts[index].quantity > 1) {
          selectedProducts[index].quantity -= 1;
        }
        updateBundleDisplay();
      });
    });
 
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = this.dataset.index;
        const productName = selectedProducts[index].name;
    
        document.querySelectorAll('.product-card').forEach(card => {
          if (card.querySelector('.product-name').textContent === productName) {
            card.querySelector('.add-to-bundle').classList.remove('selected');
            card.querySelector('.add-to-bundle').textContent = 'Add to Bundle';
          }
        });
        selectedProducts.splice(index, 1);
        updateBundleDisplay();
      });
    });
 

    itemCountElement.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
    const subtotal = selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;
    if (totalItems >= 3) {
      discount = subtotal * 0.3;
      proceedBtn.disabled = false;
      proceedBtn.classList.add('active');
      proceedBtn.textContent = 'Proceed to Checkout';
    } else {
      proceedBtn.disabled = true;
      proceedBtn.classList.remove('active');
      proceedBtn.textContent = `Add ${3 - totalItems} More Items to Proceed`;
    }
 
    subtotalElement.textContent = `$${(subtotal - discount).toFixed(2)}`;
    discountElement.textContent = `-$${discount.toFixed(2)}`;
  }
});