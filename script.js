// Read a cookie by name.
function getCookie(name) {
  const item = document.cookie.split('; ').find(row => row.startsWith(name + '='));
  return item ? decodeURIComponent(item.split('=').slice(1).join('=')) : null;
}

// Save a cookie for 7 days.
function setCookie(name, value) {
  document.cookie = name + '=' + encodeURIComponent(value) + '; max-age=604800; path=/; SameSite=Lax';
}

function deleteCookie(name) {
  document.cookie = name + '=; max-age=0; path=/; SameSite=Lax';
}

const likeBtn = document.getElementById('likeBtn');
const dislikeBtn = document.getElementById('dislikeBtn');
const likeCount = document.getElementById('likeCount');
const dislikeCount = document.getElementById('dislikeCount');
const voteMessage = document.getElementById('voteMessage');
const commentForm = document.getElementById('commentForm');
const commentInput = document.getElementById('commentInput');
const commentMessage = document.getElementById('commentMessage');
const commentsList = document.getElementById('commentsList');
const resetBtn = document.getElementById('resetBtn');

// Restore the current browser's state from cookies.
let vote = getCookie('lab6_vote');
if (vote !== 'like' && vote !== 'dislike') vote = null;
let comments = [];
try {
  const stored = JSON.parse(getCookie('lab6_comments') || '[]');
  if (Array.isArray(stored)) comments = stored.filter(text => typeof text === 'string');
} catch (error) {
  comments = [];
}

function updateUI() {
  likeCount.textContent = vote === 'like' ? '1' : '0';
  dislikeCount.textContent = vote === 'dislike' ? '1' : '0';
  likeBtn.disabled = vote !== null;
  dislikeBtn.disabled = vote !== null;
  likeBtn.classList.toggle('selected', vote === 'like');
  dislikeBtn.classList.toggle('selected', vote === 'dislike');
  voteMessage.textContent = vote ? 'You voted ' + vote + '. Reset to vote again.' : '';

  commentsList.replaceChildren();
  comments.forEach(comment => {
    const li = document.createElement('li');
    li.textContent = comment;
    commentsList.appendChild(li);
  });
  const hasCommented = comments.length > 0;
  commentInput.disabled = hasCommented;
  commentForm.querySelector('button').disabled = hasCommented;
  commentMessage.textContent = hasCommented ? 'You have already commented. Reset to comment again.' : '';
}

function submitVote(choice) {
  if (vote !== null) return;
  vote = choice;
  setCookie('lab6_vote', vote);
  updateUI();
}

likeBtn.addEventListener('click', () => submitVote('like'));
dislikeBtn.addEventListener('click', () => submitVote('dislike'));

commentForm.addEventListener('submit', event => {
  event.preventDefault();
  const text = commentInput.value.trim();
  if (!text || comments.length > 0) return;
  comments.push(text);
  setCookie('lab6_comments', JSON.stringify(comments));
  commentInput.value = '';
  updateUI();
});

resetBtn.addEventListener('click', () => {
  deleteCookie('lab6_vote');
  deleteCookie('lab6_comments');
  vote = null;
  comments = [];
  commentInput.value = '';
  updateUI();
  voteMessage.textContent = 'Your vote and comments have been reset.';
});

updateUI();
