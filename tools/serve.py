# 미리보기 서버. python3 -m http.server와 같은 일을 하되, 모듈 수십 개를 한꺼번에 받을 때 연결이 끊기지 않게
# 대기열을 늘리고, 고친 파일이 바로 보이게 캐시를 끈다.
# 사용: python3 tools/serve.py [포트=8793]
import functools
import http.server
import os
import sys


class Server(http.server.ThreadingHTTPServer):
    request_queue_size = 128
    daemon_threads = True


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, *args):
        pass


port = int(sys.argv[1]) if len(sys.argv) > 1 else 8793
site = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "site")
Server(("", port), functools.partial(Handler, directory=site)).serve_forever()
