import * as Location from "expo-location";

const SERVER_URL =
  "https://bus-tracking-server-mu.vercel.app/api/read?filePath=data.json";

export const fetchBusLocation = async () => {
  const response = await fetch(SERVER_URL, { method: "GET" });
  const data = await response.json();
  const contentObj = JSON.parse(data.content);

  return {
    latitude: contentObj.latitude,
    longitude: contentObj.longitude,
    userLocation: await Location.getCurrentPositionAsync({}),
  };
};
