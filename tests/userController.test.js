import userController from "../controllers/userController.js";
import User from "../models/User.js";
import itemController from "../controllers/itemController.js";
import Item from "../models/Item.js";
import Follow from "../models/Follow.js";
import followController from "../controllers/followController.js";

jest.mock("../models/User.js");
jest.mock("../models/Item.js");
jest.mock("../models/Follow.js");

describe("loginUser()", () => {
  it("should return 404 if user not found", async () => {
    const req = {
      body: { email: "nonexistent@example.com", password: "123456" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findOne.mockResolvedValue(null);

    await userController.loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Usuário não encontrado",
    });
  });
});

describe("createUserNoUsername()", () => {
  it("should return 400 if username is missing", async () => {
    const req = {
      body: { email: "test@example.com", password: "123456" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: expect.stringContaining("username"),
    });
  });
});

describe("createUser()", () => {
  it("should return 201 if correctly created", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "123456",
        username: "tiago",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(true);
  });
});

describe("getItems()", () => {
  it("should return 200 if correctly called", async () => {
    const req = {
      query: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Item.find.mockResolvedValue([
      { id: 1, title: "Item 1", price: 10 },
      { id: 2, title: "Item 2", price: 20 },
    ]);

    await itemController.getItems(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { id: 1, title: "Item 1", price: 10 },
      { id: 2, title: "Item 2", price: 20 },
    ]);
  });
});

describe("unfollowById()", () => {
  it("should return 200 if correctly deleted", async () => {
    const req = {
      body: {
        idfollower: "681fdfed8ff84f652a0dfb01",
        idfollowed: "681fdfed8ff84f652a0dfb02",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Follow.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });

    await followController.deleteFollow(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Seguidor removido com sucesso",
    });
  });
});
