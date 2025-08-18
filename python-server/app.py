#!/usr/bin/env python3
from flask import Flask, jsonify, request
from telescope import get_first_available_port
from nexstar_control.device import NexStarHandControl , LatitudeDMS, LongitudeDMS, TrackingMode, DeviceType
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
    
@app.route("/gotoAzmAlt", methods=['GET', 'POST'])           
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

@app.route("/gotoAzmAltPrecise", methods=['GET', 'POST'])    
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

# Get Ra/Dec & Azm/Alt Routes

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
    
@app.route("/getAzmAlt", methods=['GET', 'POST'])               
def get_position_azm_alt():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        position = hc.get_position_azm_alt()
        print("Posoiton =>",position, position[0])
        return jsonify({"azm": position[0], "alt": position[1]})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400

@app.route("/getAzmAltPrecise", methods=['GET', 'POST'])           
def get_position_azm_alt_precise():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        position = hc.get_position_azm_alt_precise()
        return jsonify({"azm": position[0], "alt": position[1]})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    

# Slew Routes

@app.route("/slewAzmVariable", methods=['GET', 'POST'])             
def slew_azm():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        data = request.get_json(force=True)  # Parses JSON body into a Python dict
        print("data =>",data)
        rate = int(data.get("rate"))
        print("Rate =>", rate)
        hc.slew_azm_variable(rate)
        return jsonify({"success":True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400

@app.route("/slewAltVariable", methods=['GET', 'POST'])               
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
    
@app.route("/slewVariable", methods=['GET', 'POST'])                      
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
    
@app.route("/slewAzmFixed", methods=['GET', 'POST'])                         
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
    
@app.route("/slewAltFixed", methods=['GET', 'POST'])                           
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
    
@app.route("/slewFixed", methods=['GET', 'POST'])                                
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
    
@app.route("/slewStop", methods=['GET', 'POST'])                                  
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

@app.route("/getLocation", methods=['GET', 'POST'])                                
def get_location():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        location = hc.get_location()
        latitude = location[0].to_decimal()  # or location[0].degrees
        longitude = location[1].to_decimal() # or location[1].degrees
        return jsonify({"success":True, "latitude": latitude, "longitude": longitude})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
@app.route("/setLocation", methods=['GET', 'POST'])
def set_location():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        data = request.get_json(force=True)
        latitude = float(data.get("latitude"))
        longitude = float(data.get("longitude"))
        # Use the built-in decimal→DMS conversions
        lat_dms = LatitudeDMS.from_decimal(latitude)
        lon_dms = LongitudeDMS.from_decimal(longitude)
        hc.set_location(lat=lat_dms, lng=lon_dms)
        return jsonify({"success": True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400


# Time Routes

@app.route("/getTime", methods=['GET', 'POST'])                                       
def get_time():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        time = hc.get_time()
        return jsonify({"success":True, "time": time})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
@app.route("/setTime", methods=['GET', 'POST'])
def set_time():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        data = request.get_json(force=True)
        hour = int(data.get("hour"))
        minute = int(data.get("min"))
        second = int(data.get("sec"))
        # Get local UTC offset automatically
        offset = datetime.datetime.now().astimezone().utcoffset()
        tz = datetime.timezone(offset)
        # Create a timezone-aware datetime
        now = datetime.datetime.now(tz).replace(
            hour=hour,
            minute=minute,
            second=second,
            microsecond=0
        )
        hc.set_time(now)
        return jsonify({"success": True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
# Tracking Routes

@app.route("/getTrackingMode", methods=['GET', 'POST'])                                   
def get_tracking_mode():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        tracking_mode = hc.get_tracking_mode()
        return jsonify({"success":True,"tracking_mode": tracking_mode.name})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
@app.route("/setTrackingMode", methods=['GET', 'POST'])
def set_tracking_mode():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        data = request.get_json(force=True)
        mode_input = data.get("tracking_mode")
        # Convert string or int to TrackingMode enum
        if isinstance(mode_input, str):
            tracking_mode = TrackingMode[mode_input]  # e.g. "ALT_AZ" -> TrackingMode.ALT_AZ
        else:
            tracking_mode = TrackingMode(mode_input)  # e.g. 1 -> TrackingMode.ALT_AZ
        print("Tracking Mode:-", tracking_mode)
        hc.set_tracking_mode(tracking_mode)
        return jsonify({"success": True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
# Device Routes

# DeviceType.AZM_RA_MOTOR
# DeviceType.ALT_DEC_MOTOR
# DeviceType.GPS_UNIT
# DeviceType.RTC


@app.route("/getDeviceVersion", methods=['GET', 'POST'])                                                     
def get_device_version():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        # data = request.get_json(force=True)  # Parses JSON body into a Python dict
        # Get the hand controller version
        print("List =>",list(DeviceType))
        major, minor = hc.get_device_version(DeviceType.AZM_RA_MOTOR)
        print(f"Hand Controller Firmware: {major}.{minor}")
        version = f"{major}.{minor}"
        return jsonify({"success":True, "device_version": version})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
@app.route("/getDeviceModel", methods=['GET', 'POST'])                            
def get_device_model():
    try:
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        device_model = hc.get_device_model()
        print("Device Model", device_model)
        return jsonify({"success":True, "device_model_name": device_model.name, "device_model_value":device_model.value})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400

# Common Telescope Routes

@app.route("/isConnected", methods=['GET', 'POST'])                            
def is_connected():
    try:    
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        is_connected = hc.is_connected()
        return jsonify({"success":True, "is_connected": is_connected})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
@app.route("/isAligned", methods=['GET', 'POST'])                            
def is_aligned():
    try:    
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        is_aligned = hc.is_aligned()
        return jsonify({"success":True, "is_aligned": is_aligned})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400

@app.route("/isGotoInProgress", methods=['GET', 'POST'])                            
def is_goto_in_progress():
    try:    
        port = get_first_available_port()
        hc = NexStarHandControl(port)
        is_goto_in_progress = hc.is_goto_in_progress()
        return jsonify({"success":True, "is_goto_in_progress": is_goto_in_progress})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
# Sync Routes

@app.route("/syncRaDec", methods=['GET', 'POST'])                                           
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
    
@app.route("/syncPreciseRaDec", methods=['GET', 'POST'])                                      
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
