const form = document.getElementById('coolform');
const resp = document.getElementById('response');

const sites = [
    "github",
    "gitlab",
    "codeberg",
    "git.gay",
    "tiktok",
    "bsky",
    "huggingface"
];

const API_URL = "https://api-newidentity.webcris.icu";

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  console.log("run");
  resp.innerHTML = "Loading";
  const username = document.getElementById('username').value;

  try {
    const results = await Promise.all(
        sites.map(async site => {
            const res = await fetch(`${API_URL}/get/${site}/${username}`);
            const data = await res.json();

            return `<p>${site}: ${data.status}</p>`;
        })
    );

    resp.innerHTML = results.join("");
  } catch (error) {
    console.error('Request failed:', error);
  }
});
