import socket
import threading
import json
import time
import vlc

# Server setup
HOST = '0.0.0.0'  # Listen on all network interfaces
PORT = 5000       # Port to listen on

# List to store links
link_list = []
player = None  # VLC player instance
is_playing = False  # Track if videos are currently playing

# Function to play links using VLC in a loop
def play_links():
    global player, is_playing
    while True:
        if is_playing and link_list:
            try:
                for link in link_list:
                    if not is_playing:  # Check if we should stop playback
                        break
                    print(f"Playing: {link}")
                    player = vlc.MediaPlayer(link)
                    player.set_fullscreen(True)
                    player.play()

                    # Wait for the media to be loaded and get its duration
                    time.sleep(1)  # Small delay to ensure media is loaded
                    media_duration = player.get_length() / 1000  # Duration in seconds

                    if media_duration > 0:
                        print(f"Playing for {media_duration} seconds")
                        time.sleep(media_duration)  # Wait for the video duration
                    else:
                        print("Unable to get media duration, playing for 10 seconds as fallback")
                        time.sleep(10)  # Fallback duration

                    player.stop()
            except Exception as e:
                print(f"Error playing {link}: {e}")
        else:
            time.sleep(1)  # Sleep briefly if not playing

# Function to handle incoming client connections
def handle_client(conn, addr):
    print(f"Connected by {addr}")
    global link_list, player, is_playing
    try:
        while True:
            data = conn.recv(1024).decode()
            if not data:
                break

            print("Raw data received:", data)

            # Handle the "start" command
            if data.lower() == "start":
                if not is_playing:
                    is_playing = True
                    print("Started video playback.")
                continue

            # Handle the "stop" command
            if data.lower() == "stop":
                if player:
                    player.stop()
                    print("Stopped the current video.")
                is_playing = False
                continue

            # Parse JSON data for URLs
            try:
                json_data = json.loads(data)
                new_link = json_data.get("url")
                if new_link:
                    print(f"Received new link: {new_link}")
                    link_list.append(new_link)
                    link_list = list(set(link_list))  # Remove duplicates
                    print(f"Updated link list: {link_list}")
            except json.JSONDecodeError:
                print("Invalid JSON received.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

# Main server loop
def start_server():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_socket:
        server_socket.bind((HOST, PORT))
        server_socket.listen()
        print(f"Server listening on {HOST}:{PORT}")
        threading.Thread(target=play_links, daemon=True).start()
        while True:
            conn, addr = server_socket.accept()
            threading.Thread(target=handle_client, args=(conn, addr)).start()

if __name__ == "__main__":
    start_server()