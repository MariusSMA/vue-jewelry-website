<template>
	<section class="items">
		<div class="container">
			<!-- Loading state -->
			<div v-if="loading" class="loading">
				<p>Loading products...</p>
			</div>

			<!-- Error state -->
			<div v-else-if="error" class="error">
				<p>Error loading products: {{ error }}</p>
				<button @click="fetchProducts">Try Again</button>
			</div>

			<!-- Products display -->
			<div v-else>
				<div
					class="products"
					v-for="(category, categoryIndex) in categories"
					:key="categoryIndex"
				>
					<div class="products-header">
						<div class="products-text">
							<span class="gradient">{{ category.header.span }}</span>
							<h2>
								{{ category.header.title }}
								<span class="gradient">.</span>
							</h2>
						</div>
						<div class="products-view-more">
							<p>View more</p>
							<img
								src="@/assets/images/right-blue-arrow.svg"
								alt="Right blue arrow"
							/>
						</div>
					</div>
					<div class="products-body">
						<div
							class="product-card"
							v-for="(product, productIndex) in category.products"
							:key="productIndex"
						>
							<router-link :to="`/products/${product.id}`">
								<div class="product-card-img">
									<img :src="product.imageUrl" :alt="product.name" />
								</div>
								<p class="product-card-title">{{ product.name }}</p>
								<p class="product-card-price">
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
		</div>
	</section>
</template>

<script>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { productService } from "../services/productService";

export default {
	name: "ItemsComponent",
	setup() {
		const store = useStore();
		const loading = ref(true);
		const error = ref(null);

		const categories = ref([
			{
				header: { span: "New collection", title: "Bracelets" },
				products: [],
			},
			{
				header: { span: "Recommended", title: "Necklaces" },
				products: [],
			},
			{
				header: { span: "Popular", title: "Earrings" },
				products: [],
			},
			{
				header: { span: "New", title: "Rings" },
				products: [],
			},
		]);

		const fetchProducts = async () => {
			try {
				loading.value = true;
				error.value = null;

				// Fetch all products from Firebase
				const products = await productService.getAllProducts();

				// Store products in Vuex for other components to use
				store.dispatch("setProducts", products);

				// Categorize products
				categorizeProducts(products);
			} catch (err) {
				error.value = err.message;
			} finally {
				loading.value = false;
			}
		};

		const categorizeProducts = products => {
			// Filter products by category
			const bracelets = products.filter(
				p =>
					p.category === "bracelet" || p.name.toLowerCase().includes("bracelet")
			);
			const necklaces = products.filter(
				p =>
					p.category === "necklace" || p.name.toLowerCase().includes("necklace")
			);
			const earrings = products.filter(
				p =>
					p.category === "earring" || p.name.toLowerCase().includes("earring")
			);
			const rings = products.filter(
				p => p.category === "ring" || p.name.toLowerCase().includes("ring")
			);

			// Assign products to categories
			categories.value[0].products = bracelets.slice(0, 3);
			categories.value[1].products = necklaces.slice(0, 3);
			categories.value[2].products = earrings.slice(0, 3);
			categories.value[3].products = rings.slice(0, 3);
		};

		const handleAddToCart = product => {
			store.dispatch("addToCart", product);
		};

		onMounted(() => {
			fetchProducts();
		});

		return {
			categories,
			loading,
			error,
			handleAddToCart,
			fetchProducts,
		};
	},
};
</script>
