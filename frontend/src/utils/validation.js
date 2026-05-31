import * as yup from "yup";

export const passwordSchema = yup
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(16, "Password must be at most 16 characters")
  .matches(/[A-Z]/, "Must include at least one uppercase letter")
  .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must include at least one special character")
  .required("Password is required");

export const loginSchema = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const signupSchema = yup.object({
  name: yup.string().min(20, "Name must be at least 20 characters").max(60, "Name must be at most 60 characters").required("Name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  address: yup.string().max(400, "Address must be at most 400 characters").optional(),
  password: passwordSchema,
});

export const addUserSchema = yup.object({
  name: yup.string().min(20, "Min 20 characters").max(60, "Max 60 characters").required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  address: yup.string().max(400, "Max 400 characters").optional(),
  password: passwordSchema,
  role: yup.string().oneOf(["admin", "user", "store_owner"], "Invalid role").required("Role is required"),
});

export const addStoreSchema = yup.object({
  name: yup.string().min(20, "Min 20 characters").max(60, "Max 60 characters").required("Store name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  address: yup.string().max(400, "Max 400 characters").optional(),
  owner_id: yup.string().optional(),
});

export const updatePasswordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: passwordSchema,
  confirmPassword: yup.string()
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your password"),
});
