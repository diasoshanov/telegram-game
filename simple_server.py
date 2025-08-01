#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Простой HTTP сервер для админ панели
Работает с любым Python 3.x
"""

import json
import os
import sys
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

# Файл для хранения результатов
RESULTS_FILE = "game_results.json"

class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Обработка GET запросов"""
        try:
            path = urlparse(self.path).path
            
            if path == "/":
                # Главная страница - админ панель
                self.send_response(200)
                self.send_header('Content-type', 'text/html; charset=utf-8')
                self.end_headers()
                
                try:
                    with open('admin_panel.html', 'r', encoding='utf-8') as f:
                        content = f.read()
                    self.wfile.write(content.encode('utf-8'))
                except Exception as e:
                    error_html = f"""
                    <html>
                    <head><title>Ошибка</title></head>
                    <body>
                        <h1>Ошибка загрузки админ панели</h1>
                        <p>Файл admin_panel.html не найден или поврежден</p>
                        <p>Ошибка: {str(e)}</p>
                    </body>
                    </html>
                    """
                    self.wfile.write(error_html.encode('utf-8'))
                    
            elif path == "/api/results":
                # API для получения результатов
                self.send_response(200)
                self.send_header('Content-type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                results = self.load_results()
                self.wfile.write(json.dumps(results, ensure_ascii=False).encode('utf-8'))
                
            elif path == "/api/stats":
                # API для получения статистики
                self.send_response(200)
                self.send_header('Content-type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                results = self.load_results()
                stats = self.calculate_stats(results)
                self.wfile.write(json.dumps(stats, ensure_ascii=False).encode('utf-8'))
                
            else:
                self.send_response(404)
                self.send_header('Content-type', 'text/html; charset=utf-8')
                self.end_headers()
                self.wfile.write(b"<h1>404 - Страница не найдена</h1>")
                
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            error_msg = f"<h1>Ошибка сервера</h1><p>{str(e)}</p>"
            self.wfile.write(error_msg.encode('utf-8'))

    def do_POST(self):
        """Обработка POST запросов для добавления результатов"""
        if self.path == "/api/add_result":
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length)
                
                result_data = json.loads(post_data.decode('utf-8'))
                self.add_result(result_data)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
                
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        """Обработка CORS preflight запросов"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        """Логирование запросов"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] {format % args}")

    def load_results(self):
        """Загрузка результатов из файла"""
        if os.path.exists(RESULTS_FILE):
            try:
                with open(RESULTS_FILE, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                return []
        return []

    def save_results(self, results):
        """Сохранение результатов в файл"""
        with open(RESULTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)

    def add_result(self, result_data):
        """Добавление нового результата"""
        results = self.load_results()
        
        # Добавляем timestamp если его нет
        if 'timestamp' not in result_data:
            result_data['timestamp'] = datetime.now().isoformat()
        
        results.append(result_data)
        self.save_results(results)
        print(f"Добавлен результат: {result_data.get('user_name', 'Unknown')} - {result_data.get('score', 0)} очков")

    def calculate_stats(self, results):
        """Вычисление статистики"""
        if not results:
            return {
                "total_players": 0,
                "total_games": 0,
                "avg_score": 0,
                "top_score": 0
            }
        
        unique_players = len(set(r.get('user_id', 0) for r in results))
        total_games = len(results)
        avg_score = sum(r.get('score', 0) for r in results) / total_games
        top_score = max(r.get('score', 0) for r in results)
        
        return {
            "total_players": unique_players,
            "total_games": total_games,
            "avg_score": round(avg_score),
            "top_score": top_score
        }

def main():
    """Основная функция"""
    port = 8000
    
    print("🚀 Запуск простого HTTP сервера...")
    print(f"📊 Админ панель: http://localhost:{port}")
    print(f"🎮 Игра: https://t.me/kolesa_game_bot/Diasgame")
    print("Нажмите Ctrl+C для остановки")
    print("-" * 50)
    
    try:
        server_address = ('', port)
        httpd = HTTPServer(server_address, SimpleHandler)
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Сервер остановлен")
        httpd.server_close()
    except Exception as e:
        print(f"❌ Ошибка запуска сервера: {e}")
        print("Проверьте, что порт 8000 свободен")

if __name__ == "__main__":
    main() 