#!/usr/bin/env python3
from flask import Flask, jsonify, request
from telescope import move_telescope ,get_first_available_port
from nexstar_control.device import NexStarHandControl 

app = Flask(__name__)

@app.route("/gotoRaDec", methods=['GET', 'POST'])
def move_to_ra_and_dec():
    try:
        data = request.get_json(force=True)  # Parses JSON body into a Python dict
        ra = data.get('ra')
        dec = data.get('dec')
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        print(hc)
        hc.goto_ra_dec(ra, dec)
        return jsonify({"success": True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400

@app.route("/gotoRaDecPrecise", methods=['GET', 'POST'])
def move_to_ra_and_dec__precise():
    try:
        data = request.get_json(force=True)  # Parses JSON body into a Python dict
        ra = data.get('ra')
        dec = data.get('dec')
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        print(hc)
        hc.goto_ra_dec_precise(ra, dec)
        return jsonify({"success": True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400

@app.route("/getRaDec", methods=['GET', 'POST'])
def get_position_ra_dec():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        print(hc)
        position = hc.get_position_ra_dec()
        return jsonify({"ra": position[0], "dec": position[1]})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400

@app.route("/getRaDecPrecise", methods=['GET', 'POST'])
def get_position_ra_dec_precise():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        print(hc)
        position = hc.get_position_ra_dec_precise()
        return jsonify({"ra": position[0], "dec": position[1]})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    print("Starting server on http://localhost:4000")
    app.run(host="0.0.0.0", port=4000, debug=True)
