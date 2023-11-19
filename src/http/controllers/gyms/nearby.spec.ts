import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Nearby Gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to list nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Pertinho Gym",
        description: "Some crazy gym",
        phone: "00123456789",
        latitude: -3.7397262,
        longitude: -38.5795397,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Loooonge Gym",
        description: "Some dope gym",
        phone: "00123456789",
        latitude: -4.0950464,
        longitude: -38.9363956,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -3.7397262,
        longitude: -38.5795397,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Pertinho Gym",
      }),
    ]);
  });
});
