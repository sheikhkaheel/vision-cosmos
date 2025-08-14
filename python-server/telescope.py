import serial.tools.list_ports
from nexstar_control.device import NexStarHandControl

def get_first_available_port():
    ports = serial.tools.list_ports.comports()
    if not ports:
        print("No serial ports found.")
        return None

    for port in ports:
        if "USB" in port.device or "COM" in port.device:
            return port.device

    available_port = ports[0].device

    if not available_port:
        print("No port available. Exiting.")
        return "No serial port available"

    print(f"Using port: {available_port}")

    # hc = NexStarHandControl(port)
    return ports[0].device
    # return NexStarHandControl(port)


    port = get_first_available_port()
    if not port:
        print("No port available. Exiting.")
        return "No serial port available"
    hc = NexStarHandControl(port)

    if not hc.is_connected():
        print("Failed to connect to telescope.")
        return "Telescope connection failed"

    print("Connected Successfully")

    try:
        print(f"Moving to Ra: {ra:.2f}°, Dec: {dec:.2f}°")
        hc.goto_ra_dec(ra, dec)
    except Exception as e:
        print(f"Error sending move command: {e}")
        return f"Error sending move command: {e}"

    return "Move command sent successfully"
# def decimal_to_latlon_dms(lat, lon):
#     # Latitude
#     lat_dir = Direction.NORTH if lat >= 0 else Direction.SOUTH
#     lat_abs = abs(lat)
#     lat_deg = int(lat_abs)
#     lat_min_float = (lat_abs - lat_deg) * 60
#     lat_min = int(lat_min_float)
#     lat_sec = (lat_min_float - lat_min) * 60

#     # Longitude
#     lon_dir = Direction.EAST if lon >= 0 else Direction.WEST
#     lon_abs = abs(lon)
#     lon_deg = int(lon_abs)
#     lon_min_float = (lon_abs - lon_deg) * 60
#     lon_min = int(lon_min_float)
#     lon_sec = (lon_min_float - lon_min) * 60

#     lat_dms = LatitudeDMS(lat_deg, lat_min, lat_sec, lat_dir)
#     lon_dms = LongitudeDMS(lon_deg, lon_min, lon_sec, lon_dir)

#     return lat_dms, lon_dms
