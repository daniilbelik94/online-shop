import * as yup from "yup";

export const registerSchema = yup.object({
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    )
    .required("Username is required"),

  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),

  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])/,
      "Password must contain at least one lowercase letter"
    )
    .matches(
      /^(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter"
    )
    .matches(/^(?=.*\d)/, "Password must contain at least one number")
    .matches(
      /^(?=.*[@$!%*?&])/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),

  first_name: yup
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .required("First name is required"),

  last_name: yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .required("Last name is required"),

  phone: yup
    .string()
    .matches(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number")
    .optional(),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),

  password: yup.string().required("Password is required"),
});

export const productSchema = yup.object({
  name: yup
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(200, "Product name must be less than 200 characters")
    .required("Product name is required"),

  description: yup
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters")
    .required("Description is required"),

  price: yup
    .number()
    .positive("Price must be positive")
    .required("Price is required"),

  stock_quantity: yup
    .number()
    .integer("Stock quantity must be a whole number")
    .min(0, "Stock quantity cannot be negative")
    .required("Stock quantity is required"),

  category_id: yup.string().required("Please select a category"),
});

export const addressSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .required("Name is required"),

  street: yup
    .string()
    .min(5, "Street address must be at least 5 characters")
    .max(200, "Street address must be less than 200 characters")
    .required("Street address is required"),

  city: yup
    .string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be less than 100 characters")
    .required("City is required"),

  state: yup
    .string()
    .min(2, "State must be at least 2 characters")
    .max(100, "State must be less than 100 characters")
    .required("State is required"),

  postal_code: yup
    .string()
    .min(3, "Postal code must be at least 3 characters")
    .max(20, "Postal code must be less than 20 characters")
    .required("Postal code is required"),

  country: yup
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country must be less than 100 characters")
    .required("Country is required"),

  phone: yup
    .string()
    .matches(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number")
    .optional(),
});

export const reviewSchema = yup.object({
  rating: yup
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5")
    .required("Rating is required"),

  title: yup
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .required("Title is required"),

  comment: yup
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(1000, "Comment must be less than 1000 characters")
    .required("Comment is required"),
}); 