const form = document.getElementById('coolform');
const resp = document.getElementById('response');

const API_URL = "https://api-newidentity.webcris.icu";

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log("run")
    const username = document.getElementById('username').value;

    try {
      const res = await fetch(`${API_URL}/get/github/${username}`);
      const res1 = await fetch(`${API_URL}/get/tiktok/${username}`);
      const data = await res.json();
      const data1 = await res1.json()

      resp.innerHTML = `GitHub: ${data.status} \n TikTok: ${data1.status}`;
    } catch (error) {
      console.error('Request failed:', error);
    }
});
