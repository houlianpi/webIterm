# webIterm

一个 iTerm 风格的 AI 聊天界面示例项目。前端使用 React + TypeScript + Vite，后端使用 FastAPI。目前 /api/chat 返回 mock 响应，方便后续替换成真实 AI 服务。

## 功能

- iTerm 风格窗口标题栏、终端正文区域和命令提示符
- 用户输入以终端命令行样式展示
- AI 回复以等宽字体逐行输出，并带有打字流式效果
- 支持 Solarized Dark、Solarized Light、Dracula、Nord、Monokai 主题切换
- 响应式布局，兼容桌面和移动端
- FastAPI 提供 POST /api/chat mock 接口和 CORS 支持

## 项目结构

~~~text
webIterm/
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── main.py
│   └── requirements.txt
└── README.md
~~~

## 启动方式

### 1. 启动后端

~~~bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
~~~

后端默认运行在 http://127.0.0.1:8000。

### 2. 启动前端

~~~bash
cd frontend
npm install
npm run dev
~~~

前端默认运行在 http://127.0.0.1:5173。

## 接口说明

### POST /api/chat

请求体示例：

~~~json
{
  "message": "Explain this stack trace",
  "history": [
    {
      "role": "user",
      "content": "hello"
    }
  ]
}
~~~

返回体示例：

~~~json
{
  "reply": "mock://assistant boot complete\ncwd: ~/workspace/webIterm\n..."
}
~~~

## 后续可扩展点

- 在 backend/main.py 中接入真实 LLM API
- 为前端补充会话持久化和历史记录
- 增加键盘快捷键、命令历史和更多终端细节
