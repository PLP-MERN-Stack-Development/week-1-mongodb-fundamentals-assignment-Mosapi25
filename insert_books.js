// insert_books.js
const { MongoClient } = require('mongodb');

async function insertBooks() {
  // Replace this with your MongoDB Atlas connection string
  const uri = "mongodb+srv://<username>:<password>@<cluster-address>/test?retryWrites=true&w=majority";

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db('plp_bookstore');  // Your DB name
    const books = database.collection('books');   // Your collection

    const bookDocuments = [
      {
        title: "Educated",
        author: "Tara Westover",
        genre: "Memoir",
        published_year: 2018,
        price: 16.99,
        in_stock: true,
        pages: 334,
        publisher: "Random House"
      },
      {
        title: "Becoming",
        author: "Michelle Obama",
        genre: "Autobiography",
        published_year: 2018,
        price: 18.99,
        in_stock: true,
        pages: 448,
        publisher: "Crown Publishing Group"
      },
      {
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        genre: "History",
        published_year: 2011,
        price: 14.99,
        in_stock: true,
        pages: 443,
        publisher: "Harper"
      },
      {
        title: "The Night Circus",
        author: "Erin Morgenstern",
        genre: "Fantasy",
        published_year: 2011,
        price: 12.99,
        in_stock: false,
        pages: 387,
        publisher: "Doubleday"
      },
      {
        title: "The Silent Patient",
        author: "Alex Michaelides",
        genre: "Thriller",
        published_year: 2019,
        price: 15.49,
        in_stock: true,
        pages: 325,
        publisher: "Celadon Books"
      },
      {
        title: "Where the Crawdads Sing",
        author: "Delia Owens",
        genre: "Mystery",
        published_year: 2018,
        price: 14.29,
        in_stock: true,
        pages: 368,
        publisher: "G.P. Putnam's Sons"
      },
      {
        title: "Circe",
        author: "Madeline Miller",
        genre: "Mythology",
        published_year: 2018,
        price: 13.99,
        in_stock: false,
        pages: 393,
        publisher: "Little, Brown and Company"
      },
      {
        title: "Normal People",
        author: "Sally Rooney",
        genre: "Fiction",
        published_year: 2018,
        price: 11.99,
        in_stock: true,
        pages: 273,
        publisher: "Faber & Faber"
      },
      {
        title: "The Testaments",
        author: "Margaret Atwood",
        genre: "Dystopian",
        published_year: 2019,
        price: 17.50,
        in_stock: true,
        pages: 419,
        publisher: "Nan A. Talese"
      },
      {
        title: "Anxious People",
        author: "Fredrik Backman",
        genre: "Comedy",
        published_year: 2019,
        price: 13.75,
        in_stock: true,
        pages: 352,
        publisher: "Simon & Schuster"
      }
    ];

    const result = await books.insertMany(bookDocuments);
    console.log(`${result.insertedCount} books inserted successfully!`);
  } catch (error) {
    console.error("Error inserting books:", error);
  } finally {
    await client.close();
  }
}

insertBooks();

