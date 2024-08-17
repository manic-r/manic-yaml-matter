# ManicYamlMatter
Yaml文件操作库

## 方法
- `parse`，基本功能同[`yaml`](https://www.npmjs.com/package/yaml)插件一致，追加了变量引入方法，类似于`spring boot`的yaml模式。  
  用法：  
  ``` yaml
  # spring-boot.yaml
  serve:
    port: 3000
    host: 127.0.0.1
    prefix: /api
  swagger:
    api: ${serve.prefix}/swagger
  ```  
  ``` typescript
  import { readFileSync } from 'fs';
  import { parse } from 'manic-yaml-matter';
  const context = readFileSync('./spring-boot.yaml', 'utf-8');
  const source = parse(context);
  console.log(source);
  ```  
  得到结果：  
  ``` json
  {
    "serve": { "port": 3000, "host": "127.0.0.1", "prefix": "/api" },
    "swagger": { "api": "/api/swagger" }
  }
  ```  
  注：  
    1. 当引入变量不存在时，会抛出异常。
    2. 不支持转义符`\`，例：`\${键}`会被解析为`\值`

- `parsef`同`parse`方法，参数为yaml的路径。  
  用法：  
  ``` typescript
  import { parsef } from 'manic-yaml-matter';
  const source = parsef('./spring-boot.yaml');
  ```  
