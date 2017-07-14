/**
 * Created by Igor on 10.07.2017.
 */

let url = 'https://api.myjson.com/bins/152f9j';

function sendAjax(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
            resolve(xhr.response);
        });
        xhr.addEventListener('error', () => {
            reject();
        });
        xhr.send();
    });


}

function buildPage(obj, counter) {
    let arr = obj.slice(0, counter * 10);
    let postList = document.querySelector('.post__list');
    let ul = document.createElement('ul');
    let container = document.querySelector('.flex-container');
    if (postList.firstElementChild) {
        container.removeChild(postList);
        container.appendChild(ul);
        ul.className = 'post__list';
    }
    arr.forEach((postOne) => {
        let post = new CreatePost(postOne);
        document.getElementsByClassName('post__list')[0].appendChild(post);
    });

}

function searchByInput(obj) {
    let input = document.querySelector('.search__input');
    let string = input.value.toLowerCase();
    if (string === '') {
        return obj;
    }
    let arrString = string.split(' ');
    return obj.filter(post => arrString.every(str => post.title.toLowerCase().includes(str)));

}

function selectTags(event) {
    let eventTarget = event.target;
    if (eventTarget.classList.contains('active')) {
        eventTarget.classList.remove('active');
        localStorage.clear();
    } else {
        eventTarget.classList.add('active');
    }
}

function checkLocalStorage() {
    let tags = localStorage.getItem('tagsList');
    if (!tags) {
        return false;
    }
    tags = tags.split(',');
    let notActive = document.querySelectorAll('.tag__list li');
    notActive.forEach(item => {
        tags.forEach(i => {
            if (item.innerHTML === i) {
                item.classList.add('active');
            }
        });
    });
    return tags;
}

function filterTags(obj) {

    let tagListArr = document.querySelectorAll('.tag__list .active');

    let tags = [];
    tagListArr.forEach((item) => {
        tags.push(item.innerHTML);
    });

    if (!tagListArr.length) {
        tags = checkLocalStorage();
        if (!tags) {
            return obj;
        }
    }

    if (tagListArr.length) localStorage.setItem('tagsList', tags);
    let arr = [...obj];
    let filteredArr = [];

    arr.forEach((post) => {
        tags.forEach((tag) => {
            if (post.tags.includes(tag)) {
                filteredArr.push(post);
            }
        });
    });
    return filteredArr;

}

function sortPostsByDate(array) {
    return array.sort(function (a, b) {
        let x = a['createdAt'];
        let y = b['createdAt'];
        if (x < y) return 1;
        if (x > y) return -1;
        else return 0;
    });
}

function generator(posts, currentItems) {
    let filteredPosts = filterTags(posts);
    buildPage(filteredPosts, currentItems);
}

window.addEventListener("load", () => {
    sendAjax(url).then((response) => {
        let data = response.data;
        sortPostsByDate(data);
        return data;
    }).then(data => {
        let scrollCounter = 1;
        generator(data, scrollCounter);

        let input = document.querySelector('.search__input');
        let tagList = document.querySelector('ul.tag__list');
        let flexContainer = document.querySelector('.flex-container');

        input.addEventListener('input', () => {
            let sortedData = searchByInput(data);
            scrollCounter = 1;
            generator(sortedData, scrollCounter++);
            document.onscroll = function () {
                let heightPage = document.documentElement;
                if (window.pageYOffset > (heightPage.scrollHeight - heightPage.clientHeight - 100)) {
                    generator(sortedData, scrollCounter++)
                }
            }
        });

        tagList.addEventListener('click', (event) => {
            selectTags(event);
            scrollCounter = 1;
            generator(data, scrollCounter);
        });

        flexContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('post__delete')) {
                event.target.parentNode.remove();
            }
        });

        document.onscroll = function () {
            let heightPage = document.documentElement;
            if (window.pageYOffset > (heightPage.scrollHeight - heightPage.clientHeight - 100)) {
                generator(data, scrollCounter++)

            }
        }


    });

});

function CreatePost(obj) {
    let deleteBtn = document.createElement('div');
    let post = document.createElement('li');
    let date = document.createElement('span');
    let title = document.createElement('p');
    let description = document.createElement('p');
    let span = document.createElement('span');
    let img = document.createElement('img');


    let postTitle = document.createElement('div');
    let postTags = document.createElement('div');
    let postPicture = document.createElement('div');
    let postDescription = document.createElement('div');
    let postDate = document.createElement('div');

    title.innerHTML = obj['title'];
    img.src = obj['image'];
    description.innerHTML = obj['description'];
    date.innerHTML = (new Date(Date.parse(obj.createdAt))).toLocaleString().split(',  ');

    if (obj.tags.length) {
        for (let i = 0; i < obj.tags.length; i++) {
            let span = document.createElement('span');
            span.innerHTML = obj.tags[i];
            postTags.appendChild(span);
        }
    }
    postTitle.className = 'post__title';
    postTags.className = 'post__tags';
    postDescription.className = 'post__description';
    postDate.className = 'post__date';
    postPicture.className = 'post__picture';
    deleteBtn.className = 'post__delete';


    postDate.appendChild(date);
    postTitle.appendChild(title);
    postPicture.appendChild(img);
    postDescription.appendChild(description);

    post.appendChild(postTitle);
    post.appendChild(postTags);
    post.appendChild(postPicture);
    post.appendChild(postDescription);
    post.appendChild(postDate);
    post.appendChild(deleteBtn);
    post.className = 'post__item';
    return post;
}




