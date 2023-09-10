import { NextResponse } from "next/server";

export async function getAllApplications() {
  const url = `http://64.227.22.206/applications/`;
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
  });

  if (resp.ok) {
    return await resp.json();
  }

  throw new Error("Failed to fetch data. Status: " + resp.status);
}
