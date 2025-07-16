import { createStore } from "vuex";
import { auth } from "./firebase";
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
} from "firebase/auth";
import { userService } from "./services/userService";

const store = createStore({
	state: {
		cart: {
			items: [],
		},
		auth: {
			isLoggedIn: false,
			user: null,
			isAdmin: false,
		},
		products: [],
	},
	mutations: {
		addToCart(state, product) {
			const existingItem = state.cart.items.find(
				item => item.id === product.id
			);

			if (existingItem) {
				existingItem.quantity++;
			} else {
				state.cart.items.push({ ...product, quantity: 1 });
			}
		},
		removeFromCart(state, productId) {
			const index = state.cart.items.findIndex(item => item.id === productId);
			if (index !== -1) {
				state.cart.items.splice(index, 1);
			}
		},
		setUser(state, user) {
			state.auth.user = user;
			state.auth.isLoggedIn = !!user;
		},
		setUserAdmin(state, isAdmin) {
			state.auth.isAdmin = isAdmin;
		},
		setProducts(state, products) {
			state.products = products;
		},
	},
	actions: {
		addToCart({ commit }, product) {
			commit("addToCart", product);
		},
		removeFromCart({ commit }, productId) {
			commit("removeFromCart", productId);
		},
		async login({ commit }, { email, password }) {
			try {
				const userCredential = await signInWithEmailAndPassword(
					auth,
					email,
					password
				);
				const user = userCredential.user;

				// Check if user is admin
				const isAdmin = await userService.isUserAdmin(user.uid);

				commit("setUser", user);
				commit("setUserAdmin", isAdmin);
				return { success: true };
			} catch (error) {
				return { success: false, error: error.message };
			}
		},

		async register({ commit }, { email, password }) {
			try {
				const userCredential = await createUserWithEmailAndPassword(
					auth,
					email,
					password
				);
				const user = userCredential.user;

				// Create user profile in Firestore
				await userService.createUserProfile(user.uid, {
					email: user.email,
					displayName: user.displayName || null,
				});

				// Check if user is admin (should be false for new users)
				const isAdmin = await userService.isUserAdmin(user.uid);

				commit("setUser", user);
				commit("setUserAdmin", isAdmin);
				return { success: true };
			} catch (error) {
				return { success: false, error: error.message };
			}
		},
		async logout({ commit }) {
			try {
				await signOut(auth);
				commit("setUser", null);
				commit("setUserAdmin", false);
				return { success: true };
			} catch (error) {
				return { success: false, error: error.message };
			}
		},
		initializeAuth({ commit }) {
			return new Promise(resolve => {
				onAuthStateChanged(auth, async user => {
					commit("setUser", user);
					if (user) {
						// Check if user is admin
						const isAdmin = await userService.isUserAdmin(user.uid);
						commit("setUserAdmin", isAdmin);
					} else {
						commit("setUserAdmin", false);
					}
					resolve(user);
				});
			});
		},
		setProducts({ commit }, products) {
			commit("setProducts", products);
		},
		async makeUserAdmin({ commit }, userId) {
			try {
				await userService.updateUserRole(userId, "admin");
				// If it's the current user, update the store
				const currentUser = auth.currentUser;
				if (currentUser && currentUser.uid === userId) {
					commit("setUserAdmin", true);
				}
				return { success: true };
			} catch (error) {
				return { success: false, error: error.message };
			}
		},
	},
	getters: {
		isAuthenticated: state => state.auth.isLoggedIn,
		currentUser: state => state.auth.user,
		isAdmin: state => state.auth.isAdmin,
		cartItemCount: state => {
			return state.cart.items.reduce((acc, item) => acc + item.quantity, 0);
		},
		allProducts: state => state.products,
	},
});

export default store;
