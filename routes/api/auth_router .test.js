import mongoose from "mongoose";
import app from "../../app.js";
import request from "supertest";
import { User } from "../../models/User.js";
import jwt from "jsonwebtoken";

const { DB_TEST_HOST, PORT, JWT_SECRET_KEY } = process.env;

describe("test /users/register route", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(DB_TEST_HOST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  // For cleare db after testing
  /*afterEach(async () => {
    await User.deleteMany();
  })*/
  
    test("test /users/register with correctData", async () => {
      const registerData = {
        email: "testuser2@mail.com",
        password: "111user2",
      }
  
      const { body, statusCode } = await request(app).post("/users/register").send(registerData);
  
      expect(statusCode).toBe(201);
      expect(body.user.email).toBe(registerData.email);
      expect(body.user.subscription).toBe("starter");
  
      const user = await User.findOne({ email: registerData.email });
      expect(user.email).toBe(registerData.email);
    })
  
  test("test /users/login with correctData", async () => {
    const loginData = {
      email: "testuser1@mail.com",
      password: "111user1",
    }

    const { body, statusCode } = await request(app).post("/users/login").send(loginData);

    const existingUser = await User.findOne({
      email: loginData.email,
    });

    const payload = { id: existingUser._id };

    const token = jwt.sign(payload, JWT_SECRET_KEY, {
      expiresIn: "48h",
    });

    await User.findByIdAndUpdate(existingUser._id, { token });

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty("token");
    expect(body).toHaveProperty("user");
    expect(body.token).toBe(token);
    expect(body.user.email).toBe(loginData.email);
    expect(typeof body.user.email).toBe("string");
    expect(body.user.subscription).toBe("starter");
    expect(typeof body.user.subscription).toBe("string");
  })
})