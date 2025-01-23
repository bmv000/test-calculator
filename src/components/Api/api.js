import axios from "axios";
export const ApiFI = axios.create({
  staticURL:
    " https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/home-assignment-venue-helsinki/static",
  dynamicURL:
    "https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/home-assignment-venue-helsinki/dynamic",
});

export const ApiEE = axios.create({
  staticURL:
    "  https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/home-assignment-venue-tallinn/static",
  dynamicURL:
    "https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/home-assignment-venue-tallinn/dynamic",
});