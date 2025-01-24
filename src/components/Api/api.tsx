import axios from "axios";

interface VenueStaticData {
  coordinates: [number, number]; // [longitude, latitude]
}

interface DistanceRange {
  min: number;
  max: number;
  a: number;
  b: number;
  flag?: any; // Может быть проигнорировано
}

interface VenueDynamicData {
  orderMinimumNoSurcharge: number;
  basePrice: number;
  distanceRanges: DistanceRange[];
}

interface VenueData {
  staticData: VenueStaticData;
  dynamicData: VenueDynamicData;
}

const API_BASE_URL =
  "https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues";

// Функция для получения данных о месте
const fetchVenueData = async (venueSlug: string): Promise<VenueData> => {
  try {
    // Получение статических данных
    const staticResponse = await axios.get(
      `${API_BASE_URL}/${venueSlug}/static`
    );
    const staticData: VenueStaticData = {
      coordinates: staticResponse.data.venue_raw.location.coordinates,
    };

    // Получение динамических данных
    const dynamicResponse = await axios.get(
      `${API_BASE_URL}/${venueSlug}/dynamic`
    );
    const dynamicData: VenueDynamicData = {
      orderMinimumNoSurcharge:
        dynamicResponse.data.venue_raw.delivery_specs
          .order_minimum_no_surcharge,
      basePrice:
        dynamicResponse.data.venue_raw.delivery_specs.delivery_pricing
          .base_price,
      distanceRanges:
        dynamicResponse.data.venue_raw.delivery_specs.delivery_pricing
          .distance_ranges,
    };

    // Возвращаем оба набора данных
    return { staticData, dynamicData };
  } catch (error) {
    console.error("Error fetching venue data:", error);
    throw new Error("Unable to fetch venue data");
  }
};

// Пример использования
(async () => {
  const venueSlug = "home-assignment-venue-helsinki";
  try {
    const venueData = await fetchVenueData(venueSlug);
    console.log("Venue Data:", venueData);
  } catch (error) {
    console.error("Failed to fetch venue data:", error);
  }
})();
