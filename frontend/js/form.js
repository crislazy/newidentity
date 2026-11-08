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

const API_URL = "https://newidentity-api.webcris.icu";

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  console.log("run");
  resp.innerHTML = "Loading";
  const username = document.getElementById('username').value;

  try {
    const results = await Promise.allSettled(
        sites.map(async site => {
          const res = await fetch(`${API_URL}/get/${site}/${username}`);

          if (!res.ok) throw new Error(res.status);

          const data = await res.json();

          return `<p>${site}: ${data.status}</p>`;
        })
    );

    resp.innerHTML = results.map((r, i) => {
      if (r.status == "rejected") {
        const error = r.reason;
        return `<p>${sites[i]}: ${error.message === "429" ? "Rate limited" : "Error"}</p>`;
      }

      return r.value
    }).join("");
  } catch (error) {
    console.error('Request failed:', error);
  }
});
