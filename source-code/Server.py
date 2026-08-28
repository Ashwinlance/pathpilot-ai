import http.server
import socketserver
import os

PORT = 3000
DIRECTORY = r"C:\Users\Ashwin Lance\.gemini\antigravity\scratch\pathpilot\dist"


class SPADirectoryHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        path = self.translate_path(self.path)
        if not os.path.exists(path) and not '.' in os.path.basename(self.path):
            self.path = '/index.html'
        return super().do_GET()


with socketserver.TCPServer(("127.0.0.1", PORT), SPADirectoryHandler) as httpd:
    print(f"PathPilot local server running at http://localhost:{PORT}")
    httpd.serve_forever()
