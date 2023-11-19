import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

beforeEach(() => {
  gymsRepository = new InMemoryGymsRepository();
  sut = new CreateGymUseCase(gymsRepository);
});

describe("Gyms Use Case", () => {
  it("should be able to check in", async () => {
    const { gym } = await sut.execute({
      title: "Rhani's Gym",
      description: null,
      phone: null,
      latitude: -3.7397262,
      longitude: -38.5795397,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
