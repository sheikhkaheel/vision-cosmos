#!/usr/bin/env python3
from flask import Flask, jsonify
from telescope import move_telescope

app = Flask(__name__)

@app.route("/<ra>/<dec>", methods=['GET', 'POST'])
def get_ra_and_dec(ra, dec):
    try:
        ra = round(float(ra), 2)
        dec = round(float(dec), 2)
        print("CO ORDINATES =>", ra, dec)

        result = move_telescope(ra=ra, dec=dec)

        return jsonify({"success": True, "message": result})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == "__main__":
    print("Starting server on http://localhost:4000")
    app.run(host="0.0.0.0", port=4000, debug=True)
