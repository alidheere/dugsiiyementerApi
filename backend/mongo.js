const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let books = [
  { id: 1, title: 'Atomic Habits', author: 'James Clear' },
  { id: 2, title: 'Deep Work', author: 'Cal Newport' },
  { id: 3, title: 'The 7 Habits of Highly Effective People', author: 'Stephen R. Covey' },
  { id: 4, title: 'Think and Grow Rich', author: 'Napoleon Hill' },
  { id: 5, title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki' },
  { id: 6, title: 'The Power of Now', author: 'Eckhart Tolle' },
  { id: 7, title: 'The Alchemist', author: 'Paulo Coelho' },
  { id: 8, title: 'How to Win Friends and Influence People', author: 'Dale Carnegie' },
  { id: 9, title: 'The Psychology of Money', author: 'Morgan Housel' },
  { id: 10, title: 'The 4-Hour Workweek', author: 'Tim Ferriss' },
  { id: 11, title: 'Start With Why', author: 'Simon Sinek' },
  { id: 12, title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson' },
  { id: 13, title: 'Man’s Search for Meaning', author: 'Viktor E. Frankl' },
  { id: 14, title: 'The Lean Startup', author: 'Eric Ries' },
  { id: 15, title: 'Zero to One', author: 'Peter Thiel' },
  { id: 16, title: 'Can’t Hurt Me', author: 'David Goggins' },
  { id: 17, title: 'The Compound Effect', author: 'Darren Hardy' },
  { id: 18, title: 'Essentialism', author: 'Greg McKeown' },
  { id: 19, title: 'The One Thing', author: 'Gary Keller' },
  { id: 20, title: 'Mindset', author: 'Carol S. Dweck' }
];

app.get('/', (req, res)=>{
    res.json(books)
});
    // create
app.post('/books', (req, res)=>{
    const bookData = req.body;
      const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({
      message: 'Title and author are required'
    });
    const newBook={
        id: books.length + 1,
        title: bookData.title,
        author: bookData.author
    }
    books.push(newBook);
    res.status(201).json(newBook);
});
// raadi one bay one
app.get('/books/:id', (req, res)=>{
      const book = books.find(b => b.id == req.params.id);
    if(!book) return res.status(404).send({message: 'Book not found'});
    res.json(book);
    });
    // update
    app.put('/books/:id', (req, res)=>{
            const book = books.find(b => b.id == req.params.id);
    if(!book) return res.status(404).send({message: 'Book not found'});
   
    book.title = req.body.title;
    book.author = req.body.author;
    res.json(book)
    })
    // dleate
  app.delete('/books/:id', (req, res)=>{
    books= books.filter(b => b.id != req.params.id);
    res.send(`Book with id ${req.params.id} is deleted`);
  })




app.listen(3000, () => {
  console.log(`Server is running at http://localhost:3000`);
});
