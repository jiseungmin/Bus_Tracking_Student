import * as Location from "expo-location";

const SERVER_URL =
  "https://bus-tracking-server-mu.vercel.app/api/read?filePath=data.json";

export const fetchBusLocation = async () => {
  const response = await fetch(SERVER_URL, { method: "GET" });
  const data = await response.json();
  const contentObj = JSON.parse(data.content);
  console.log("contentObj: ", contentObj)

  return {
    contentObj: contentObj,
    userLocation: await Location.getCurrentPositionAsync({}),
  };
};
