# 使用Python基础镜像
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 安装Node.js和npm
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

# 复制项目文件
COPY . .

# 安装Python依赖
RUN pip install --no-cache-dir -r requirements.txt

# 安装前端依赖
RUN npm install

# 暴露端口
EXPOSE 5000
EXPOSE 3000

# 启动命令
CMD ["sh", "-c", "npm run dev & flask run --host=0.0.0.0 --port=5000"]