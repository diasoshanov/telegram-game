#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Простой сервер для сохранения результатов игр
"""

import json
import os
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
import threading

# Файл для хранения результатов
RESULTS_FILE = "game_results.json"

class ResultsHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Обработка GET запросов"""
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        if path == "/":
            # Главная страница - админ панель
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            with open('admin_panel.html', 'r', encoding='utf-8') as f:
                self.wfile.write(f.read().encode())
                
        elif path == "/api/results":
            # API для получения результатов
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            results = load_results()
            self.wfile.write(json.dumps(results, ensure_ascii=False).encode())
            
        elif path == "/api/stats":
            # API для получения статистики
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            results = load_results()
            stats = calculate_stats(results)
            self.wfile.write(json.dumps(stats, ensure_ascii=False).encode())
            
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not Found")

    def do_POST(self):
        """Обработка POST запросов для добавления результатов"""
        if self.path == "/api/add_result":
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                result_data = json.loads(post_data.decode('utf-8'))
                add_result(result_data)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode())
                
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
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
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {format % args}")

def load_results():
    """Загрузка результатов из файла"""
    if os.path.exists(RESULTS_FILE):
        try:
            with open(RESULTS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return []
    return []

def save_results(results):
    """Сохранение результатов в файл"""
    with open(RESULTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

def add_result(result_data):
    """Добавление нового результата"""
    results = load_results()
    
    # Добавляем timestamp если его нет
    if 'timestamp' not in result_data:
        result_data['timestamp'] = datetime.now().isoformat()
    
    results.append(result_data)
    save_results(results)
    print(f"Добавлен результат: {result_data.get('user_name', 'Unknown')} - {result_data.get('score', 0)} очков")

def calculate_stats(results):
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

def start_server(port=8000):
    """Запуск сервера"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, ResultsHandler)
    print(f"🚀 Сервер запущен на порту {port}")
    print(f"📊 Админ панель: http://localhost:{port}")
    print(f"🎮 Игра: https://t.me/kolesa_game_bot/Diasgame")
    print("Нажмите Ctrl+C для остановки")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Сервер остановлен")
        httpd.server_close()

if __name__ == "__main__":
    start_server() 