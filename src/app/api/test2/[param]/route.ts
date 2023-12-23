import { getDatabaseConnection } from "@/infra/database";
import { globalConnection } from "@/infra/globalConnection";

const connection = getDatabaseConnection();

export async function GET(request: Request) {
  const data = {
    path: "api" + request.url.split("api")[1],
    globalConnection: await globalConnection,
    outsideHandler: await connection,
    insideHandler: await getDatabaseConnection(),
  };

  return Response.json({ data });
}
