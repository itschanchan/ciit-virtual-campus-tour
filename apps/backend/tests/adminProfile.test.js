import request from "supertest";
import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";

const adminProfile = {
  id: "admin-1",
  username: "admin",
  email: "admin@ciit.edu.ph",
  role: "admin",
  isActive: true,
};

const validToken = jwt.sign(
  { sub: "admin-1", role: "admin", username: "admin" },
  process.env.JWT_SECRET || "test-secret"
);

const adminControllerState = vi.hoisted(() => ({
  profile: null,
  getMyProfile: async (_req, res) => {
    res.status(200).json(adminControllerState.profile);
  },
  getUserDetails: async (_req, res) => {
    res.status(404).json({ error: { code: 'NOT_FOUND' } });
  },
  createUser: async (_req, res) => {
    res.status(201).json({ id: 'new-admin-id' });
  },
  updateUser: async (_req, res) => {
    res.status(200).json({ id: _req.params.id });
  },
  deleteUser: async (_req, res) => {
    res.status(200).json({ message: 'Admin deleted successfully' });
  },
  changePassword: async (_req, res) => {
    res.status(200).json({ id: _req.params.id, isActive: true });
  },
  login: async (_req, res) => {
    res.status(401).json({ error: { code: 'INVALID_CREDENTIALS' } });
  },
  logout: async (_req, res) => {
    res.status(200).json({ message: 'Logout successful' });
  },
  session: async (_req, res) => {
    res.status(401).json({ error: { code: 'AUTH_REQUIRED' } });
  },
}));

vi.mock("../controllers/AdminController.js", () => ({
  default: {
    getMyProfile: (...args) => adminControllerState.getMyProfile(...args),
    getUserDetails: (...args) => adminControllerState.getUserDetails(...args),
    createUser: (...args) => adminControllerState.createUser(...args),
    updateUser: (...args) => adminControllerState.updateUser(...args),
    deleteUser: (...args) => adminControllerState.deleteUser(...args),
    changePassword: (...args) => adminControllerState.changePassword(...args),
    login: (...args) => adminControllerState.login(...args),
    logout: (...args) => adminControllerState.logout(...args),
    session: (...args) => adminControllerState.session(...args),
  },
}));

import app from "../index.js";

describe("Admin profile routes", () => {
  beforeEach(() => {
    adminControllerState.profile = null;
  });

  it("returns the authenticated admin profile", async () => {
    adminControllerState.profile = adminProfile;

    const response = await request(app)
      .get("/api/admins/me")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);

    expect(response.body).toMatchObject(adminProfile);
  });

  it("denies access without a token", async () => {
    const response = await request(app).get("/api/admins/me").expect(401);
  });
});
