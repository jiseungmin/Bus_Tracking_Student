export const fetchTimetableData = async (selectedSchedule, selectedDay, Station) => {
  const base_url = "https://bus-tracking-server-mu.vercel.app/api";
  const semester_path = selectedSchedule === "학기" ? "semester" : "vacation";
  let day_path = "";

  switch (selectedDay) {
    case "평일":
      day_path = "A_weekdays";
      break;
    case "토요일/공휴일":
      day_path = "A_holidays";
      break;
    case "일요일":
      day_path = "A_sundays";
      break;
    default:
      break;
  }

  const url = `${base_url}/${semester_path}/${day_path}?key=${Station}`;
  console.log(`Fetching data from URL: ${url}`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const response_json = await response.json();
    return { data: response_json.schedules[Station], error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
};
