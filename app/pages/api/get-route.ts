export async function getRoute(reqBody) {
  console.log("fetching route");
  try {
    const response = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask": "*",
        },
        body: JSON.stringify(reqBody),
        referrer: "https://wandermap.vercel.app",
      }
    );

    const data = await response.json(); // Wait for the JSON data

    console.log("response data:", data); // Now data is the actual JSON


    if (data.hasOwnProperty("error")) {
      console.log(data.error);
      return null; // Or throw an error
    }

    if (!data.hasOwnProperty("routes")) {
      console.log(
        "No routes found. Something might be wrong with request data"
      );
      return null; // Or handle this case appropriately
    }

    return data; // Return the data for the caller to use
  } catch (error) {
    console.error("Error fetching route data:", error);
    return null; // Or throw the error
  }
}
