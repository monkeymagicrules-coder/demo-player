# deploy.ps1
# 自动部署脚本

# 进入项目目录
Set-Location "C:\Users\shows\demo-player"

# 确保 main 分支
git checkout main

# 拉取最新代码
git pull origin main

# 安装依赖
npm install

# 生成生产环境代码
npm run build

# 推送到 GitHub（如果需要）
git add .
git commit -m "Auto deploy commit"
git push origin main

# 提示用户访问 Vercel 网站
Write-Host '访问你的网站 URL，例如：https://demo-player-chi.vercel.app/'

# 启动本地测试环境（可选）
Write-Host '如需本地测试，运行: npm run dev'
