<template>
	<section class="product-page">
		<div class="container">
			<!-- Loading state -->
			<div v-if="loading" class="loading">
				<p>Loading product...</p>
			</div>

			<!-- Error state -->
			<div v-else-if="error" class="error">
				<p>{{ error }}</p>
				<router-link to="/" class="btn-home">Go Home</router-link>
			</div>

			<!-- Product display -->
			<div v-else-if="product" class="product-card">
				<div class="product-details">
					<img
						:src="product.imageUrl"
						:alt="product.name"
						class="product-image"
					/>
					<h2>{{ product.name }}</h2>
					<p class="product-price">
						£{{
							typeof product.price === "number"
								? product.price.toFixed(2)
								: product.price
						}}
					</p>
					<p class="product-description">{{ product.description }}</p>
				</div>
				<div class="add-to-cart">
					<button class="add-to-cart-button" @click="handleAddToCart(product)">
						Add to Cart
					</button>
					<button class="buy-now-button" @click="handleBuyNow">Buy Now</button>
				</div>
			</div>

			<div v-else class="not-found">
				<p>Product not found</p>
				<router-link to="/" class="btn-home">Go Home</router-link>
			</div>
		</div>
	</section>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { productService } from "../../services/productService";

export default {
	name: "ProductPage",
	setup() {
		const router = useRouter();
		const store = useStore();
		const product = ref(null);
		const loading = ref(true);
		const error = ref(null);

		const productId = router.currentRoute.value.params.productId;

		const fetchProduct = async () => {
			try {
				loading.value = true;
				error.value = null;

				// Fetch product from Firebase
				const foundProduct = await productService.getProductById(productId);

				if (foundProduct) {
					product.value = foundProduct;
				} else {
					error.value = "Product not found";
				}
			} catch (err) {
				console.error("Error fetching product:", err);
				error.value = "Error loading product. Please try again.";
			} finally {
				loading.value = false;
			}
		};

		const handleAddToCart = product => {
			store.dispatch("addToCart", product);
		};

		const handleBuyNow = () => {
			handleAddToCart(product.value);
			router.push("/shopping-cart");
		};

		onMounted(() => {
			fetchProduct();
		});

		return {
			product,
			loading,
			error,
			handleAddToCart,
			handleBuyNow,
		};
	},
};
</script>

<style scoped>
.loading,
.error,
.not-found {
	text-align: center;
	padding: 40px;
	color: #666;
}

.error,
.not-found {
	color: #dc3545;
}

.btn-home {
	background: #007bff;
	color: white;
	padding: 10px 20px;
	text-decoration: none;
	border-radius: 4px;
	display: inline-block;
	margin-top: 10px;
}

.btn-home:hover {
	background: #0056b3;
}

</style>
