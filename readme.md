# Stock info web application
## Link
https://stock-webapp.netlify.app/
## DB
https://www.mongodb.com/

username: niubigupiao@gmail.com

password: Niubi123!

## 添加新公司
1. 打开`config/companies.yaml`文件
2. 在末尾添加新公司的名称，股票代码，和简介
    - 新内容需要符合与之前公司相同的格式，即    
    ```yaml
    - name: 公司名
      code: 股票代码
      info: >
        简介（支持 HTML tags 和段落格式，例如<h>, <p>, <b> ...）

        这是第二段
    ```
    - 注意每一行内容前的空格必须与以上的例子相同 ([YAML syntax guide](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html))
3. 在 command line / terminal 执行：
    ```bash
    npm run updatedb 公司名
    ```
    当同时添加多个公司时，执行：
    ```bash
    npm run updatedb 公司名1,公司名2,公司名3,...,公司名n
    ```
4. 检查新公司的图表执行：
    ```
    npm run build && netlify dev
    ```
    程序运行结束后进入 http://localhost:8888/dev_index 页面

    
    或执行
    ```
    npm run build && npm start
    ```
    程序运行结束后进入 http://localhost:8888/dev_index.html 页面
