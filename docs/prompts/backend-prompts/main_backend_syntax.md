# Backend `index.js` code syntax

Read and analyze this document, then check if the [[index.js]] in the `backend\` folder applies this principles in ExpressJS handshake. If the other code blocks in this file is at [[db.js]] or [[env.js]] then connect these other two files to the main index backend file. Here's the sample code below:

```js
// hello from express - comment
import express from "express";
import connectDB from "./config/db.js";
import { successResponse } from "../../shared/types/api-response.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";

// Middlewares
import verifyToken from "./middleware/verifyToken.js";
import { requireRole } from "./middleware/authorize.js";

// Routers
import userRouter from "./routes/UserRoute.js";
import gamesRouter from "./routes/GamesRoute.js";
import authRouter from "./routes/AuthRoute.js";
import reviewRouter from "./routes/ReviewRoute.js";
import reviewController from "./controllers/ReviewController.js";
import rawgRouter from "./routes/RawgRoute.js";
import authorApplicationRouter from "./routes/AuthorApplicationRoute.js";
import favoriteRouter from "./routes/FavoriteRoute.js";
import panelRouter from "./routes/PanelRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const cors = require("cors"); // creates an instance of the cors package.
const app = express(); // creates an instance of the app

app.use(express.json()); // middleware to parse JSON bodies
app.use(cookieParser()); // extracts cookies to readable key-value pairs. Decodes incoming HTTP requests

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// client-server white listing
app.use(
  cors({
    // Vite dev server
    origin: "http://localhost:5173", // Replace with your actual frontend URL (don't use asterisk)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true, // allow cookies to be sent
  }),
);

// API ROUTES
// this creates collection in the MongoDB database.
app.use("/api/users", userRouter); // use the userRoute for all /api/users endpoints
app.use("/api/games/review", reviewRouter); // must be before /api/games so /review is not treated as :id
app.use("/api/games", gamesRouter); // use the gamesRoute for all /api/games endpoints
app.use("/api/auth", authRouter);
app.use("/api/rawg", rawgRouter);
app.use("/api/author-applications", authorApplicationRouter);
app.use("/api/favorites", favoriteRouter);
app.use("/api/panels", panelRouter);
app.get(
  "/api/reviews/my-reviews",
  verifyToken,
  requireRole("author"),
  reviewController.getMyReviews,
);
app.get("/api/users", (req, res) => {
  res.json({ message: "Success" });
});

const PORT = process.env.PORT || 3000;

// Only start the server when this file is run directly (not during tests)
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log("Hello Express.");

    if (!process.env.RAWG_API_KEY) {
      console.warn(
        "Warning: RAWG_API_KEY is not set in environment. RAWG API integration will not work.",
      );
    } else {
      console.log("RAWG_API_KEY loaded successfully.");
    }

    connectDB();
  });
}

export default app;

// () => {} callback function

// endpoints
// get method - getting values from a resource
// first argument: url
// http://localhost:3000/welcome
// async - to run in parallel
// req - input/payload from frontend
// res - response from backend
app.get("/welcome", async (req, res) => {
  res.status(200).json(successResponse({ message: "Handshake from express." }));
});

// User Schema Plan
// id  int
// username string
// email string
// password string
// first_name string
// last_name string
// date_of_birth date
// contact string (use string because numbers are not used for calculations)
// address string
// role string ['admin', 'moderator', 'user'] // enums
// is_active bool
// created_at timestamp
// updated_at timestamp

// User Endpoint
// Get User Details GET(parameter)
// Create User POST
// Update User PUT
// Delete User DELETE
// Change Password PATCH
```