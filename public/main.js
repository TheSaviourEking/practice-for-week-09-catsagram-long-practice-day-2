export const createMainContent = () => {
    // Create h1
    const h1 = document.createElement("h1");
    h1.innerText = "Catstagram";

    h1.style.fontSize = "3rem";

    // Create img
    const img = document.createElement("img");
    img.style.margin = "20px";
    img.style.maxWidth = "750px";

    const container = document.querySelector(".container");
    container.appendChild(h1);
    container.appendChild(img);

    fetchImage();
};

const fetchImage = async () => {
    // Fetch image from API and set img url
    try {
        const kittenResponse = await fetch("https://api.thecatapi.com/v1/images/search?size=small");
        // Converts to JSON
        const kittenData = await kittenResponse.json();
        // console.log(kittenData);
        const kittenImg = document.querySelector("img");
        kittenImg.src = kittenData[0].url;
        kittenImg.setAttribute('data-id', kittenData[0].id);
    } catch (e) {
        console.log("Failed to fetch image", e);
    }
};

// My CODE
const cats = {};
const populateScreen = (id, count = 0, comment = null) => {
    if (id in cats) {
        const cat = cats[id];
        cat.score += count;
        if (comment) cat.comments.push(comment);
    } else {
        cats[id] = {};
        cats[id].score = count;
        cats[id].comments = comment ? [comment] : [];;
    }

    const cat = cats[id];
    const scoreDisplay = document.getElementById('score');
    scoreDisplay.childNodes[1].innerText = cat.score;

    const ul = document.getElementById('comments-display').childNodes[0];
    ul.innerHTML = '';
    if (cat.comments.length > 0) {
        cat.comments.forEach(comment => {
            const li = document.createElement('li');
            li.innerText = comment;
            ul.appendChild(li);
        });
    } else {
        ul.innerText = 'No Comment yet for this Cat!!';
    }
}

const newCatBtn = () => {
    const button = document.createElement('button');
    button.innerText = 'New Cat';

    button.style.fontSize = "1.7rem"

    button.addEventListener('click', async event => {
        event.preventDefault();

        await fetchImage();

        const imgId = document.getElementsByTagName('img')[0].dataset.id;
        populateScreen(imgId)
    })
    button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = 'grey';
    })
    button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = '';
    })

    const container = document.getElementsByClassName('container')[0];
    container.appendChild(button);
}

const upvoteAndDownvote = () => {
    const p = document.createElement('p');
    p.setAttribute('id', 'score');
    p.innerText = `Popularity Score: `;
    const span = document.createElement('span');
    p.appendChild(span);
    span.innerText = 0;

    const upvoteBtn = document.createElement('button');
    const downvoteBtn = document.createElement('button');
    upvoteBtn.innerText = 'Upvote';
    upvoteBtn.style.fontSize = '1rem';
    downvoteBtn.innerText = 'Downvote';
    downvoteBtn.style.fontSize = '1rem';

    upvoteBtn.addEventListener('click', event => {
        event.preventDefault();

        const imgId = document.getElementsByTagName('img')[0].dataset.id;
        populateScreen(imgId, 1);
    })
    downvoteBtn.addEventListener('click', event => {
        event.preventDefault();

        const imgId = document.getElementsByTagName('img')[0].dataset.id;
        populateScreen(imgId, -1);
    })

    const btnDiv = document.createElement('div');
    btnDiv.style.display = 'flex';
    btnDiv.style.marginBlock = '5px';
    btnDiv.style.gap = '1rem';

    btnDiv.appendChild(upvoteBtn);
    btnDiv.appendChild(downvoteBtn);


    const container = document.getElementsByClassName('container')[0];
    container.appendChild(p);
    container.appendChild(btnDiv);
}

/* Comment Section */
const commentSection = () => {
    const commentDiv = document.createElement('div');
    commentDiv.style.marginTop = '1rem';
    const submitBtn = document.createElement('button');
    submitBtn.innerText = 'Submit';

    const commentsDisplayDiv = document.createElement('div');
    commentsDisplayDiv.style.border = '1px solid currentColor';
    commentsDisplayDiv.style.width = '70vw';
    commentsDisplayDiv.style.marginTop = '1rem';
    commentsDisplayDiv.id = 'comments-display';

    const ul = document.createElement('ul');
    ul.innerText = 'No Comments Yet!!';
    commentsDisplayDiv.appendChild(ul);

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.name = 'addComment';
    textInput.id = 'addComment';
    textInput.placeholder = 'Add a comment!'

    commentDiv.textContent = 'Comment: ';
    commentDiv.appendChild(textInput);
    commentDiv.appendChild(submitBtn);

    submitBtn.addEventListener('click', () => {
        if (textInput.value) {
            const imgId = document.getElementsByTagName('img')[0].dataset.id;
            populateScreen(imgId, 0, textInput.value);

            textInput.value = '';
        }
    })

    /* add styles */
    commentDiv.style.display = 'flex';
    commentDiv.style.gap = '0.3rem';
    const container = document.getElementsByClassName('container')[0];
    container.appendChild(commentDiv);
    container.appendChild(commentsDisplayDiv);
}

const deleteComment = () => {
    const ul = document.getElementById('comments-display').childNodes[0];

    ul.addEventListener('mousedown', event => {
        event.stopPropagation();

        if (event.target !== event.currentTarget) {
            // event.currentTarget.removeChild(event.target);
            const imgId = document.getElementsByTagName('img')[0].dataset.id;
            const cat = cats[imgId];
            const commentIdx = cat.comments.findIndex(comment => comment === event.target.innerText);
            cat.comments.splice(commentIdx, 1);
            populateScreen(imgId)
        }
    })
}

export const phase2 = () => {
    newCatBtn();
    upvoteAndDownvote();
    commentSection();
    deleteComment();
}
