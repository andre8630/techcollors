describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");

      expect(response.status).toBe(200);
    });
  });
});
