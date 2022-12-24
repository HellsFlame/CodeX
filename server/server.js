// Contains the code to make a call to openai

import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

// To be able to use dotenv variables
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Creating an instance of openai
const openai = new OpenAIApi(configuration);

// Initializing our express application
const app = express();

// Allows us to make cross-origin requests and allows our server to be called from frontend
app.use(cors());

// Allows us to send JSON from frontend to backend
app.use(express.json());

// Creating a dummy root route
app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello From CodeX",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`, //passing it from the frontend (textarea)
      temperature: 0, //Higher temperature value means the model will take more risks
      max_tokens: 3000, //Maximum number of tokens to generate in a completion
      top_p: 1,
      frequency_penalty: 0.5, //Means its not gonna repeat similar sentences often
      presence_penalty: 0,
    });

    // Sending the response back to frontend
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

// Making sure our server always listens from our request
app.listen(5000, () =>
  console.log("Server is running on port http://localhost:5000")
);
