// app/lib/jsonSafe.ts
export function jsonSafe(data: any) {
  if (data === undefined || data === null) return {}; // safeguard

  try {
    return JSON.parse(
      JSON.stringify(
        data,
        (_, value) =>
          typeof value === "bigint"
            ? Number(value)
            : value === undefined
            ? null // safely handle undefined
            : value
      )
    );
  } catch (error) {
    console.error("jsonSafe error:", error);
    return { error: "Failed to serialize data" };
  }
}


// export function jsonSafe(data: any) {
//   return JSON.parse(
//     JSON.stringify(data, (_, value) =>
//       typeof value === "bigint" ? Number(value) : value
//     )
//   );
// }
