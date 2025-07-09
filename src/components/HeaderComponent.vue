<template>
	<header>
		<div class="container">
			<nav class="navbar">
				<router-link to="/" class="link" @click="scrollToTop">
					<img
						src="@/assets/images/logo.svg"
						alt="London Jewelry Logo"
						class="logo"
					/>
				</router-link>
				<form @submit.prevent="handleSearchSubmit" class="search-form">
					<input
						type="text"
						placeholder="Search..."
						v-model="searchTerm"
						class="search-input"
						@input="handleSearchChange"
					/>
					<button type="submit" class="search-button">
						<img
							src="@/assets/images/search-icon.svg"
							alt="Search Icon"
							class="search-icon"
						/>
					</button>
				</form>
				<ul class="links">
					<li class="link-item">
						<router-link to="/" class="link active" @click="scrollToTop">
							Home
						</router-link>
					</li>
					<li class="link-item">
						<router-link to="/catalogue" class="link" @click="scrollToTop">
							Catalogue
						</router-link>
					</li>
					<li class="link-item user-dropdown">
						<div class="user-menu" @click="toggleLoginDropdown">
							<img
								src="@/assets/images/user-icon.svg"
								alt="User Icon"
								class="user-icon"
							/>
						</div>

						<!-- User Dropdown Menu -->
						<div v-if="showLoginDropdown" class="dropdown-menu">
							<div v-if="isLoggedIn">
								<p class="user-email">{{ currentUser?.email }}</p>
								<router-link
									to="/profile"
									class="dropdown-link"
									@click="closeDropdown"
								>
									Profile
								</router-link>
								<button @click="handleLogout" class="logout-button">
									Logout
								</button>
							</div>
							<div v-else>
								<router-link
									to="/login"
									class="dropdown-link"
									@click="closeDropdown"
								>
									Login
								</router-link>
							</div>
						</div>
					</li>
					<li class="link-item">
						<router-link to="/shopping-cart" class="link" @click="scrollToTop">
							<img
								src="@/assets/images/shopping-cart.svg"
								alt="Shopping Cart Icon"
								class="shopping-cart-icon"
							/>
							<span
								class="cart-badge"
								v-if="cartItemCount > 0"
								:class="{ show: cartItemCount > 0 }"
							>
								{{ cartItemCount }}
							</span>
						</router-link>
					</li>
				</ul>
			</nav>
			<div
				class="search-results"
				ref="searchResultsRef"
				v-if="showSearchResults"
				:class="{ show: showSearchResults }"
			>
				<h2>
					Search Results
					<span class="close-search-results" @click="handleCloseSearchResults">
						X
					</span>
				</h2>
				<ul>
					<li v-for="product in searchResults" :key="product.id">
						<router-link
							:to="`/products/${product.id}`"
							@click.prevent="
								scrollToTop;
								handleCloseSearchResults;
								router.push(`/products/${product.id}`);
							"
						>
							{{ product.name }}
						</router-link>
					</li>
				</ul>
			</div>
		</div>
	</header>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { productService } from "../services/productService";

export default {
	name: "HeaderComponent",
	setup() {
		const store = useStore();
		const router = useRouter();
		const cartItems = computed(() => store.state.cart.items);
		const searchResultsRef = ref(null);
		const searchTerm = ref("");
		const searchResults = ref([]);
		const isLoggedIn = computed(() => store.getters.isAuthenticated);
		const currentUser = computed(() => store.getters.currentUser);
		const totalQuantity = computed(() =>
			cartItems.value.reduce((acc, item) => acc + item.quantity, 0)
		);
		const showLoginDropdown = ref(false);
		const showSearchResults = ref(false);
		const allProducts = ref([]);

		// Load products for search functionality
		const loadProductsForSearch = async () => {
			try {
				// Check if products are already in store
				const storeProducts = store.getters.allProducts;
				if (storeProducts && storeProducts.length > 0) {
					allProducts.value = storeProducts;
					return;
				}

				// Fetch from Firebase if not in store
				const products = await productService.getAllProducts();
				allProducts.value = products;
				store.dispatch("setProducts", products);
			} catch (error) {
				console.error("Error loading products for search:", error);
			}
		};

		onMounted(() => {
			window.scrollTo(0, 0);
			loadProductsForSearch();
		});

		const handleSearchChange = event => {
			searchTerm.value = event.target.value;

			if (searchTerm.value.trim() === "") {
				searchResults.value = [];
				showSearchResults.value = false;
				return;
			}

			// Search through Firebase products
			const foundProducts = allProducts.value.filter(
				product =>
					product.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
					product.description
						?.toLowerCase()
						.includes(searchTerm.value.toLowerCase()) ||
					product.category
						?.toLowerCase()
						.includes(searchTerm.value.toLowerCase())
			);

			searchResults.value = foundProducts;
			showSearchResults.value = true;
		};

		const handleSearchSubmit = () => {
			if (searchTerm.value.trim() === "") return;

			// Navigate to catalogue with search term
			router.push({
				path: "/catalogue",
				query: { search: searchTerm.value },
			});

			// Close search results
			handleCloseSearchResults();
		};

		const handleCloseSearchResults = () => {
			searchTerm.value = "";
			searchResults.value = [];
			showSearchResults.value = false;
		};

		const handleProductClick = productId => {
			scrollToTop();
			handleCloseSearchResults();
			router.push(`/products/${productId}`);
		};

		const toggleLoginDropdown = () => {
			showLoginDropdown.value = !showLoginDropdown.value;
		};

		const closeDropdown = () => {
			showLoginDropdown.value = false;
		};

		const handleLogout = async () => {
			try {
				const result = await store.dispatch("logout");
				if (result.success) {
					closeDropdown();
					router.push("/");
				}
			} catch (error) {
				console.error("Logout failed:", error);
			}
		};

		const scrollToTop = () => {
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		};

		const cartItemCount = computed(() => {
			return store.state.cart.items.reduce(
				(acc, item) => acc + item.quantity,
				0
			);
		});

		return {
			cartItems,
			searchResultsRef,
			searchTerm,
			searchResults,
			isLoggedIn,
			currentUser,
			totalQuantity,
			showLoginDropdown,
			showSearchResults,
			handleSearchChange,
			handleSearchSubmit,
			handleCloseSearchResults,
			toggleLoginDropdown,
			closeDropdown,
			handleLogout,
			scrollToTop,
			cartItemCount,
			router,
			handleProductClick,
		};
	},
};
</script>