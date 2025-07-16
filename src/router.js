import { createRouter, createWebHashHistory } from "vue-router";
import HomePage from "./components/pages/HomePage.vue";
import CataloguePage from "./components/pages/CataloguePage.vue";
import AboutPage from "./components/pages/AboutPage.vue";
import ShoppingCartPage from "./components/pages/ShoppingCartPage.vue";
import CheckoutPage from "./components/pages/CheckoutPage.vue";
import ContactPage from "./components/pages/ContactPage.vue";
import NewsletterPage from "./components/pages/NewsletterPage.vue";
import ProductPage from "./components/pages/ProductPage.vue";
import ProfilePage from "./components/pages/ProfilePage.vue";
import LoginPage from "./components/pages/LoginPage.vue";
import AdminPage from "./components/pages/AdminPage.vue";
import store from "./store";

const routes = [
	{ path: "/", component: HomePage },
	{ path: "/catalogue", component: CataloguePage },
	{ path: "/about", component: AboutPage },
	{ path: "/shopping-cart", component: ShoppingCartPage },
	{ path: "/checkout", component: CheckoutPage },
	{ path: "/contact", component: ContactPage },
	{ path: "/newsletter", component: NewsletterPage },
	{ path: "/products/:productId", component: ProductPage },
	{ path: "/login", component: LoginPage },
	{
		path: "/profile",
		component: ProfilePage,
		meta: { requiresAuth: true },
	},
	{
		path: "/admin",
		component: AdminPage,
		meta: { requiresAuth: true, requiresAdmin: true },
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

// Authentication guard using Vuex
router.beforeEach((to, from, next) => {
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
	const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
	const isAuthenticated = store.getters.isAuthenticated;
	const isAdmin = store.getters.isAdmin;

	if (requiresAuth && !isAuthenticated) {
		next("/login");
	} else if (requiresAdmin && !isAdmin) {
		next("/profile");
	} else {
		next();
	}
});

export default router;
