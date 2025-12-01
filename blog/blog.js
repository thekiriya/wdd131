// articles array 
const articles = [
    {
        id: 1,
        title: "Septimus Heap Book One: Magyk",
        date: "July 5, 2022",
        datetime: "2022-07-05",
        ages: "10–14",
        genre: "Fantasy",
        stars: "⭐⭐⭐⭐",
        img: "https://upload.wikimedia.org/wikipedia/en/5/5f/Magkycover2.jpg",
        description: "If you enjoy stories about seventh sons of seventh sons and magyk this is the book for you."
    },
    {
        id: 2,
        title: "Magnus Chase Book One: Sword of Summer",
        date: "December 12, 2021",
        datetime: "2021-12-12",
        ages: "12–16",
        genre: "Fantasy",
        stars: "⭐⭐⭐⭐",
        img: "https://books.google.com/books/content/images/frontcover/xWuyBAAAQBAJ?fife=w300",
        description: "The anticipated new novel by Rick Riordan. After Greek mythology, Greek/Roman, and Egyptian mythos, we now dive into Norse adventures."
    },
    {
        id: 3,
        title: "Belgarid Book One: Pawn of Prophecy",
        date: "Feb 12, 2022",
        datetime: "2022-02-12",
        ages: "12–16",
        genre: "Fantasy",
        stars: "⭐⭐⭐⭐",
        img: "https://images-na.ssl-images-amazon.com/images/I/41ZbWxnInIL.jpg",
        description: "A fierce dispute among the Gods and the theft of a powerful Orb leaves the World divided into darkness."
    }
];



const articleSection = document.querySelector(".articles");
articleSection.innerHTML = ""; 


function renderArticles() {
    articles.forEach(article => {
        
        const articleElement = document.createElement("article");

        // Left 
        const details = document.createElement("div");
        details.classList.add("details");
        details.innerHTML = `
            <p><time datetime="${article.datetime}">${article.date}</time></p>
            <p>Ages: ${article.ages}</p>
            <p>Genre: ${article.genre}</p>
            <p>Rating: ${article.stars}</p>
        `;

        //right
        const content = document.createElement("div");
        content.classList.add("content");
        content.innerHTML = `
            <h2>${article.title}</h2>
            <img src="${article.img}" alt="Book cover for ${article.title}">
            <p>${article.description} <a href="#">Read More...</a></p>
        `;

        
        articleElement.appendChild(details);
        articleElement.appendChild(content);

        
        articleSection.appendChild(articleElement);
    });
}

renderArticles();
