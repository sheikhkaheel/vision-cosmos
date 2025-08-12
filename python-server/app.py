#!/usr/bin/env python3
from flask import Flask, jsonify, request
from telescope import get_first_available_port
from nexstar_control.device import NexStarHandControl 
import datetime

app = Flask(__name__)

# Move telescope Routes

@app.route("/gotoRaDec", methods=['GET', 'POST'])     
def move_to_ra_and_dec():
    try:
        data = request.get_json(force=True)  # Parses JSON body into a Python dict
        ra = data.get('ra')
        dec = data.get('dec')
        port = get_first_available_port()
        hc = NexStarHandControl(port)
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
        hc.goto_ra_dec_precise(ra, dec)
        return jsonify({"success": True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
@app.route("/gotoAzmAlt", methods=['GET', 'POST'])          #! Not-Done 
def move_to_azm_and_alt():
    try:
        data = request.get_json(force=True)  # Parses JSON body into a Python dict
        azm = data.get('azm')
        alt = data.get('alt')
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        hc.goto_azm_alt(azm, alt)
        return jsonify({"success": True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400

@app.route("/gotoAzmAltPrecise", methods=['GET', 'POST'])    #! Not-Done
def move_to_azm_and_alt__precise():
    try:
        data = request.get_json(force=True)  # Parses JSON body into a Python dict
        azm = data.get('azm')
        alt = data.get('alt')
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        hc.goto_azm_alt_precise(azm, alt)
        return jsonify({"success": True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400

# Get Ra/Dec Routes

@app.route("/getRaDec", methods=['GET', 'POST'])
def get_position_ra_dec():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
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
        position = hc.get_position_ra_dec_precise()
        return jsonify({"ra": position[0], "dec": position[1]})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
@app.route("/getAzmAlt", methods=['GET', 'POST'])               #! Not-Done
def get_position_azm_alt():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        position = hc.get_position_azm_alt()
        return jsonify({"ra": position[0], "dec": position[1]})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400

@app.route("/getAzmAltPrecise", methods=['GET', 'POST'])           #! Not-Done
def get_position_azm_alt_precise():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        position = hc.get_position_azm_alt_precise()
        return jsonify({"ra": position[0], "dec": position[1]})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    

# Slew Routes

@app.route("/slewAzmVariable", methods=['GET', 'POST'])             #! Not-Done
def slew_azm():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        data = request.get_json(force=True)  # Parses JSON body into a Python dict
        rate = data.get("rate")
        hc.slew_azm_variable(rate)
        return jsonify({"success":True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400

@app.route("/slewAltVariable", methods=['GET', 'POST'])               #! Not-Done
def slew_alt():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        data = request.get_json(force=True)  # Parses JSON body into a Python dict
        rate = data.get("rate")
        hc.slew_alt_variable(rate)
        return jsonify({"success":True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
@app.route("/slewVariable", methods=['GET', 'POST'])                      #! Not-Done
def slew_variable():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        data = request.get_json(force=True)  # Parses JSON body into a Python dict
        azmRate = data.get("azm_rate")
        altRate = data.get("alt_rate")
        hc.slew_variable(azmRate, altRate)
        return jsonify({"success":True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
@app.route("/slewAzmFixed", methods=['GET', 'POST'])                         #! Not-Done
def slew_azm_fixed():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        data = request.get_json(force=True)  # Parses JSON body into a Python dict
        rate = data.get("rate")
        hc.slew_azm_fixed(rate)
        return jsonify({"success":True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
@app.route("/slewAltFixed", methods=['GET', 'POST'])                           #! Not-Done
def slew_alt_fixed():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        data = request.get_json(force=True)  # Parses JSON body into a Python dict
        rate = data.get("rate")
        hc.slew_alt_fixed(rate)
        return jsonify({"success":True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
@app.route("/slewFixed", methods=['GET', 'POST'])                                #! Not-Done
def slew_fixed():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        data = request.get_json(force=True)  # Parses JSON body into a Python dict
        azmRate = data.get("azm_rate")
        altRate = data.get("alt_rate")
        hc.slew_fixed(azmRate, altRate)
        return jsonify({"success":True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
@app.route("/slewStop", methods=['GET', 'POST'])                                  #! Not-Done
def slew_stop():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        hc.slew_stop()
        return jsonify({"success":True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
# Location Routes

@app.route("/getLocation", methods=['GET', 'POST'])                                #! Not-Done
def get_location():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        location = hc.get_location()
        return jsonify({"success":True, "latitude": location[0], "longitude": location[1]})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
@app.route("/setLocation", methods=['GET', 'POST'])                                 #! Not-Done
def set_location():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        data = request.get_json(force=True)  # Parses JSON body into a Python dict
        latitude = data.get("latitude")
        longitude = data.get("longitude")
        hc.set_location(latitude, longitude)
        return jsonify({"success":True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400


# Time Route

@app.route("/getTime", methods=['GET', 'POST'])                                       #! Not-Done
def get_time():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        time = hc.get_time()
        return jsonify({"success":True, "time": time})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
@app.route("/setTime", methods=['GET', 'POST'])                                        #! Not-Done
def set_time():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        data = request.get_json(force=True)  # Parses JSON body into a Python dict
        hour = data.get("hour")
        min = data.get("min")
        sec = data.get("sec")
        time_value = datetime.datetime.now().replace(hour=hour, minute=min, second=sec, microsecond=0)
        hc.set_time(time_value)
        return jsonify({"success":True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
# Tracking Routes

@app.route("/getTrackingMode", methods=['GET', 'POST'])                                   #! Not-Done
def get_tracking_mode():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        tracking_mode = hc.get_tracking_mode()
        return jsonify({"success":True,"tracking_mode": tracking_mode})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
@app.route("/setTrackingMode", methods=['GET', 'POST'])                                    #! Not-Done
def set_tracking_mode():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        data = request.get_json(force=True)  # Parses JSON body into a Python dict
        tracking_mode = data.get("tracking_mode")
        hc.set_tracking_mode(tracking_mode)
        return jsonify({"success":True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
# Device Version Route

#? Incomplete  2

# Common Telescope Route 

#? Incomplete  3
    
# Sync Routes

@app.route("/syncRaDec", methods=['GET', 'POST'])                                           #! Not-Done
def sync_ra_dec():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        data = request.get_json(force=True)  # Parses JSON body into a Python dict
        ra = data.get("ra")
        dec = data.get("dec")
        hc.sync_ra_dec(ra, dec)
        return jsonify({"success":True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
@app.route("/syncPreciseRaDec", methods=['GET', 'POST'])                                      #! Not-Done
def sync_precise_ra_dec():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        data = request.get_json(force=True)  # Parses JSON body into a Python dict
        ra = data.get("ra")
        dec = data.get("dec")
        hc.sync_ra_dec_precise(ra, dec)
        return jsonify({"success":True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
# Stop Telescope Movement
    
@app.route("/cancleGotoMovement", methods=['GET', 'POST'])                                      
def cancel_goto_movement():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        hc.cancel_goto()
        return jsonify({"success":True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    print("Starting server on http://localhost:4000")
    app.run(host="0.0.0.0", port=4000, debug=True)
