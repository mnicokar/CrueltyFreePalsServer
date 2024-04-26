require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 5000;
const m = process.env.uri;

mongoose.connect(m);

app.get("/brands", async (req, res) => {
  try {
    const Brand = mongoose.connection.collection("cruelty_free_app.brands");

    // Fetch documents in batches
    const cursor = Brand.find().batchSize(1000); // Adjust batchSize as needed

    let brands = [];
    let batch;
    while ((batch = await cursor.next())) {
      brands = brands.concat(batch);
    }

    if (brands.length === 0) {
      console.log("No brands found.");
      return res.status(404).json({ error: "No brands found" });
    }

    console.log("Number of brands found:", brands.length);

    // Log first brand object
    console.log("First brand:", brands[0]);

    res.status(200).json(brands);
  } catch (err) {
    console.error("Error fetching brands:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
