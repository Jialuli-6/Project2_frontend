This repo includes part of the frontend documents.</br>


<h2>Environment Requirements</h2>

<h3>Basic Dependencies</h3>
• Operating System: Windows/macOS/Linux</br>
• Python 3.8+</br>
• Network Environment: Local service ports must be accessible</br>

<h3>Required Software</h3>
• Git (optional, for code cloning)</br>
• Web Browser (Chrome/Firefox latest versions recommended)</br>


<h2>Data Requirements</h2>

```python
├─/root/Project Folder
        ├─node_modules
        ├─backend
             ├─backend.py
             ├─backend_api.py
             ├─data folder
             ├─YU env
        ├─sciscinet-frontend
             ├─node_modules
                    ├─src
                       ├─App.tsx
                       ├─global.d.ts
                       ├─main.tsx
             ├─node_modules
             ├─public
             ├─index.html
        ├─YU env
...
```


<h2>Frontend Application Deployment</h2>


<h3>Obtain Frontend Code</h3>
Establish the directory containing React code (main.tsx, App.tsx, etc.) in the root project folder:</br>

```python
npm create vite@latest frontend -- --template react-ts
cd frontend  # Navigate to frontend code directory
```

<h4>Example from MacOS</h4>

```python
npm create vite@latest sciscinet-frontend -- --template react-ts
cd ../Desktop/../Yeshiva University Chatbot/sciscinet-frontend
python -m venv YU
source YU/bin/activate
```

<h3>Install Dependencies</h3>

```python
npm install
npm install react-vega vega vega-lite vega-tooltip vega-themes vega-embed 
```

<h3>Configure API Address (if needed)</h3>

If the backend service address is not [http://localhost:8010], update the base API URL in the frontend code (e.g., in network-related components):</br>

```python
### Example: Modify base API path
const API_BASE_URL = "http://your-backend-ip:8010/api";
```

<h3>Start Frontend Environment</h3>

```python
npm run dev    
```

The frontend application will run at [http://localhost:3000](http://localhost:5173) (default port, open the link).

<h2>Operation and Verification</h2>
1.	Ensure the backend service is running prior to the start of the frontend

```python
uvicorn backend_api:app --reload --port 8010
```

2.	Start the frontend application

```python
npm run dev   
```

3. For macOS, disable AirPlay to avoid port deprecation</br>
4. Open a browser and access [http://localhost:3000](http://localhost:5173)</br>










