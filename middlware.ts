export { default } from "next-auth/middleware"

// This specifies which pages to protect
export const config = { matcher: ["/chat", "/chatbox"] }