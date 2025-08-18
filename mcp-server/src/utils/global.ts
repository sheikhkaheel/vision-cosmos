export async function api(...args: Parameters<typeof fetch>) {
  let domain_name = "http://localhost:4000";
  let [path, ...restArgs] = args;
  if (
    typeof path === "string" &&
    (!path.startsWith("http") || !path.startsWith("https"))
  ) {
    path = domain_name + path.startsWith("/") ? path : `/${path}`;
  }
  try {
    const result = await fetch(path, ...restArgs);
    if (result.status < 200 || result.status > 299) {
      throw (await result.json()).error;
    }
    return result.json();
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log("Error:", err.message);
    }
    console.log("Unknow Error");
  }
}
