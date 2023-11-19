import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-checkins-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

beforeEach(async () => {
  checkInsRepository = new InMemoryCheckInsRepository();
  gymsRepository = new InMemoryGymsRepository();
  sut = new CheckInUseCase(checkInsRepository, gymsRepository);

  await gymsRepository.create({
    id: "gym-01",
    title: "Rhani's Gym",
    description: "",
    phone: "",
    latitude: -3.7397262,
    longitude: -38.5795397,
  });

  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("Check-In Use Case", () => {
  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -3.7397262,
      userLongitude: -38.5795397,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -3.7397262,
      userLongitude: -38.5795397,
    });

    await expect(() =>
      sut.execute({
        userId: "user-01",
        gymId: "gym-01",
        userLatitude: -3.7397262,
        userLongitude: -38.5795397,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -3.7397262,
      userLongitude: -38.5795397,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -3.7397262,
      userLongitude: -38.5795397,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "Rhani's Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-3.7562433),
      longitude: new Decimal(-38.5096403),
    });

    await expect(() =>
      sut.execute({
        userId: "user-01",
        gymId: "gym-02",
        userLatitude: -3.7397262,
        userLongitude: -38.5795397,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
