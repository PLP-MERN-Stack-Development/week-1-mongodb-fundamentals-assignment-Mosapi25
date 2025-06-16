// queries.js
const { MongoClient } = require('mongodb');

async function runQueries() {
  // Replace this with your MongoDB Atlas connection string
  const uri = "mongodb+srv://<username>:<password>@<cluster-address>/test?retryWrites=true&w=majority";

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db('plp_bookstore');
    const books = db.collection('books');

    // Task 2: Basic CRUD Operations
    // 1. Find all books in a specific genre (e.g., "Fantasy")
    const fantasyBooks = await books.find({ genre: "Fantasy" }).toArray();
    console.log("Fantasy books:", fantasyBooks);

    // 2. Find books published after a certain year (e.g., after 2015)
    const recentBooks = await books.find({ published_year: { $gt: 2015 } }).toArray();
    console.log("Books published after 2015:", recentBooks);

    // 3. Find books by a specific author (e.g., "Margaret Atwood")
    const booksByAuthor = await books.find({ author: "Margaret Atwood" }).toArray();
    console.log("Books by Margaret Atwood:", booksByAuthor);

    // 4. Update the price of a specific book (e.g., "The Silent Patient" to 17.99)
    const updateResult = await books.updateOne(
      { title: "The Silent Patient" },
      { $set: { price: 17.99 } }
    );
    console.log(`Updated ${updateResult.modifiedCount} book(s)`);

    // 5. Delete a book by its title (e.g., "Anxious People")
    const deleteResult = await books.deleteOne({ title: "Anxious People" });
    console.log(`Deleted ${deleteResult.deletedCount} book(s)`);

    // Task 3: Advanced Queries
    // Find books both in stock and published after 2010
    const inStockRecentBooks = await books.find({
      in_stock: true,
      published_year: { $gt: 2010 }
    }).toArray();
    console.log("Books in stock and published after 2010:", inStockRecentBooks);

    // Use projection to return only title, author, price
    const projectionBooks = await books.find({}, {
      projection: { _id: 0, title: 1, author: 1, price: 1 }
    }).toArray();
    console.log("Projection - title, author, price:", projectionBooks);

    // Sorting by price ascending
    const sortedAsc = await books.find({}).sort({ price: 1 }).toArray();
    console.log("Books sorted by price ascending:", sortedAsc);

    // Sorting by price descending
    const sortedDesc = await books.find({}).sort({ price: -1 }).toArray();
    console.log("Books sorted by price descending:", sortedDesc);

    // Pagination: limit and skip (5 books per page), page 2 (skip first 5)
    const pageSize = 5;
    const pageNumber = 2;
    const paginatedBooks = await books.find({})
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .toArray();
    console.log(`Page ${pageNumber} (5 books per page):`, paginatedBooks);

    // Task 4: Aggregation Pipeline
    // 1. Average price of books by genre
    const avgPriceByGenre = await books.aggregate([
      {
        $group: {
          _id: "$genre",
          averagePrice: { $avg: "$price" }
        }
      }
    ]).toArray();
    console.log("Average price by genre:", avgPriceByGenre);

    // 2. Author with the most books
    const authorMostBooks = await books.aggregate([
      {
        $group: {
          _id: "$author",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]).toArray();
    console.log("Author with the most books:", authorMostBooks);

    // 3. Group books by publication decade and count
    const booksByDecade = await books.aggregate([
      {
        $group: {
          _id: {
            $concat: [
              { $toString: { $subtract: ["$published_year", { $mod: ["$published_year", 10] }] } },
              "s"
            ]
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    console.log("Books grouped by decade:", booksByDecade);

    // Task 5: Indexing
    // Create index on title
    await books.createIndex({ title: 1 });
    console.log("Created index on title");

    // Create compound index on author and published_year
    await books.createIndex({ author: 1, published_year: 1 });
    console.log("Created compound index on author and published_year");

    // Explain query performance before and after index (example on title search)
    const explainBefore = await books.find({ title: "Educated" }).explain("executionStats");
    console.log("Explain output for title search:", explainBefore.executionStats);

  } catch (error) {
    console.error("Error running queries:", error);
  } finally {
    await client.close();
  }
}

runQueries();
