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

    return ports[0].device

def move_telescope(ra, dec):
    port = get_first_available_port()
    if not port:
        print("❌ No port available. Exiting.")
        return "No serial port available"

    print(f"Using port: {port}")
    hc = NexStarHandControl(port)

    if not hc.is_connected():
        print("❌ Failed to connect to telescope.")
        return "Telescope connection failed"

    print("✅ Connected Successfully")

    try:
        print(f"🧭 Moving to Ra: {ra:.2f}°, Dec: {dec:.2f}°")
        hc.goto_ra_dec(ra, dec)
    except Exception as e:
        print(f"❌ Error sending move command: {e}")
        return f"Error sending move command: {e}"

    return "Move command sent successfully"


# if __name__ == "__main__":
#     # Test target after alignment
#     test_ra = 8.0
#     test_dec = 18.0

#     success = move_telescope(test_ra, test_dec)

#     if success:
#         print("✅ Move command sent successfully.")
#     else:
#         print("❌ Failed to move telescope.")
