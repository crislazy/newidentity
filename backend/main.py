import requests
from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import re


app = Flask(__name__)

# CORS THING
CORS(app, resources={
    r"/*": {
        "origins": [
            "https://newidentity.webcris.icu"
        ]
    }
})

# LIMIT :3
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["30 per minute"]
)

# Format: website: url, taken code, user not found code
SITES = {
    "github":   ("https://api.github.com/users/{u}", 200, 404),
    "codeberg": ("https://codeberg.org/api/v1/users/{u}", 200, 404),
    "git.gay":  ("https://git.gay/api/v1/users/{u}", 200, 404),
    "webcris":  ("https://git.webcris.icu/api/v1/users/{u}", 200, 404),
    "tiktok":   ("https://www.tiktok.com/oembed?url=https://www.tiktok.com/@{u}", 200, 400),
    # ADD MORE HERE IN FUTURE(MAYBE)
}

def valid_username(username):
    if not username or len(username) > 39:
        return False

    return bool(re.fullmatch(r"[a-zA-Z0-9_-]+", username))

@app.route("/get/<site>/<username>")
def get(site, username):

    if not site in SITES:
        return jsonify({"status": "site not found :("}), 400

    if not valid_username(username):
        return jsonify({"status": "invalid username"}), 400

    url, taken_code, free_code = SITES[site] # GETS THE INFO FROM LIST

    # REQUEST PART
    try:
        r = requests.get(url.format(u=username), headers={"User-Agent": "crislzy/nity"}, timeout=6, allow_redirects=False)
    except requests.RequestException:
            return jsonify({"status": "idk bro, email cris and ask him to check the console :/"}), 502

    if r.status_code == taken_code:
        return jsonify({"status": "taken"}), 400
    elif r.status_code == free_code:
        return jsonify({"status": "available"}), 200
    else:
        return jsonify({"status": "idk bro, don't ask me rn... :/"}), 502


if __name__ == "__main__":
    app.run()
