import database from "@/infra/database";

async function status(request, respose) {
  const result = await database.query("SELECT 1 + 1 as sum");
  console.log(result.rows);
  return respose.status(200).json({ message: "helo" });
}

export default status;
