'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

// Create a context for the app state
export const AppContext = createContext();

// Custom hook to access the app context
export const useAppContext = () => {
    return useContext(AppContext);
};

// Context Provider component to wrap around the application
export const AppContextProvider = (props) => {
    // Retrieve currency setting from environment variables
    const currency = process.env.NEXT_PUBLIC_CURRENCY;
    const router = useRouter();

    // Authentication hooks from Clerk
    const { user } = useUser();
    const { getToken } = useAuth();

    // State variables for managing data
    const [products, setProducts] = useState([]); // Store product list
    const [userData, setUserData] = useState(null); // Store user information
    const [isSeller, setIsSeller] = useState(false); // Track if the user is a seller
    const [cartItems, setCartItems] = useState({}); // Store cart items as an object { itemId: quantity }

    /**
     * Fetches product data (dummy data in this case) and updates state.
     */
    const fetchProductData = async () => {
        setProducts(productsDummyData);
    };

    /**
     * Fetches user data from the API and updates state.
     * Also checks if the user is a seller and retrieves cart items.
     */
    const fetchUserData = async () => {
        try {
            if (!user?.id) return; // Ensure user is authenticated before fetching data

            // Check if the user is a seller
            if (user?.publicMetadata?.role === "seller") {
                setIsSeller(true);
            }

            // Get authentication token
            const token = await getToken();
            if (!token) {
                throw new Error("Authentication token not found");
            }

            // Make an API request to fetch user data
            const { data } = await axios.get("/api/user/data", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                setUserData(data.user); // Store user data
                setCartItems(data.user.cartItems || {}); // Store cart items, ensuring it's always an object
            } else {
                toast.error(data.message); // Show error toast if API response is unsuccessful
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message); // Show error toast if request fails
        }
    };

    /**
     * Adds an item to the cart. If the item is already in the cart, it increases the quantity.
     * @param {string} itemId - The ID of the item to add.
     */
    const addToCart = (itemId) => {
        setCartItems((prevCart) => {
            const newCart = { ...prevCart };
            newCart[itemId] = (newCart[itemId] || 0) + 1; // Increase quantity if exists, else set to 1
            return newCart;
        });
    };

    /**
     * Updates the quantity of an item in the cart.
     * If quantity is 0, the item is removed from the cart.
     * @param {string} itemId - The ID of the item to update.
     * @param {number} quantity - The new quantity of the item.
     */
    const updateCartQuantity = (itemId, quantity) => {
        setCartItems((prevCart) => {
            const newCart = { ...prevCart };
            if (quantity === 0) {
                delete newCart[itemId]; // Remove item from cart if quantity is 0
            } else {
                newCart[itemId] = quantity; // Update quantity
            }
            return newCart;
        });
    };

    /**
     * Calculates the total number of items in the cart.
     * @returns {number} - The total quantity of all items in the cart.
     */
    const getCartCount = () => {
        return Object.values(cartItems).reduce((sum, count) => sum + count, 0);
    };

    /**
     * Calculates the total price of items in the cart.
     * @returns {number} - The total cart amount.
     */
    const getCartAmount = () => {
        return Object.entries(cartItems).reduce((total, [itemId, count]) => {
            const itemInfo = products.find((product) => product._id === itemId);
            return total + (itemInfo?.offerPrice || 0) * count; // Multiply price by quantity, default to 0 if item not found
        }, 0);
    };

    /**
     * Fetch product data when the component mounts.
     */
    useEffect(() => {
        fetchProductData();
    }, []);

    /**
     * Fetch user data when the user is authenticated.
     */
    useEffect(() => {
        if (user?.id) {
            fetchUserData();
        }
    }, [user]);

    // Context value that will be available to all components
    const value = {
        user,           // Authenticated user object
        getToken,       // Function to get authentication token
        currency,       // Currency setting
        router,         // Next.js router
        isSeller,       // Boolean flag for seller status
        setIsSeller,    // Function to update seller status
        userData,       // User data object
        fetchUserData,  // Function to fetch user data
        products,       // List of products
        fetchProductData, // Function to fetch product data
        cartItems,      // Cart items object { itemId: quantity }
        setCartItems,   // Function to update cart items
        addToCart,      // Function to add an item to the cart
        updateCartQuantity, // Function to update cart item quantity
        getCartCount,   // Function to get the total number of items in the cart
        getCartAmount,  // Function to get the total cart price
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
