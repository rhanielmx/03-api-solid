import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

beforeEach(async () => {
  gymsRepository = new InMemoryGymsRepository();
  sut = new FetchNearbyGymsUseCase(gymsRepository);
});

describe("Fetch Nearby Gyms Use Case", () => {
  it("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      latitude: -3.7397262,
      longitude: -38.5795397,
    });

    await gymsRepository.create({
      title: "Far Gym",
      description: null,
      phone: null,
      latitude: -4.0950464,
      longitude: -38.9363956,
    });

    const { gyms } = await sut.execute({
      userLatitude: -3.7397262,
      userLongitude: -38.5795397,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
