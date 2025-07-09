<template>
	<section class="accessories">
		<div class="container">
			<p class="accessories-description gradient">Best choices</p>
			<h2 class="accessories-title">
				Popular accessories
				<span class="gradient">.</span>
			</h2>

			<!-- Loading state -->
			<div v-if="loading" class="loading">
				<p>Loading accessories...</p>
			</div>

			<!-- Error state -->
			<div v-else-if="error" class="error">
				<p>Error loading accessories: {{ error }}</p>
				<button @click="fetchProducts">Try Again</button>
			</div>

			<!-- Products display -->
			<div v-else class="accessories-cards">
				<div class="accessories-card-row">
					<div
						class="accessories-card"
						v-for="(product, index) in products.slice(0, 2)"
						:key="index"
					>
						<router-link :to="`/products/${product.id}`">
							<div class="accessories-card-img">
								<img :src="product.imageUrl" :alt="product.name" />
							</div>
							<p class="accessories-card-title">{{ product.name }}</p>
							<p class="accessories-card-price">
								<span class="gradient">£</span>
								{{
									typeof product.price === "number"
										? product.price.toFixed(2)
										: product.price
								}}
							</p>
						</router-link>
						<button
							class="add-to-cart-button"
							@click="handleAddToCart(product)"
						>
							Add to Cart
						</button>
					</div>
				</div>
				<div class="accessories-card-row">
					<div
						class="accessories-card"
						v-for="(product, index) in products.slice(2)"
						:key="index"
					>
						<router-link :to="`/products/${product.id}`">
							<div class="accessories-card-img">
								<img :src="product.imageUrl" :alt="product.name" />
							</div>
							<p class="accessories-card-title">{{ product.name }}</p>
							<p class="accessories-card-price">
								<span class="gradient">£</span>
								{{
									typeof product.price === "number"
										? product.price.toFixed(2)
										: product.price
								}}
							</p>
						</router-link>
						<button
							class="add-to-cart-button"
							@click="handleAddToCart(product)"
						>
							Add to Cart
						</button>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { productService } from "../services/productService";

export default {
	name: "AccessoriesComponent",
	setup() {
		const store = useStore();
		const loading = ref(true);
		const error = ref(null);
		const allProducts = ref([]);

		// Get products from store if they're already loaded, otherwise fetch them
		const products = computed(() => {
			const storeProducts = store.getters.allProducts;
			if (storeProducts && storeProducts.length > 0) {
				return storeProducts.slice(0, 4);
			}
			return allProducts.value.slice(0, 4);
		});

		const fetchProducts = async () => {
			try {
				loading.value = true;
				error.value = null;

				// Check if products are already in store
				const storeProducts = store.getters.allProducts;
				if (storeProducts && storeProducts.length > 0) {
					allProducts.value = storeProducts;
					loading.value = false;
					return;
				}

				// Fetch from Firebase if not in store
				const fetchedProducts = await productService.getAllProducts();
				allProducts.value = fetchedProducts;

				// Store in Vuex for other components
				store.dispatch("setProducts", fetchedProducts);
			} catch (err) {
				console.error("Error fetching products:", err);
				error.value = err.message;
			} finally {
				loading.value = false;
			}
		};

		const handleAddToCart = product => {
			store.dispatch("addToCart", product);
		};

		onMounted(() => {
			fetchProducts();
		});

		return {
			products,
			loading,
			error,
			handleAddToCart,
			fetchProducts,
		};
	},
};
</script>
