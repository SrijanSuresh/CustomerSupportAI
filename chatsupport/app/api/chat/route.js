const axios = require("axios");
require("dotenv").config(); // Load environment variables from .env

// Hugging Face API call to generate embeddings
async function getEmbedding(text) {
  const response = await axios.post(
    "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
    { inputs: text },
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,  // Make sure you set the API key in .env
      },
    }
  );

  return response.data[0];  // The embedding is returned in this format
}

// Example usage to generate embedding for a text
(async () => {
  const text = "This is an example text.";
  const embedding = await getEmbedding(text);
  console.log(embedding);

  const documents = [
    { id: 'vec1', text: "Visit the Grand Canyon in Arizona.", genre: 'drama' },
    { id: 'vec2', text: "Explore the city life in New York.", genre: 'action' },
    { id: 'vec3', text: "Experience beaches and parks in Florida.", genre: 'drama' },
    { id: 'vec4', text: "Enjoy skiing in Colorado.", genre: 'action' }
  ];

  // Store embeddings for each document
  async function generateAndStoreEmbeddings() {
    for (let doc of documents) {
      const embedding = await getEmbedding(doc.text);
      doc.embedding = embedding;  // Save the embedding for future searches
    }
  }

  // Call the function to store embeddings
  await generateAndStoreEmbeddings();
  console.log(documents);  // Now documents have embeddings associated with them

  // Function to compute cosine similarity
  function cosineSimilarity(vec1, vec2) {
    const dotProduct = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
    const magnitudeA = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
    const magnitudeB = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  // Querying the documents for most similar vectors
  async function queryDocuments(query) {
    const queryEmbedding = await getEmbedding(query);

    // Filter documents by genre if required
    const genreFilter = 'action';  // Example genre filter

    // Compute similarity for each document and rank them
    const results = documents
      .filter(doc => doc.genre === genreFilter)  // Apply genre filter
      .map(doc => ({
        id: doc.id,
        text: doc.text,
        similarity: cosineSimilarity(queryEmbedding, doc.embedding),
      }))
      .sort((a, b) => b.similarity - a.similarity);  // Sort by similarity

    // Return top 2 results
    return results.slice(0, 2);
  }

  // Example query
  const query = "I want to explore the best cities in the US.";
  const topResults = await queryDocuments(query);

  console.log(topResults);
})();
