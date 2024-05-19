import * as Location from "expo-location";

const SERVER_URL =
  "https://bus-tracking-server-mu.vercel.app/api/read?filePath=data.json";

export const fetchBusLocation = async (Station) => {
  const response = await fetch(SERVER_URL, { method: "GET" });
  const data = await response.json();
  const contentObj = JSON.parse(data.content);

  // Station에 따른 데이터 필터링
  const filteredContent = contentObj.filter(bus => bus.station === Station);

  console.log("Filtered contentObj: ", filteredContent);

  return {
    contentObj: filteredContent,
    userLocation: await Location.getCurrentPositionAsync({}),
  };
};
