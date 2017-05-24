window.onload = function() {

  const client = ShopifyBuy.buildClient({
    accessToken: 'b9440f0799b22ef385fe789fa6a9fff0',
    domain: 'badgrape-design.myshopify.com',
    appId: '6'
  });

  client.fetchProduct('10648433998')
		.then(function(product) {
    	console.log(product); // debugging

			/********************
			 *	Product display	*
			 ********************/

			var item = document.createElement('div');
			item.id = 'product-1';
			item.className = 'product';

			var data = {}; // object to store product markup

			// Product title
			data.title = document.createElement('h1');
			data.title.className = 'product-title';
			data.title.innerHTML = product.title;

			// Variant image
			data.image = document.createElement('img');
			data.image.className = 'product-image';
			data.image.setAttribute('src', product.selectedVariantImage.src);

			// Product variant select lists
			data.selects = document.createElement('div');
			data.selects.className = 'variants';

			product.options.forEach(function(variant) {
				data.selects.innerHTML = variant.name + ": ";

				var list = document.createElement('select');
				list.setAttribute('name', variant.name);

				variant.values.forEach(function(value) {
					var option = document.createElement('option');
					option.setAttribute('value', value);
					option.innerHTML = value;
					list.appendChild(option);
				});

				data.selects.appendChild(list);
			});

			// Variant price
			data.variantPrice = document.createElement('div');
			data.variantPrice.className = 'variant-price';
			data.variantPrice.innerHTML = product.selectedVariant.formattedPrice;


			// Buy button link
			data.buy = document.createElement('button');
			data.buy.className = 'product-buy';
			data.buy.innerHTML = 'Add to Cart';

			// Add all elements to product div
			for (var key in data) {
				item.appendChild(data[key]);
			}
			// Add product to document body
			document.getElementById('products').appendChild(item);

			// Debugging
			console.log(item);
			console.log(data);

			// Event listeners

			// Select product variant
			var select = document.getElementsByTagName('select');
			for (var x in select) {
				select[x].onchange = function() {
					changeVariant(product);
				}
			}

			/******************
			 *	Shopping cart	*
			 ******************/

			client.createCart().then(function(cart) {
				var buyButton = document.getElementsByClassName('product-buy');
				for (var x in buyButton) {
					buyButton[x].onclick = function() {
						cart.createLineItemsFromVariants({variant: product.selectedVariant, quantity: 1})
							.then(function(cart) {
								console.log(cart) // debugging

								document.getElementById('cart-debug').innerHTML = cart.checkoutUrl;
							});
					}
				}
			});

		});

		// Change display info depending on variant selected

		function changeVariant(product) {
			var element = event.target;

			product.options.filter(function(option) {
				return option.name === element.name;
			})[0].selected = element.value;

			var price = document.getElementsByClassName('variant-price')[0];
			price.innerHTML = product.selectedVariant.formattedPrice;

			// To do: update variant image

			// Debugging
			console.log(product.selectedVariant.title + ": "
				+ product.selectedVariant.formattedPrice + ": "
				+ product.selectedVariantImage.src
			);
		}

 }

