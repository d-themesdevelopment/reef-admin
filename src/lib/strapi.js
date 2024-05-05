import qs from "qs";

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the url
 * @param locale - The key to unwrap the response from
 * @param wrappedByList - If the response is a list, unwrap it
 * @returns
 */
export default async function fetchApi({
  endpoint,
  query,
  locale = "ar",
  apiUrl,
  apiToken,
}) {
  const mergedOptions = {
    next: { revalidate: 10 },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `bearer ${apiToken}`,
    },
  };

  const queryString = qs.stringify(query);

  const requestUrl = `${apiUrl}/api/${endpoint}?${queryString}&locale=${locale}`;

  try {
    const res = await fetch(requestUrl, mergedOptions);
    const data = await res.json();

    return data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
