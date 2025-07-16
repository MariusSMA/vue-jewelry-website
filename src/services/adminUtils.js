import { auth } from "../firebase";
import { userService } from "./userService";

/**
 * Helper function to make current user admin
 * This should only be used during initial setup
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export const makeCurrentUserAdmin = async () => {
	try {
		const user = auth.currentUser;
		if (!user) {
			return { success: false, error: "No user is currently logged in" };
		}

		await userService.updateUserRole(user.uid, "admin");
		return { success: true, message: "User is now admin" };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

/**
 * Helper function to check if current user is admin
 * @returns {Promise<{success: boolean, isAdmin?: boolean, error?: string}>}
 */
export const checkCurrentUserAdmin = async () => {
	try {
		const user = auth.currentUser;
		if (!user) {
			return { success: false, error: "No user is currently logged in" };
		}

		const isAdmin = await userService.isUserAdmin(user.uid);
		return { success: true, isAdmin };
	} catch (error) {
		return { success: false, error: error.message };
	}
};
