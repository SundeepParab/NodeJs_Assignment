import express from "express";

const app = express();
const PORT = 3000;

app.get("/", async (req, res) => {
  try {
    // Fetch employee from the API
    const empResponse = await fetch(
      `http://5c055de56b84ee00137d25a0.mockapi.io/api/v1/employees`
    );
    if (!empResponse.ok) throw new Error("Failed to fetch employee");

    const employees = await empResponse.json();

    // create a new array with only the required fields
    const result = employees.map((emp) => ({
      name: emp.name,
      id: emp.id,
      createdAt: emp.createdAt
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// starting the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
